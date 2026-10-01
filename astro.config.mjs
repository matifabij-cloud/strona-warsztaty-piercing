// @ts-check
import { defineConfig } from 'astro/config';

// Adres strony (używany w linkach kanonicznych, mapie strony i podglądach w social media).
// Po podpięciu własnej domeny zmień go tutaj, np. na 'https://lodzkiewarsztatypiercingu.pl'
// (albo ustaw zmienną SITE_URL w Cloudflare Pages).
const site = process.env.SITE_URL || 'https://strona-warsztaty-piercing.pages.dev';

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
