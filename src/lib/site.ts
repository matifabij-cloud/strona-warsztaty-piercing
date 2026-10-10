import { z } from 'astro/zod';
import raw from '../data/site.json';

/** Ustawienia strony edytowane w panelu (plik src/data/site.json). */
const str = z.preprocess((v) => (v == null ? '' : v), z.string());
const schema = z.object({
  name: str,
  tagline: str,
  description: str,
  currentEdition: str,
  contact: z.object({ email: str, phone: str }),
  social: z.object({ instagram: str, facebook: str, tiktok: str, youtube: str }).partial().transform((s) => ({
    instagram: s.instagram ?? '',
    facebook: s.facebook ?? '',
    tiktok: s.tiktok ?? '',
    youtube: s.youtube ?? '',
  })),
  organizer: z.object({
    name: str,
    brand: str,
    nip: str,
    address: str,
    postalCode: str,
    city: str,
    website: str,
  }),
  about: z.object({ title: str, text: str, images: z.preprocess((v) => v ?? [], z.array(z.string())) }),
  faq: z.preprocess((v) => v ?? [], z.array(z.object({ question: str, answer: str }))),
  instagram: z.object({ feedUrl: str }).catch({ feedUrl: '' }),
  announcement: z.object({ enabled: z.boolean().catch(false), text: str, url: str }).catch({ enabled: false, text: '', url: '' }),
  newsletter: z
    .object({ enabled: z.boolean().catch(false), title: str, text: str, buttonLabel: str, url: str })
    .catch({ enabled: false, title: '', text: '', buttonLabel: '', url: '' }),
});

export type Site = z.infer<typeof schema>;
export const site: Site = schema.parse(raw);

/** Nazwa użytkownika z adresu profilu na Instagramie. */
export const instagramHandle = (url: string) => url.replace(/\/+$/, '').split('/').pop() ?? '';

/** Numer telefonu w formacie do linku tel:. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
