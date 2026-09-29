// @ts-check
import { defineConfig } from 'astro/config';

// Adres strony (używany w linkach kanonicznych, mapie strony i podglądach w social media).
// Na podglądzie (np. *.pages.dev) można go nadpisać zmienną środowiskową SITE_URL.
const site = process.env.SITE_URL || 'https://lodzkiewarsztatypiercingu.pl';

export default defineConfig({
  site,
  trailingSlash: 'always',
  compressHTML: true,
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  devToolbar: { enabled: false },
});
