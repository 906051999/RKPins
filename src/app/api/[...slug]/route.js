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

  async function getLastUpdatedFromGit(filePath) {
    try {
      const logs = await git.log({ file: filePath, maxCount: 1 });
      return logs.latest ? new Date(logs.latest.date).toISOString() : null;
    } catch (error) {
      console.error('Error getting Git log:', error);
      return null;
    }
  }

  async function getLastUpdatedFromJson() {
    try {
      const lastUpdatedPath = path.join(process.cwd(), 'public', 'lastUpdated.json');
      const lastUpdatedData = JSON.parse(await fs.readFile(lastUpdatedPath, 'utf-8'));
      return lastUpdatedData;
    } catch (error) {
      console.error('Error reading lastUpdated.json:', error);
      return {};
    }
  }

  if (category) {
    const categoryPath = path.join(dataPath, category);
    const files = await fs.readdir(categoryPath);
    totalCards = files.length;
    
    // 尝试从 Git 获取最后更新时间
    lastUpdated = await getLastUpdatedFromGit(categoryPath);
    
    // 如果 Git 方法失败，从 JSON 文件获取
    if (!lastUpdated) {
      const lastUpdatedData = await getLastUpdatedFromJson();
      lastUpdated = lastUpdatedData[category] || null;
    }
  } else {
    for (const cat of categories) {
      const categoryPath = path.join(dataPath, cat);
      const files = await fs.readdir(categoryPath);
      totalCards += files.length;
    }
    
    // 尝试从 Git 获取整个 data 目录的最后更新时间
    lastUpdated = await getLastUpdatedFromGit(dataPath);
    
    // 如果 Git 方法失败，从 JSON 文件获取所有类别的最新时间
    if (!lastUpdated) {
      const lastUpdatedData = await getLastUpdatedFromJson();
      lastUpdated = Object.values(lastUpdatedData).reduce((latest, current) => 
        latest && new Date(latest) > new Date(current) ? latest : current, null);
    }
  }

  const status = {
    totalCards,
    categories: categories.length,
    lastUpdated
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