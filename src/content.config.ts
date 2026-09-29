import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
 * Model treści strony. Pliki w src/content/ edytuje klient przez panel Pages CMS
 * (konfiguracja w .pages.yml). Schematy są celowo „wyrozumiałe”: puste pola
 * zapisane przez panel jako null traktujemy jak brak wartości, żeby literówka
 * w panelu nie wysypała budowania strony.
 */

/** Pole opcjonalne: akceptuje null/"" (tak zapisuje puste pola panel) i zamienia je na undefined. */
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === null || v === '' ? undefined : v), schema.optional());

const text = optional(z.string());

/** Lista, która może być pusta lub zapisana jako null. */
const list = <T extends z.ZodType>(item: T) =>
  z.preprocess((v) => (v == null ? [] : v), z.array(item));

/** Data jako tekst RRRR-MM-DD (YAML potrafi zamienić datę w obiekt Date). */
const isoDate = z.preprocess((v) => {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === 'string') return v.slice(0, 10);
  return v;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data musi mieć format RRRR-MM-DD'));

/** Odnośnik do innego wpisu (panel zapisuje nazwę pliku, np. „max-alves.md”). */
const ref = z.preprocess(
  (v) => (typeof v === 'string' ? v.split('/').pop()!.replace(/\.(md|json)$/i, '') : v),
  z.string(),
);

const accent = z.enum(['zolty', 'czerwony', 'zielony', 'rozowy']).catch('zolty');

const editions = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/editions' }),
  schema: z.object({
    number: z.string(), // numer edycji, np. „IV”
    title: z.string(),
    theme: text, // hasło edycji, np. „Brazylijska Przygoda”
    tagline: text,
    summary: text,
    startDate: optional(isoDate),
    endDate: optional(isoDate),
    startTime: optional(z.string()), // np. „10:00”
    dateNote: text, // gdy nie ma dokładnej daty, np. „2024”
    accent: optional(accent).transform((v) => v ?? 'zolty'),
    venue: optional(
      z.object({
        name: text,
        address: text,
        city: text,
        mapUrl: text,
      }),
    ),
    cover: text,
    poster: text,
    stats: list(z.object({ value: z.coerce.string(), label: z.string() })),
    attractions: list(
      z.object({
        title: z.string(),
        description: text,
        icon: optional(z.string()),
      }),
    ),
    speakers: list(
      z.object({
        speaker: ref,
        note: text, // np. „Gość specjalny”, temat wystąpienia
      }),
    ),
    program: list(
      z.object({
        day: optional(isoDate),
        label: text,
        items: list(
          z.object({
            time: text,
            title: z.string(),
            description: text,
            speakers: list(ref),
            host: text, // prowadzący wpisany ręcznie
          }),
        ),
      }),
    ),
    tickets: optional(
      z.object({
        status: z.enum(['wkrotce', 'sprzedaz', 'wyprzedane', 'zakonczona']).catch('wkrotce'),
        url: text,
        info: text,
        options: list(
          z.object({
            name: z.string(),
            price: text,
            description: text,
            url: text,
          }),
        ),
      }),
    ),
    openCall: optional(
      z.object({
        enabled: z.boolean().catch(false),
        title: text,
        description: text,
        deadline: optional(isoDate),
        url: text,
        buttonLabel: text,
        image: text,
      }),
    ),
    partners: list(
      z.object({
        name: z.string(),
        logo: text,
        url: text,
      }),
    ),
    gallery: list(z.string()),
    posters: list(z.string()),
    hidden: z.boolean().catch(false),
  }),
});

const speakers = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/speakers' }),
  schema: z.object({
    name: z.string(),
    photo: text,
    role: text,
    country: text,
    instagram: text,
    website: text,
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    updated: optional(isoDate),
  }),
});

export const collections = { editions, speakers, pages };
