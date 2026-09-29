/*
 * Najnowsze posty z Instagrama pobierane podczas budowania strony.
 * Źródło: kanał JSON z serwisu Behold (behold.so) – adres wklejamy w panelu
 * (Ustawienia → Instagram) albo w zmiennej środowiskowej INSTAGRAM_FEED_URL.
 * Strona jest przebudowywana codziennie, więc posty same się odświeżają.
 */

export interface InstagramPost {
  id: string;
  permalink: string;
  image: string;
  width?: number;
  height?: number;
  caption: string;
  isVideo: boolean;
}

let cache: Promise<InstagramPost[]> | undefined;

export function getInstagramPosts(feedUrl: string | undefined, limit = 6): Promise<InstagramPost[]> {
  const url = (globalThis as any).process?.env?.INSTAGRAM_FEED_URL || feedUrl;
  if (!url) return Promise.resolve([]);
  cache ??= fetchPosts(url);
  return cache.then((posts) => posts.slice(0, limit));
}

async function fetchPosts(url: string): Promise<InstagramPost[]> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const list: any[] = Array.isArray(json) ? json : Array.isArray(json?.posts) ? json.posts : [];
    return list
      .map((p): InstagramPost | undefined => {
        const size = p?.sizes?.medium ?? p?.sizes?.large ?? p?.sizes?.small;
        const image = size?.mediaUrl ?? p?.thumbnailUrl ?? p?.mediaUrl;
        if (!p?.permalink || !image) return undefined;
        return {
          id: String(p.id ?? p.permalink),
          permalink: p.permalink,
          image,
          width: size?.width,
          height: size?.height,
          caption: String(p.prunedCaption ?? p.caption ?? '').slice(0, 180),
          isVideo: p.mediaType === 'VIDEO' || Boolean(p.isReel),
        };
      })
      .filter((p): p is InstagramPost => Boolean(p));
  } catch (err) {
    console.warn(`[instagram] Nie udało się pobrać postów (${(err as Error).message}). Pokazuję zdjęcia zastępcze.`);
    return [];
  }
}
