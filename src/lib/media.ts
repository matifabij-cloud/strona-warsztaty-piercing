import type { ImageMetadata } from 'astro';

/*
 * Zdjęcia dodawane w panelu trafiają do src/assets/media/, a w treściach zapisują się
 * jako ścieżki „/media/…”. Tu zamieniamy taką ścieżkę na obraz, który Astro
 * automatycznie zmniejsza i konwertuje do lekkich formatów przy budowaniu strony.
 */
// Import „leniwy”: do strony trafiają tylko zdjęcia, które faktycznie są użyte.
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/media/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}');

const byPath = new Map<string, () => Promise<{ default: ImageMetadata }>>();
for (const [file, load] of Object.entries(files)) {
  byPath.set(file.replace(/^\/src\/assets\/media\//, '').toLowerCase(), load);
}

const warned = new Set<string>();

/** Zwraca obraz dla ścieżki z panelu lub undefined, jeśli pliku nie ma. */
export async function resolveMedia(path: string | undefined | null): Promise<ImageMetadata | undefined> {
  if (!path) return undefined;
  const key = decodeURIComponent(path)
    .trim()
    .replace(/^\.?\/*(src\/assets\/)?media\//i, '')
    .replace(/^\/+/, '')
    .toLowerCase();
  const load = byPath.get(key);
  if (!load) {
    if (!warned.has(key)) {
      warned.add(key);
      console.warn(`[media] Nie znaleziono pliku „${path}” w src/assets/media – pomijam.`);
    }
    return undefined;
  }
  return (await load()).default;
}

/**
 * Wymiary obrazu bez oznaczania oryginału jako „używany” (Astro kopiuje wtedy do strony
 * pełnowymiarowy plik, którego nikt nie pobiera).
 */
export const dims = (image: ImageMetadata): { width: number; height: number } => {
  const plain = (image as ImageMetadata & { clone?: ImageMetadata }).clone ?? image;
  return { width: plain.width, height: plain.height };
};

/** Lista obrazów z pominięciem brakujących plików. */
export const resolveMediaList = async (paths: string[]) =>
  (await Promise.all(paths.map(async (p) => ({ path: p, image: await resolveMedia(p) })))).filter(
    (x): x is { path: string; image: ImageMetadata } => Boolean(x.image),
  );
