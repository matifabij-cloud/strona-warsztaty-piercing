/**
 * Polska typografia: pojedyncze litery („w”, „z”, „i”, „a”…) nie zostają na końcu linii,
 * myślnik nie zaczyna nowej linii, a liczba nie odrywa się od „zł” ani od nazwy miesiąca.
 * Zamienia zwykłą spację na twardą (niełamliwą). Działa na wszystkich tekstach z panelu,
 * także dopisanych później. Wywołanie kilka razy z rzędu niczego nie psuje.
 */
const NBSP = ' ';
const months =
  'stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|października|listopada|grudnia';

const rules: [RegExp, string][] = [
  // pojedyncza litera + spacja → litera + twarda spacja (tylko zwykłe spacje, nie nowe linie)
  [/(?<=^|[\s(„"'«\[*_])([aiouwzAIOUWZ]) +(?=\S)/g, `$1${NBSP}`],
  // spacja przed półpauzą – myślnik zostaje na końcu linii, nie na początku następnej
  [/(?<=\S) +–(?= )/g, `${NBSP}–`],
  // 150 zł, 19 marca
  [new RegExp(`(\\d) +(zł|${months})(?![\\p{L}])`, 'gu'), `$1${NBSP}$2`],
  // ul. Ogrodowa
  [/\b(ul\.|nr) +(?=\S)/g, `$1${NBSP}`],
];

export function typo<T extends string | undefined | null>(text: T): T {
  if (!text) return text;
  let s: string = text;
  for (const [re, to] of rules) s = s.replace(re, to);
  return s as T;
}
