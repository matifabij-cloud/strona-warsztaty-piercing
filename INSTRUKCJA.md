# Strona Łódzkich Warsztatów Piercingu – instrukcja dla Mateusza

Wszystko poniżej zrobisz **bez programowania i bez Claude**. Strona, panel, tłumaczenia
i codzienne odświeżanie działają same i są darmowe.

Adres strony: https://strona-warsztaty-piercing.pages.dev
Panel do edycji: https://app.pagescms.org
Kod: GitHub, repozytorium `matifabij-cloud/strona-warsztaty-piercing`, gałąź `main`.

---

## Stan (październik 2026)

**Działa:**
- [x] Hosting Cloudflare Pages – każda zmiana publikuje się sama po 1–2 minutach
- [x] Codzienne odświeżanie strony (licznik dni, zamykanie naboru po terminie)
- [x] Panel Pages CMS
- [x] Automatyczne tłumaczenia EN i PT-BR (DeepL, plan darmowy)

**Do zrobienia (instrukcje niżej):**
- [ ] Zaproszenie Rafała do panelu
- [ ] Sprzedaż biletów – Evenea
- [ ] Newsletter – MailerLite
- [ ] Własna domena
- [ ] Posty z Instagrama na stronie – Behold
- [ ] Wizytówka Google i Google Search Console
- [ ] Odpowiedzi Rafała z ostatniego maila (wpisujesz w panelu)

---

## 1. Zaproszenie Rafała do panelu

Pages CMS → **Admin → Collaborators** → wpisz `lodzkiewarsztatypiercingu@gmail.com` → **Add**.
Rafał dostanie link do logowania, nie potrzebuje konta na GitHubie.
Wyślij mu plik [INSTRUKCJA-DLA-KLIENTA.md](INSTRUKCJA-DLA-KLIENTA.md).

## 2. Sprzedaż biletów – Evenea

Konto zakłada Rafał (na dane firmy i z jego kontem bankowym), a Tobie daje dostęp.

**Bilety do ustawienia w Evenea:**
- wykład New Generation Day: osobny bilet na każdy z 3 wykładów, 150 zł, limit 100 miejsc,
- otwarty wykład: bilet 0 zł albo wolne wejście (do ustalenia z Rafałem),
- Snake Bites Zone: 400 zł, liczba miejsc od Rafała,
- główne wydarzenie dla piercerów w The Loom Hotel (wcześniej Rafał podawał około 2000 zł,
  w wariancie z noclegiem i bez) – jeśli zostaje, cenę i program poda Rafał,
- w formularzu obowiązkowe pole **„Imię i nazwisko lub pseudonim na certyfikat”**,
- włączone faktury, formularz także po angielsku,
- prowizję Evenea Rafał wlicza w cenę.

**Gdy wydarzenie jest opublikowane**, w panelu: **Edycje → IV edycja → Bilety**:
1. **Status sprzedaży:** „Sprzedaż trwa” – na stronie pojawi się żółty przycisk „Kup bilet”.
2. **Link do sprzedaży biletów:** adres wydarzenia na Evenea.
3. W **Rodzaje biletów** przy każdym bilecie zamień **Link do zakupu lub zapisów**
   (teraz jest tam adres e-mail) na link do tego biletu w Evenea, a **Napis na przycisku**
   na „Kup bilet”.
4. Popraw **Informację o biletach** (teraz jest o rezerwacjach mailowych).
5. W **Ustawienia strony → FAQ** popraw odpowiedź „Jak kupić bilet?”.

## 3. Newsletter – MailerLite

Konto zakłada Rafał na `lodzkiewarsztatypiercingu@gmail.com` i zaprasza Ciebie jako użytkownika.

1. W MailerLite utwórz **stronę zapisu** (Landing page z formularzem): pole e-mail,
   zgoda na otrzymywanie wiadomości (RODO) i potwierdzenie zapisu mailem (double opt-in).
2. Opublikuj ją i skopiuj jej publiczny adres.
3. W panelu: **Ustawienia strony → Newsletter** → wklej adres w **Link do formularza zapisu**,
   zaznacz **Pokaż sekcję newslettera** → zapisz.

Sekcja „Bądź na bieżąco” pojawi się na stronie głównej nad FAQ.

## 4. Własna domena

1. Kup domenę (proponowana: `lodzkiewarsztatypiercingu.pl`) w dowolnym rejestratorze,
   najlepiej na dane firmy organizatora.
2. Cloudflare → **Add a domain** → wpisz domenę → plan **Free**. Cloudflare poda dwa adresy
   serwerów DNS – wpisz je w panelu rejestratora. Zmiana działa od kilku minut do 24 godzin.
