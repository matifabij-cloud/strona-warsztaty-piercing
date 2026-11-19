// @ts-check
import { defineConfig } from 'astro/config';

// Adres strony (używany w linkach kanonicznych, mapie strony i podglądach w social media).
// Zmienna SITE_URL w Cloudflare Pages (jeśli ustawiona) ma pierwszeństwo.
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
