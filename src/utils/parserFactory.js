import { parseMd } from './parsers/mdParser';
import { parseBilibili } from './parsers/bilibiliParser';
import { parsePdd } from './parsers/pddParser';

export function getParser(category, filename) {
  const lowerCategory = category.toLowerCase();
  const lowerFilename = filename.toLowerCase();

  if (lowerCategory === 'video' && lowerFilename.includes('bilibili')) {
    return parseBilibili;
  } else if (lowerCategory === 'shop' && lowerFilename.includes('pdd')) {
    return parsePdd;
  } else {
    return parseMd;
  }
}