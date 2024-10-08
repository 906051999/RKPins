import { parseMd } from './parsers/mdParser';
import { parseBilibili } from './parsers/bilibiliParser';
import { parsePdd } from './parsers/pddParser';
import { parseWeb } from './parsers/webParser';
import { parseGithub } from './parsers/githubParser';

export function getParser(category, filename) {
  const lowerCategory = category.toLowerCase();
  const lowerFilename = filename.toLowerCase();

  if (lowerCategory === 'video' && lowerFilename.includes('bilibili')) {
    return parseBilibili;
  } else if (lowerCategory === 'shop' && lowerFilename.includes('pdd')) {
    return parsePdd;
  } else if (lowerCategory === 'web' && lowerFilename.includes('private')) {
    return parseWeb;
  } else if (lowerCategory === 'web' && lowerFilename.includes('github')) {
    return parseGithub;
  } else {
    return parseMd;
  }
}