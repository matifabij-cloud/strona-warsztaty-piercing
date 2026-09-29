import { hashText } from './tm.mjs';
import en from './translations/en.json';
import pt from './translations/pt.json';
import { ui, type UIKey } from './ui';

export const locales = ['pl', 'en', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pl';

export const localeMeta: Record<Locale, { lang: string; hreflang: string; label: string; name: string; og: string }> = {
  pl: { lang: 'pl', hreflang: 'pl', label: 'PL', name: 'Polski', og: 'pl_PL' },
  en: { lang: 'en', hreflang: 'en', label: 'EN', name: 'English', og: 'en_GB' },
  pt: { lang: 'pt-BR', hreflang: 'pt-BR', label: 'PT', name: 'Português (Brasil)', og: 'pt_BR' },
};

/* ---------- Adresy podstron w każdym języku ---------- */

const segments = {
  editions: { pl: 'edycje', en: 'editions', pt: 'edicoes' },
  privacy: { pl: 'polityka-prywatnosci', en: 'privacy-policy', pt: 'politica-de-privacidade' },
} satisfies Record<string, Record<Locale, string>>;

const prefix = (locale: Locale) => (locale === defaultLocale ? '' : `/${locale}`);

export const paths = {
  home: (l: Locale) => `${prefix(l)}/`,
  editions: (l: Locale) => `${prefix(l)}/${segments.editions[l]}/`,
  edition: (l: Locale, slug: string) => `${prefix(l)}/${segments.editions[l]}/${slug}/`,
  privacy: (l: Locale) => `${prefix(l)}/${segments.privacy[l]}/`,
};

/** Adresy tej samej podstrony we wszystkich językach (do przełącznika języka i hreflang). */
export const alternatesFor = (make: (l: Locale) => string) =>
  Object.fromEntries(locales.map((l) => [l, make(l)])) as Record<Locale, string>;

/* ---------- Tłumaczenie treści z panelu ---------- */

type Memory = Record<string, { pl?: string; text: string }>;
const memory: Record<Exclude<Locale, 'pl'>, Memory> = { en: en as Memory, pt: pt as Memory };

/**
 * Tłumaczy tekst wpisany po polsku w panelu. Jeśli tłumaczenia jeszcze nie ma
 * (np. automat jeszcze go nie przygotował), pokazujemy oryginał.
 */
export function tr<T extends string | undefined | null>(text: T, locale: Locale): T {
  if (!text || locale === 'pl') return text;
  const hit = memory[locale][hashText(text)];
  return (hit?.text ?? text) as T;
}

/** Czy dany tekst ma już tłumaczenie (przydatne w trybie deweloperskim). */
export const hasTranslation = (text: string, locale: Locale) =>
  locale === 'pl' || Boolean(memory[locale][hashText(text)]);

/* ---------- Stałe napisy interfejsu ---------- */

export function useUI(locale: Locale) {
  const dict = ui[locale];
  return (key: UIKey, vars?: Record<string, string | number>) => {
    let s: string = dict[key] ?? ui.pl[key];
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}

/* ---------- Daty ---------- */

const intlLocale: Record<Locale, string> = { pl: 'pl-PL', en: 'en-GB', pt: 'pt-BR' };

/** Data z panelu (RRRR-MM-DD) jako obiekt Date w południe UTC – bez problemów ze strefami czasowymi. */
const toDate = (iso: string) => new Date(`${iso}T12:00:00Z`);

export function formatDate(iso: string, locale: Locale, opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat(intlLocale[locale], { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric', ...opts }).format(
    toDate(iso),
  );
}

export function formatWeekday(iso: string, locale: Locale) {
  const s = new Intl.DateTimeFormat(intlLocale[locale], { timeZone: 'UTC', weekday: 'long' }).format(toDate(iso));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Zakres dat, np. „20–21 marca 2027”, „28 lutego – 1 marca 2025”. */
export function formatDateRange(start: string | undefined, end: string | undefined, locale: Locale) {
  if (!start) return '';
  if (!end || end === start) return formatDate(start, locale);
  const [ys, ms] = start.split('-');
  const [ye, me] = end.split('-');
  const full = (iso: string) => formatDate(iso, locale);
  if (ys === ye && ms === me) {
    // ten sam miesiąc: „20–21 marca 2027” / „20–21 March 2027” / „20–21 de março de 2027”
    const endStr = full(end);
    const dayStart = Number(start.slice(8, 10));
    const dayEnd = String(Number(end.slice(8, 10)));
    return endStr.replace(new RegExp(`^${dayEnd}`), `${dayStart}–${dayEnd}`);
  }
  if (ys === ye) {
    const startNoYear = formatDate(start, locale, { year: undefined });
    return `${startNoYear} – ${full(end)}`;
  }
  return `${full(start)} – ${full(end)}`;
}

/** Krótki zapis dat, np. „20–21.03.2027”. */
export function formatDateShort(start: string | undefined, end: string | undefined) {
  if (!start) return '';
  const [y, m, d] = start.split('-');
  if (!end || end === start) return `${d}.${m}.${y}`;
  const [ye, me, de] = end.split('-');
  if (y === ye && m === me) return `${d}–${de}.${m}.${y}`;
  if (y === ye) return `${d}.${m}–${de}.${me}.${y}`;
  return `${d}.${m}.${y}–${de}.${me}.${ye}`;
}

/** Przesunięcie strefy Europe/Warsaw dla danej daty, np. „+01:00”. */
export function warsawOffset(iso: string) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Warsaw', timeZoneName: 'longOffset' }).formatToParts(toDate(iso));
  const name = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+01:00';
  const m = name.match(/GMT([+-]\d{2}:\d{2})/);
  return m ? m[1] : '+01:00';
}

/** Pełny znacznik czasu ISO z polską strefą czasową, np. „2027-03-20T10:00:00+01:00”. */
export function warsawDateTime(iso: string, time?: string) {
  const t = time && /^\d{1,2}:\d{2}$/.test(time) ? time.padStart(5, '0') : '00:00';
  return `${iso}T${t}:00${warsawOffset(iso)}`;
}
