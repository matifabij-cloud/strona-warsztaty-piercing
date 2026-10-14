import { Marked } from 'marked';
import { typo } from './typography';

// Treści z panelu (opisy, biogramy, odpowiedzi w FAQ) są w Markdownie.
// Linki zewnętrzne otwieramy w nowej karcie.
const marked = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//i.test(href);
      const t = title ? ` title="${title}"` : '';
      const ext = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${t}${ext}>${text}</a>`;
    },
  },
});

export const md = (text: string | undefined | null) => (text ? (marked.parse(typo(text), { async: false }) as string) : '');
export const mdInline = (text: string | undefined | null) =>
  text ? (marked.parseInline(typo(text), { async: false }) as string) : '';
