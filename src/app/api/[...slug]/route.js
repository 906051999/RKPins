import { promises as fs } from 'fs';
import path from 'path';
import { getParser } from '../../../utils/parserFactory';
import simpleGit from 'simple-git';

export async function GET(request) {
  const { pathname, searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  if (pathname.endsWith('/status')) {
    return await handleStatusRequest(category);
  }

  if (category) {
    // 获取特定类别的卡片
    return await getCategoryCards(category);
  } else {
    // 获取所有类别
    return await getAllCategories();
  }
}

async function handleStatusRequest(category) {
  const dataPath = path.join(process.cwd(), 'data');
  const categories = await fs.readdir(dataPath);
  
  let totalCards = 0;
  let lastUpdated = null;

  const git = simpleGit();

  if (category) {
    const categoryPath = path.join(dataPath, category);
    const files = await fs.readdir(categoryPath);
    totalCards = files.length;
    
    // 获取类别中最新文件的最后更新时间
    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      const logs = await git.log({ file: filePath, maxCount: 1 });
      if (logs.latest) {
        const fileLastUpdated = new Date(logs.latest.date);
        if (!lastUpdated || fileLastUpdated > lastUpdated) {
          lastUpdated = fileLastUpdated;
        }
      }
    }
  } else {
    for (const cat of categories) {
      const categoryPath = path.join(dataPath, cat);
      const files = await fs.readdir(categoryPath);
      totalCards += files.length;
    }
    
    // 获取整个 data 目录的最后更新时间
    const logs = await git.log({ file: dataPath, maxCount: 1 });
    if (logs.latest) {
      lastUpdated = new Date(logs.latest.date);
    }
  }

  const status = {
    totalCards,
    categories: categories.length,
    lastUpdated: lastUpdated ? lastUpdated.toISOString() : null
  };

  return Response.json(status);
}

async function getCategoryCards(category) {
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
}

async function getAllCategories() {
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