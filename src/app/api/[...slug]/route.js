import { promises as fs } from 'fs';
import path from 'path';
import { getParser } from '../../../utils/parserFactory';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  if (category) {
    // 获取特定类别的卡片
    const categoryPath = path.join(process.cwd(), 'data', category);
    try {
      const files = await fs.readdir(categoryPath);
      if (files.length === 0) {
        return Response.json([]);
      }
      const cards = await Promise.all(
        files.map(async (file) => {
          const content = await fs.readFile(path.join(categoryPath, file), 'utf8');
          const parser = getParser(category, file);
          return parser(content);
        })
      );
      return Response.json(cards.flat());
    } catch (error) {
      console.error(`Error reading directory: ${error}`);
      return Response.json([]);
    }
  } else {
    // 获取所有类别
    const dataPath = path.join(process.cwd(), 'data');
    const allCategories = await fs.readdir(dataPath);
    const nonEmptyCategories = await Promise.all(
      allCategories.map(async (category) => {
        const categoryPath = path.join(dataPath, category);
        const files = await fs.readdir(categoryPath);
        return files.length > 0 ? category : null;
      })
    );
    const filteredCategories = nonEmptyCategories.filter(Boolean);
    return Response.json(filteredCategories);
  }
}