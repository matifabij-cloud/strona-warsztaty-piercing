import type { APIRoute } from 'astro';
import { alternatesFor, localeMeta, locales, paths, type Locale } from '../i18n';
import { getEditions } from '../lib/content';

// Mapa strony dla wyszukiwarek, z powiązaniem wersji językowych (hreflang).
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://lodzkiewarsztatypiercingu.pl');
  const editions = await getEditions();
  const groups: Record<Locale, string>[] = [
    alternatesFor(paths.home),
    alternatesFor(paths.editions),
    ...editions.map((e) => alternatesFor((l) => paths.edition(l, e.id))),
    alternatesFor(paths.privacy),
  ];

  const urls = groups.flatMap((group) =>
    locales.map((l) => {
      const links = locales
        .map((alt) => `<xhtml:link rel="alternate" hreflang="${localeMeta[alt].hreflang}" href="${new URL(group[alt], base).href}"/>`)
        .join('');
      return `<url><loc>${new URL(group[l], base).href}</loc>${links}</url>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
