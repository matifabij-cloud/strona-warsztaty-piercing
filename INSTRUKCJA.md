# Uruchomienie strony – instrukcja krok po kroku

Wszystkie usługi poniżej są **darmowe** (poza domeną i prowizją od biletów).
Konta najlepiej zakładać na adres projektu **lodzkiewarsztatypiercingu@gmail.com** –
wtedy wszystko zostaje przy kliencie.

Szacowany czas: ok. 1–2 godziny (plus czekanie na domenę).

---

## ✅ Lista kontrolna

- [ ] 1. Strona na GitHubie w gałęzi `main`
- [ ] 2. Hosting: Cloudflare Pages (strona działa pod adresem `…pages.dev`)
- [ ] 3. Domena `lodzkiewarsztatypiercingu.pl` podpięta do Cloudflare
- [ ] 4. Codzienne odświeżanie strony (deploy hook)
- [ ] 5. Panel do edycji dla klienta (Pages CMS) + zaproszenie dla Rafała
- [ ] 6. Automatyczne tłumaczenia (klucz DeepL)
- [ ] 7. Posty z Instagrama (Behold)
- [ ] 8. Sprzedaż biletów (Evenea) – robi klient
- [ ] 9. Wizytówka Google + Google Search Console

---

## 1. Kod na GitHubie

Kod strony jest w repozytorium `matifabij-cloud/strona-warsztaty-piercing`, gałąź `main`.
Zalecane: ustaw repozytorium jako prywatne (**Settings → Danger Zone → Change visibility → Make private**).
Hosting i panel działają z prywatnym repozytorium tak samo.

## 2. Hosting – Cloudflare Pages

