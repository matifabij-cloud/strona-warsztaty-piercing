import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from './site';

export type Edition = CollectionEntry<'editions'>;
export type Speaker = CollectionEntry<'speakers'>;

/** Identyfikator wpisu z odnośnika zapisanego przez panel (np. „iv-edycja.md” → „iv-edycja”). */
export const refId = (value: string | undefined | null) =>
  (value ?? '').split('/').pop()!.replace(/\.(md|json)$/i, '').trim().toLowerCase();

/** Data, według której sortujemy edycje (edycje bez daty traktujemy jako najstarsze). */
const sortKey = (e: Edition) => e.data.startDate ?? e.data.endDate ?? '0000-00-00';

/** Wszystkie widoczne edycje, od najnowszej. */
export async function getEditions() {
  const all = await getCollection('editions', (e) => !e.data.hidden);
  return all.sort((a, b) => (sortKey(a) < sortKey(b) ? 1 : sortKey(a) > sortKey(b) ? -1 : romanValue(b.data.number) - romanValue(a.data.number)));
}

/** Edycja wskazana w ustawieniach jako aktualna (a gdy brak – najnowsza). */
export async function getCurrentEdition() {
  const editions = await getEditions();
  const wanted = refId(site.currentEdition);
  return editions.find((e) => e.id === wanted) ?? editions[0];
}

let speakerCache: Map<string, Speaker> | undefined;
export async function getSpeakersMap() {
  if (!speakerCache) {
    const list = await getCollection('speakers');
    speakerCache = new Map(list.map((s) => [s.id, s]));
  }
  return speakerCache;
}

/** Prelegenci edycji w kolejności z panelu, razem z notatką (np. „Gość specjalny”). */
export async function getEditionSpeakers(edition: Edition) {
  const map = await getSpeakersMap();
  return edition.data.speakers
    .map((s) => ({ speaker: map.get(refId(s.speaker)), note: s.note }))
    .filter((s): s is { speaker: Speaker; note: string | undefined } => Boolean(s.speaker));
}

/** Nazwy prowadzących dla punktu programu. */
export async function programHosts(item: Edition['data']['program'][number]['items'][number]) {
  const map = await getSpeakersMap();
  const names = item.speakers.map((id) => map.get(refId(id))?.data.name).filter(Boolean) as string[];
  if (item.host) names.push(item.host);
  return names;
}

/** Dzisiejsza data w Polsce jako RRRR-MM-DD (strona budowana jest codziennie, więc statusy są aktualne). */
export const todayInPoland = () =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Warsaw', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export type EditionPhase = 'upcoming' | 'ongoing' | 'past' | 'tba';
export function editionPhase(edition: Edition, today = todayInPoland()): EditionPhase {
  const { startDate, endDate } = edition.data;
  if (!startDate) return edition.data.dateNote ? 'past' : 'tba';
  const end = endDate ?? startDate;
  if (today < startDate) return 'upcoming';
  if (today > end) return 'past';
  return 'ongoing';
}

const romanMap: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100 };
export function romanValue(roman: string) {
  const s = roman.toUpperCase().replace(/[^IVXLC]/g, '');
  if (!s) return Number.parseInt(roman, 10) || 0;
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const v = romanMap[s[i]], next = romanMap[s[i + 1]] ?? 0;
    total += v < next ? -v : v;
  }
  return total;
}

/** Kolor przewodni edycji (wartość z panelu → zmienna CSS). */
export const accentColor: Record<Edition['data']['accent'], string> = {
  zolty: 'var(--c-yellow)',
  czerwony: 'var(--c-red)',
  zielony: 'var(--c-green)',
  rozowy: 'var(--c-pink)',
};