3. Cloudflare → projekt strony → **Custom domains → Set up a custom domain** → dodaj domenę
   z `www` i bez.
4. Cloudflare → projekt strony → **Settings → Variables and Secrets** → dodaj zmienną
   **SITE_URL** = `https://lodzkiewarsztatypiercingu.pl` (bez ukośnika na końcu).
   Potem w **Deployments** kliknij **Retry deployment** przy ostatniej wersji.
   Dzięki temu linki dla Google i podglądy w social media będą pokazywać nowy adres.

## 5. Posty z Instagrama – Behold

1. Załóż darmowe konto na [behold.so](https://behold.so) → **Connect Instagram** →
   zaloguj się na @lodzkiewarsztatypiercingu.
2. Utwórz feed typu **JSON** i skopiuj jego adres.
3. Panel: **Ustawienia strony → Instagram na stronie → Link do kanału JSON z Behold** → wklej.

Dopóki link jest pusty, sekcja Instagrama pokazuje przycisk do profilu.

## 6. Wizytówka Google i Search Console

- **Wizytówka:** [business.google.com](https://business.google.com) → „Łódzkie Warsztaty
  Piercingu”, kategoria „Organizator wydarzeń”, adres organizatora, strona www → weryfikacja.
- **Search Console** (po podpięciu domeny): [search.google.com/search-console](https://search.google.com/search-console)
  → dodaj domenę → **Mapy witryn** → wpisz `sitemap.xml`.

---

## Codzienna praca

Treści zmienia się w panelu – opis pól i ściąga „nowy post na Instagramie → co gdzie wpisać”
są w [INSTRUKCJA-DLA-KLIENTA.md](INSTRUKCJA-DLA-KLIENTA.md).

**Zdjęcia i loga:** w panelu przy polu zdjęcia kliknij i wgraj plik.
- Zdjęcia: JPG, poziome, najlepiej 2000 px szerokości. Strona sama robi lżejsze wersje.
- Loga partnerów: PNG z przezroczystym tłem albo SVG. Logo powinno być ciemne,
  bo kafelki partnerów są jasne.
- Plakaty: oryginalne pliki graficzne, nie zrzuty z Instagrama.

**Kolejność na stronie** jest taka jak w panelu – przeciągnij element na liście, żeby go przesunąć.

## Tłumaczenia

Po każdym zapisie w panelu GitHub w ciągu około minuty tłumaczy nowe teksty na angielski
i portugalski, a strona publikuje się sama. Nazwy własne (Piercing Festival Łódź,
Bursztynowo, bevel theory) poprawiają się automatycznie.

**Jak poprawić złe tłumaczenie bez Claude:**
1. GitHub → repozytorium → plik `src/i18n/translations/en.json` (angielski)
   albo `pt.json` (portugalski) → ikona ołówka (**Edit**).
2. Wyszukaj (Ctrl+F) polski tekst – jest w polu `"pl"`.
3. Popraw tekst w polu `"text"` tuż pod nim. Nie usuwaj cudzysłowów ani przecinków.
4. **Commit changes**. Strona opublikuje się sama.

Jeśli później zmienisz ten polski tekst w panelu, tłumaczenie zrobi się od nowa.

## Gdy coś nie działa

- **Zmiana nie widać na stronie:** odczekaj 2–3 minuty i odśwież stronę z Ctrl+F5
  (albo otwórz w oknie incognito).
- **Strona się nie aktualizuje:** Cloudflare → projekt → **Deployments**. Czerwona wersja
  oznacza błąd – zwykle źle wpisane pole w panelu (na przykład data). Cofnij ostatnią zmianę
  w panelu. Na stronie zostaje poprzednia działająca wersja, strona nigdy nie znika.
- **Brak tłumaczenia:** GitHub → zakładka **Actions** → „Tłumaczenia treści”. Czerwony krzyżyk to
  najczęściej wyczerpany limit DeepL (500 000 znaków miesięcznie) albo nieważny klucz
  (sekret `DEEPL_API_KEY` w **Settings → Secrets and variables → Actions**).
  Do czasu naprawy nowe teksty na wersjach EN i PT wyświetlają się po polsku.

## Koszty

Hosting Cloudflare, panel Pages CMS, GitHub, DeepL (plan darmowy) i Behold (plan darmowy)
są bezpłatne. Płatna jest tylko domena (raz w roku) i prowizja Evenea od biletów.

## Zmiany wyglądu i nowe funkcje

Treści zmienia się w panelu. Zmiany wyglądu albo nowe funkcje wymagają zmian w kodzie –
opis budowy projektu jest w [README.md](README.md).
