# Łódzkie Warsztaty Piercingu – strona internetowa

Oficjalna strona projektu **Łódzkie Warsztaty Piercingu** (PL / EN / PT-BR).
Szybka strona statyczna z panelem do edycji treści dla klienta, automatycznymi tłumaczeniami
i miejscem na sprzedaż biletów oraz posty z Instagrama.

- 📘 **Uruchomienie strony krok po kroku:** [INSTRUKCJA.md](INSTRUKCJA.md)
- 🙋 **Instrukcja dla klienta (edycja treści):** [INSTRUKCJA-DLA-KLIENTA.md](INSTRUKCJA-DLA-KLIENTA.md)

## Jak to działa

| Element | Rozwiązanie | Koszt |
|---|---|---|
| Strona | [Astro](https://astro.build) – statyczne strony HTML, bardzo szybkie | 0 zł |
| Hosting | Cloudflare Pages (budowanie z GitHuba po każdej zmianie) | 0 zł |
| Panel do edycji | [Pages CMS](https://pagescms.org) – logowanie linkiem z e-maila | 0 zł |
| Tłumaczenia | Pamięć tłumaczeń + DeepL API Free (500 tys. znaków/mies.) | 0 zł |
| Instagram | [Behold](https://behold.so) – kanał JSON, plan darmowy | 0 zł |
| Bilety | [Evenea](https://evenea.pl) – przycisk „Kup bilet” prowadzi do sprzedaży | prowizja od biletu |
| Domena | lodzkiewarsztatypiercingu.pl | ok. 50–100 zł/rok |

## Struktura projektu

```
src/
  content/
    editions/      ← edycje (jeden plik .md na edycję)
    speakers/      ← prelegenci
    pages/         ← polityka prywatności
  data/site.json   ← ustawienia: kontakt, social media, FAQ, „O projekcie”, aktualna edycja
  assets/media/    ← zdjęcia (tu trafiają pliki dodane w panelu)
  assets/brand/    ← logo (znak + napis w wektorze)
  i18n/
    ui.ts          ← stałe napisy interfejsu w 3 językach
    translations/  ← tłumaczenia treści z panelu (en.json, pt.json)
    translatable.mjs ← które pola treści są tłumaczone
  components/      ← klocki strony (Hero, Program, Bilety, Galeria…)
  views/           ← szablony podstron (wspólne dla wszystkich języków)
  pages/           ← adresy URL: /, /en/, /pt/, /edycje/…, /en/editions/…, /pt/edicoes/…
scripts/translate.mjs ← automatyczne tłumaczenie brakujących tekstów (DeepL)
.pages.yml         ← konfiguracja panelu Pages CMS
_oryginaly/        ← oryginalne zdjęcia od klienta (nie trafiają na stronę)
```

## Praca lokalna

Wymagany Node.js 22.12+.

```bash
npm install
npm run dev        # podgląd na http://localhost:4321
npm run build      # zbudowanie strony do folderu dist/
npm run preview    # podgląd zbudowanej strony
npm run translate  # tłumaczenie brakujących tekstów (wymaga DEEPL_API_KEY)
node scripts/translate.mjs --check   # które teksty nie mają jeszcze tłumaczenia
```

## Tłumaczenia

Treści wpisuje się w panelu **tylko po polsku**. Tłumaczenia EN i PT-BR są w
`src/i18n/translations/*.json` – każdy wpis to skrót polskiego tekstu + tłumaczenie.

- Po każdej zmianie treści GitHub Action (`.github/workflows/translate.yml`) tłumaczy nowe
  i zmienione teksty przez DeepL i zapisuje je w repozytorium. Strona przebudowuje się sama.
- Jeśli tłumaczenia jeszcze nie ma, na stronie EN/PT pokazuje się tekst polski (nic się nie psuje).
- Ręczna poprawka tłumaczenia: znajdź tekst w `en.json` / `pt.json` i zmień pole `text`.
  Zmiana polskiego oryginału = nowe tłumaczenie automatyczne.
- Nowe pole treści do tłumaczenia: dopisz je w `src/i18n/translatable.mjs` i użyj `tr()` w komponencie.

## Zmienne środowiskowe (opcjonalne)

| Nazwa | Gdzie | Po co |
|---|---|---|
| `DEEPL_API_KEY` | GitHub → Secrets (Actions) | automatyczne tłumaczenia |
| `CLOUDFLARE_DEPLOY_HOOK` | GitHub → Secrets (Actions) | codzienne odświeżenie strony (Instagram, liczniki) |
| `SITE_URL` | Cloudflare Pages → Variables | adres strony, jeśli inny niż `https://lodzkiewarsztatypiercingu.pl` |
| `INSTAGRAM_FEED_URL` | Cloudflare Pages → Variables | alternatywa dla pola w panelu |
