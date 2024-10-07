import { parseMarkdown } from './mdParser';

export function parseWeb(content) {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const cards = [];
  let currentSection = '';

  for (const line of lines) {
    if (line.startsWith('# ')) {
      currentSection = line.slice(2).trim();
    } else if (line.startsWith('[')) {
      const [title, link] = parseLinkLine(line);
      if (title && link) {
        cards.push({
          id: Math.random().toString(36).substr(2, 9),
          title,
          link,
          parser: '个人站点',
          section: currentSection
        });
      }
    }
  }

  return cards;
}

function parseLinkLine(line) {
  const match = line.match(/\[(.+?)\]\((.+?)\)/);
  if (match) {
    return [match[1], match[2]];
  }
  return [null, null];
}