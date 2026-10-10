#!/usr/bin/env node
/**
 * Automatyczne tłumaczenie treści strony: PL → EN i PT-BR.
 *
 * Skrypt zbiera wszystkie teksty z panelu (pola wymienione w src/i18n/translatable.mjs),
 * sprawdza, których nie ma jeszcze w plikach src/i18n/translations/*.json,
 * i tłumaczy brakujące przez DeepL (klucz w zmiennej DEEPL_API_KEY).
 *
 * Użycie:
 *   node scripts/translate.mjs            – przetłumacz brakujące teksty (wymaga DEEPL_API_KEY)
 *   node scripts/translate.mjs --check    – tylko pokaż, czego brakuje
 *   node scripts/translate.mjs --list     – wypisz wszystkie teksty (JSON) do ręcznego tłumaczenia
 *   node scripts/translate.mjs --import plik.json – wczytaj ręczne tłumaczenia [{ pl, en, pt }]
 *
 * Uruchamia się samo na GitHubie po każdej zmianie treści (.github/workflows/translate.yml).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { translatable, pick } from '../src/i18n/translatable.mjs';
import { hashText, normalize, targetLocales } from '../src/i18n/tm.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmFile = (locale) => path.join(root, 'src/i18n/translations', `${locale}.json`);
const args = process.argv.slice(2);

/* ---------- Zebranie tekstów ---------- */

function readMarkdown(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { body: raw };
  const data = YAML.parse(m[1]) ?? {};
  return { ...data, body: m[2] };
}

function collectStrings() {
  const strings = new Map(); // hash -> tekst
  const add = (text) => {
    const t = normalize(text);
    if (t) strings.set(hashText(t), t);
  };
  for (const spec of Object.values(translatable)) {
    const docs = [];
    if (spec.file) {
      docs.push(JSON.parse(fs.readFileSync(path.join(root, spec.file), 'utf8')));
    } else {
      const dir = path.join(root, spec.dir);
      for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) docs.push(readMarkdown(path.join(dir, f)));
    }
    for (const doc of docs) for (const field of spec.fields) pick(doc, field).forEach(add);
  }
  return strings;
}

const loadTM = (locale) => (fs.existsSync(tmFile(locale)) ? JSON.parse(fs.readFileSync(tmFile(locale), 'utf8')) : {});

function saveTM(locale, tm, used) {
  // Usuwamy tłumaczenia tekstów, których już nie ma na stronie, i sortujemy dla czytelnych zmian.
  const out = {};
  for (const key of Object.keys(tm).sort()) if (used.has(key)) out[key] = tm[key];
  fs.writeFileSync(tmFile(locale), JSON.stringify(out, null, 2) + '\n');
  return Object.keys(tm).length - Object.keys(out).length;
}

/* ---------- DeepL ---------- */

const deeplTarget = { en: 'EN-GB', pt: 'PT-BR' };

async function deepl(texts, locale) {
  const key = process.env.DEEPL_API_KEY;
  const endpoint = key.endsWith(':fx') ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';
  const out = [];
  for (let i = 0; i < texts.length; i += 40) {
    const batch = texts.slice(i, i + 40);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `DeepL-Auth-Key ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: batch,
        source_lang: 'PL',
        target_lang: deeplTarget[locale],
        preserve_formatting: true,
        context: 'Website of a professional body piercing workshop and festival in Łódź, Poland.',
      }),
    });
    if (!res.ok) throw new Error(`DeepL ${res.status}: ${await res.text()}`);
    const json = await res.json();
    out.push(...json.translations.map((t) => t.text));
  }
  return out;
}

/* ---------- Nazwy własne ---------- */

// DeepL czasem tłumaczy nazwy, które mają zostać bez zmian. Poprawiamy je po tłumaczeniu.
const termFixes = [
  [/(?:\bthe )?Łódź Piercing Festival/g, 'Piercing Festival Łódź'],
  [/(?:Oficinas|Workshops?) de Piercing de Łódź/g, 'Łódź Piercing Workshops'],
  [/(?:o |O )?Festival de Piercing de Łódź/g, 'Piercing Festival Łódź'],
  [/\bBursztyn(?!owo)\b/g, 'Bursztynowo'],
];
export const fixTerms = (text) => termFixes.reduce((t, [re, to]) => t.replace(re, to), text);

/* ---------- Główna logika ---------- */

const strings = collectStrings();
const used = new Set(strings.keys());

if (args.includes('--list')) {
  const tms = Object.fromEntries(targetLocales.map((l) => [l, loadTM(l)]));
  const rows = [...strings.entries()].map(([hash, pl]) => ({
    pl,
    ...Object.fromEntries(targetLocales.map((l) => [l, tms[l][hash]?.text ?? ''])),
  }));
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

if (args.includes('--import')) {
  const file = args[args.indexOf('--import') + 1];
  const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const locale of targetLocales) {
    const tm = loadTM(locale);
    for (const row of rows) {
      if (!row.pl || !row[locale]) continue;
      tm[hashText(row.pl)] = { pl: normalize(row.pl), text: normalize(row[locale]) };
    }
    const removed = saveTM(locale, tm, used);
    console.log(`[${locale}] zaimportowano, usunięto nieużywanych: ${removed}`);
  }
}

let missingTotal = 0;
for (const locale of targetLocales) {
  const tm = loadTM(locale);
  const missing = [...strings.entries()].filter(([hash]) => !tm[hash]);
  missingTotal += missing.length;
  if (args.includes('--check') || args.includes('--import')) {
    console.log(`[${locale}] brakujące tłumaczenia: ${missing.length}`);
    missing.slice(0, 20).forEach(([, pl]) => console.log(`   • ${pl.slice(0, 90).replace(/\n/g, ' ')}`));
    continue;
  }
  if (missing.length && !process.env.DEEPL_API_KEY) {
    console.log(`[${locale}] ${missing.length} tekstów bez tłumaczenia – brak DEEPL_API_KEY, pomijam (strona pokaże tekst po polsku).`);
    saveTM(locale, tm, used);
    continue;
  }
  if (missing.length) {
    const translated = await deepl(missing.map(([, pl]) => pl), locale);
    missing.forEach(([hash, pl], i) => (tm[hash] = { pl, text: fixTerms(normalize(translated[i])) }));
    console.log(`[${locale}] przetłumaczono: ${missing.length}`);
  }
  const removed = saveTM(locale, tm, used);
  if (removed) console.log(`[${locale}] usunięto nieużywanych: ${removed}`);
}

if (args.includes('--check') && missingTotal > 0) process.exitCode = 1;