1. Załóż konto na [dash.cloudflare.com](https://dash.cloudflare.com/sign-up).
2. W menu wybierz **Workers & Pages → Create → Pages → Import an existing Git repository**
   (jeśli Cloudflare pokaże inny wygląd, szukaj opcji „Pages” i „Connect to Git”).
3. Połącz konto GitHub i wybierz repozytorium **strona-warsztaty-piercing**.
4. Ustawienia budowania:
   - **Production branch:** `main`
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Kliknij **Save and Deploy**. Po 1–2 minutach strona będzie pod adresem typu
   `strona-warsztaty-piercing.pages.dev` – możesz go od razu wysłać klientowi.

Od teraz **każda zmiana** (z panelu albo z kodu) publikuje się sama po ok. 1–2 minutach.
Jeśli budowanie się nie uda (np. literówka w panelu), na stronie zostaje poprzednia wersja –
strona nigdy nie „znika”.

## 3. Domena

1. Kup domenę **lodzkiewarsztatypiercingu.pl** (np. w OVH, nazwa.pl, home.pl) – najlepiej na dane
   firmy klienta (Piercing Beauty Sp. z o.o.).
2. W Cloudflare: **Add a domain** → wpisz domenę → plan **Free**.
3. Cloudflare poda dwa adresy serwerów DNS (np. `xxx.ns.cloudflare.com`). W panelu rejestratora
   domeny zmień **serwery DNS** na te dwa adresy. Zmiana działa od kilku minut do 24 godzin.
4. W projekcie Pages: **Custom domains → Set up a custom domain** → dodaj
   `lodzkiewarsztatypiercingu.pl` oraz `www.lodzkiewarsztatypiercingu.pl`.

Certyfikat SSL (kłódka, https) Cloudflare ustawia sam.

## 4. Codzienne odświeżanie strony

Strona odświeża się raz dziennie sama (nowe posty z Instagrama, licznik dni do wydarzenia,
automatyczne zamykanie naboru po terminie). Żeby to działało:

1. Cloudflare Pages → Twój projekt → **Settings → Builds → Deploy hooks → Add deploy hook**
   (nazwa: `codzienne`, gałąź: `main`) → skopiuj wygenerowany adres.
2. GitHub → repozytorium → **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `CLOUDFLARE_DEPLOY_HOOK`
   - Secret: wklej adres z punktu 1.

## 5. Panel do edycji dla klienta – Pages CMS

1. Wejdź na [app.pagescms.org](https://app.pagescms.org) → **Sign in with GitHub**.
2. Zainstaluj aplikację Pages CMS na koncie GitHub i daj jej dostęp do repozytorium
   **strona-warsztaty-piercing**.
3. Otwórz repozytorium w Pages CMS (gałąź `main`). Po lewej zobaczysz zakładki:
   **Ustawienia strony, Edycje, Prelegenci, Strony**.
4. Zaproś klienta: **Settings → Collaborators → Invite** → wpisz e-mail Rafała.
   Rafał dostanie link do logowania – **nie potrzebuje konta na GitHubie**.
5. Wyślij Rafałowi plik [INSTRUKCJA-DLA-KLIENTA.md](INSTRUKCJA-DLA-KLIENTA.md).

## 6. Automatyczne tłumaczenia – DeepL

Wszystkie obecne teksty są już przetłumaczone. Klucz DeepL jest potrzebny do tłumaczenia
**nowych** treści, które klient doda w panelu.

1. Wejdź na [deepl.com/pro-api](https://www.deepl.com/pro-api) → wybierz **DeepL API Free**
   (500 000 znaków miesięcznie za darmo – z zapasem wystarczy).
   DeepL poprosi o kartę tylko do weryfikacji – w planie Free nic nie pobiera.
2. Na koncie DeepL: **API Keys** → skopiuj klucz (kończy się na `:fx`).
3. GitHub → **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `DEEPL_API_KEY`
   - Secret: wklej klucz.

Od teraz po każdym zapisie w panelu GitHub w ciągu ~1 minuty przetłumaczy nowe teksty
i strona opublikuje się z tłumaczeniami. Dopóki klucza nie ma, nowe teksty na wersjach
EN/PT wyświetlają się po polsku.

## 7. Posty z Instagrama – Behold

1. Wejdź na [behold.so](https://behold.so) i załóż darmowe konto.
2. **Connect Instagram** → zaloguj się na konto @lodzkiewarsztatypiercingu
   (konto twórcy – jest OK).
3. Utwórz feed typu **JSON** i skopiuj jego adres (np. `https://feeds.behold.so/…`).
4. W panelu: **Ustawienia strony → Instagram na stronie → Link do kanału JSON** → wklej i zapisz.

Plan darmowy Behold: 6 ostatnich postów, odświeżanie raz dziennie – dokładnie tyle, ile pokazuje strona.
Dopóki link jest pusty, w sekcji Instagrama widać zdjęcia zastępcze z linkiem do profilu.

## 8. Sprzedaż biletów – Evenea (robi klient)

1. Klient zakłada konto organizatora na [evenea.pl](https://evenea.pl) na dane
   **Piercing Beauty Sp. z o.o.** i podpina konto bankowe.
2. Tworzy wydarzenie IV edycji (ustalenia z klientem z 5.10.2026):
   - **główne wydarzenie** (około 2000 zł) w dwóch wariantach: **bez noclegu** i **z noclegiem
     w hotelu The Loom** – ceny i szczegóły klient poda później,
   - **piątkowe wykłady**: osobny bilet na każdy wykład, 150 zł, limit **100 miejsc na wykład**;
     otwarty wykład bezpłatny – zapisy (bilet 0 zł) albo wolne wejście, do ustalenia,
   - bez pakietu 3-dniowego i bez early bird,
   - w formularzu obowiązkowe pole **„Imię i nazwisko lub pseudonim na certyfikat”**,
   - bilety **imienne** z możliwością bezpłatnej zmiany uczestnika do określonego terminu
     (zgodnie z regulaminem, który klient przygotuje przed sprzedażą),
   - język formularza EN/PT dla gości z zagranicy, **włączone faktury** (Evenea wystawia je
     w imieniu organizatora i wysyła do KSeF – warto potwierdzić z księgową).
   Prowizję Evenea klient wlicza w cenę biletu.
3. Po opublikowaniu wydarzenia – w panelu: **Edycje → IV edycja → Bilety**:
   - Status: **Sprzedaż trwa**
   - Link do sprzedaży biletów: adres wydarzenia na Evenea
   - (opcjonalnie) Rodzaje biletów z cenami – pokażą się na stronie jako lista.

Na stronie pojawi się żółty przycisk **„Kup bilet”** w nagłówku, na górze strony i w sekcji Bilety.

## 9. Wizytówka Google i Google Search Console

- **Wizytówka:** [business.google.com](https://business.google.com) → dodaj
  „Łódzkie Warsztaty Piercingu”, kategoria np. *Organizator wydarzeń*, adres organizatora
  (ul. Narutowicza 40/1, Łódź), strona www: `https://lodzkiewarsztatypiercingu.pl` → weryfikacja.
- **Search Console:** [search.google.com/search-console](https://search.google.com/search-console)
  → dodaj domenę → w **Mapy witryn** wpisz `sitemap.xml`. Strona ma już dane o wydarzeniu
  dla Google (data, miejsce), więc może pokazywać się w wynikach wyszukiwania jako wydarzenie.

---

## Ustalenia z klientem (stan na 29.09.2026)

- **IV edycja:** Piercing Festival Łódź 2027, 20–21 marca 2027, Manufaktura (część publiczna
  Łódzkich Warsztatów Piercingu). Goście specjalni: Igor Płatek, Max Alves.
- **Poprzednie edycje:** I (Marcelina Szejko – przekłuwanie języka), II (28.02–1.03.2025,
  Hotel Tobaco, Max Alves), III (24–25.01.2026, Hotel PURO, „Brazylijska Przygoda”).
- **Bilety:** zewnętrzna platforma (rekomendacja: Evenea – faktury + KSeF), pojedyncze i pakiety,
  limit ok. 120 osób, prowizja wliczona w cenę, faktury obowiązkowe.
- **Języki:** polski + automatycznie angielski i portugalski brazylijski.
- **Kontakt na stronie:** lodzkiewarsztatypiercingu@gmail.com, +48 739 003 788.
- **Organizator:** Piercing Beauty Sp. z o.o., NIP 726 266 10 31, ul. Narutowicza 40/1, 90-135 Łódź.
- **Edytuje stronę:** Rafał Chudziński.
- **Instagram:** konto twórcy – automatyczny feed przez Behold. Facebook w przygotowaniu
  (link dodaje się w panelu: Ustawienia strony → Social media).

## Do dopytania klienta

1. Czy wstęp na część publiczną w Manufakturze jest darmowy, a bilety dotyczą tylko warsztatów
   dla piercerów? (od tego zależy opis w sekcji Bilety)
2. Ceny i rodzaje biletów IV edycji oraz data startu sprzedaży.
3. Jak zgłaszać się do naboru „Piercing Artist Łódź Needs You”? Teraz przycisk otwiera e-mail
   do organizatora – jeśli będzie formularz, wystarczy podmienić link w panelu.
4. Data I edycji i ewentualne zdjęcia z niej.
5. Program IV edycji i pozostali prelegenci.
6. Logotypy partnerów w plikach (PNG z przezroczystym tłem albo SVG) – teraz są nazwy.
7. Lepsze zdjęcie Igora Płatka (obecne jest wycięte z plakatu) i opisy gości specjalnych.
8. Zdjęcia piercerki przy pracy z folderu `_oryginaly` (pliki 1000007360–62) – kto to jest
   i czy możemy ich użyć?
9. **Pilne:** stara strona studia www.piercinglodz.pl (jest też na plakacie II edycji) prowadzi teraz
   do strony z hazardem – domena prawdopodobnie wygasła i ktoś ją przejął. Link usunąłem ze strony.
   Klient powinien to sprawdzić i nie używać tego adresu w materiałach.
10. Polityka prywatności to szkic – warto, żeby ktoś po stronie klienta ją przejrzał.

## Zmiany w kodzie w przyszłości

Treści (teksty, zdjęcia, program, prelegenci, bilety, nowe edycje) klient zmienia sam w panelu.
Zmiany wyglądu lub nowych funkcji wymagają edycji kodu – opis budowy projektu jest w
[README.md](README.md).
