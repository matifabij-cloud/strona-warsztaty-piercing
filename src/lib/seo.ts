import { tr, warsawDateTime, type Locale } from '../i18n';
import type { Edition } from './content';
import { site } from './site';

/** Dane organizatora w formacie schema.org (dla Google). */
export function organizationLd(siteUrl: URL) {
  const o = site.organizer;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: siteUrl.href,
    logo: new URL('/icon-512.png', siteUrl).href,
    email: site.contact.email || undefined,
    telephone: site.contact.phone || undefined,
    sameAs: [site.social.instagram, site.social.facebook, site.social.tiktok, site.social.youtube].filter(Boolean),
    parentOrganization: o.name
      ? {
          '@type': 'Organization',
          name: o.name,
          url: o.website || undefined,
          address: {
            '@type': 'PostalAddress',
            streetAddress: o.address,
            postalCode: o.postalCode,
            addressLocality: o.city,
            addressCountry: 'PL',
          },
        }
      : undefined,
  };
}

/** Wydarzenie w formacie schema.org – dzięki temu Google może pokazać datę i miejsce w wynikach. */
export function eventLd(edition: Edition, locale: Locale, pageUrl: string, imageUrl?: string, performers: string[] = []) {
  const d = edition.data;
  if (!d.startDate) return undefined;
  const tickets = d.tickets;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${tr(d.title, locale)} – ${site.name}`,
    description: tr(d.summary, locale) || tr(site.description, locale),
    startDate: warsawDateTime(d.startDate, d.startTime),
    endDate: warsawDateTime(d.endDate ?? d.startDate, '18:00'),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    inLanguage: locale === 'pt' ? 'pt-BR' : locale,
    url: pageUrl,
    image: imageUrl ? [imageUrl] : undefined,
    location: {
      '@type': 'Place',
      name: d.venue?.name || d.venue?.city || 'Łódź',
      address: {
        '@type': 'PostalAddress',
        streetAddress: d.venue?.address || undefined,
        addressLocality: d.venue?.city || 'Łódź',
        addressCountry: 'PL',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: site.organizer.name || site.name,
      url: site.organizer.website || undefined,
    },
    performer: performers.length ? performers.map((name) => ({ '@type': 'Person', name })) : undefined,
    offers:
      tickets?.url && (tickets.status === 'sprzedaz' || tickets.status === 'wyprzedane')
        ? {
            '@type': 'Offer',
            url: tickets.url,
            availability: tickets.status === 'sprzedaz' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
            priceCurrency: 'PLN',
          }
        : undefined,
  };
}
