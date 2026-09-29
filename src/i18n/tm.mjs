// Pamięć tłumaczeń (translation memory) współdzielona przez stronę i skrypt scripts/translate.mjs.
// Tłumaczenia są zapisane w src/i18n/translations/<język>.json jako { "<hash>": { "pl": "…", "text": "…" } },
// gdzie hash to skrót polskiego tekstu. Zmiana tekstu po polsku = nowy hash = nowe tłumaczenie.
import { createHash } from 'node:crypto';

/** Ujednolicenie tekstu przed liczeniem skrótu (końce linii, białe znaki na brzegach). */
export const normalize = (text) => String(text ?? '').replace(/\r\n?/g, '\n').trim();

/** Skrót polskiego tekstu – klucz w plikach tłumaczeń. */
export const hashText = (text) => createHash('sha1').update(normalize(text)).digest('hex').slice(0, 16);

/** Języki, na które tłumaczymy treści (polski jest językiem źródłowym). */
export const targetLocales = ['en', 'pt'];
