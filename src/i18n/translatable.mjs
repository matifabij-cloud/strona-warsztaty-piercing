// Lista pól treści, które tłumaczymy automatycznie (PL → EN, PT-BR).
// Używana przez scripts/translate.mjs. Na stronie tłumaczenie odbywa się przez funkcję tr(),
// więc dodając nowe pole do tłumaczenia trzeba dopisać je tutaj ORAZ użyć tr() w komponencie.
//
// Składnia ścieżek: "a.b" – pole zagnieżdżone, "lista[].pole" – pole w każdym elemencie listy,
// "body" – treść pod nagłówkiem YAML w plikach .md.

export const translatable = {
  editions: {
    dir: 'src/content/editions',
    fields: [
      'title',
      'theme',
      'tagline',
      'summary',
      'body',
      'stats[].label',
      'attractions[].title',
      'attractions[].description',
      'speakers[].note',
      'program[].label',
      'program[].items[].title',
      'program[].items[].description',
      'tickets.info',
      'tickets.options[].name',
      'tickets.options[].description',
      'tickets.options[].buttonLabel',
      'openCall.title',
      'openCall.description',
      'openCall.points[]',
      'openCall.buttonLabel',
      'partners[].role',
    ],
  },
  speakers: {
    dir: 'src/content/speakers',
    fields: ['role', 'country', 'body'],
  },
  pages: {
    dir: 'src/content/pages',
    fields: ['title', 'body'],
  },
  site: {
    file: 'src/data/site.json',
    fields: [
      'tagline',
      'description',
      'about.title',
      'about.text',
      'faq[].question',
      'faq[].answer',
      'announcement.text',
    ],
  },
};

/** Zwraca wszystkie wartości tekstowe spod ścieżki (np. "program[].items[].title"). */
export function pick(obj, path) {
  const parts = path.split('.');
  let nodes = [obj];
  for (const part of parts) {
    const isList = part.endsWith('[]');
    const key = isList ? part.slice(0, -2) : part;
    const next = [];
    for (const node of nodes) {
      if (node == null || typeof node !== 'object') continue;
      const value = node[key];
      if (isList) {
        if (Array.isArray(value)) next.push(...value);
      } else if (value !== undefined) {
        next.push(value);
      }
    }
    nodes = next;
  }
  return nodes.filter((v) => typeof v === 'string' && v.trim() !== '');
}
