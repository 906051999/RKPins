import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import WebsiteList from './components/WebsiteList';

async function getWebsites() {
  const rootDir = process.cwd();
  const websitesDirectory = path.join(rootDir, 'data');
  
  async function readFilesRecursively(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return readFilesRecursively(fullPath);
      } else if (entry.isFile() && path.extname(entry.name) === '.md') {
        return fullPath;
      }
    }));
    return files.flat().filter(Boolean);
  }

  try {
    const filePaths = await readFilesRecursively(websitesDirectory);
    
    const websites = await Promise.all(filePaths.map(async (filePath) => {
      const fileContents = await fs.readFile(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const relativePath = path.relative(websitesDirectory, filePath);
      const filenameWithoutExt = path.parse(relativePath).name;
      
      const defaultWebsite = {
        title: filenameWithoutExt,
        description: '',
        url: '',
        logo: '',
        type: ['文档'],
        tags: [],
        content: content || '暂无内容',
        searchableContent: '',
        filename: filenameWithoutExt
      };

      const website = {
        ...defaultWebsite,
        ...data,
        content: content || defaultWebsite.content,
        filename: filenameWithoutExt
      };

      website.type = Array.isArray(website.type) ? website.type : [website.type].filter(Boolean);
      website.tags = Array.isArray(website.tags) ? website.tags : [website.tags].filter(Boolean);

      // 从内容中提取标签
      const contentTags = (website.content.match(/#([^\s#]+)/g) || []).map(tag => tag.substring(1));
      website.tags = [...new Set([...website.tags, ...contentTags])];

      // 将所有属性值转换为字符串并合并，包括 type 和 tags
      const attributesString = Object.entries(website)
        .filter(([key, value]) => key !== 'content' && key !== 'searchableContent')
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return value.join(' ');
          }
          return String(value);
        })
        .join(' ');
      
      // 合并所有搜索内容，包括原始标签形式
      const tagsWithHash = website.tags.map(tag => `#${tag}`).join(' ');
      website.searchableContent = `${filenameWithoutExt} ${attributesString} ${tagsWithHash} ${website.content}`;

      return website;
    }));

    console.log('已加载网站：', websites); // 用于调试

    return websites;
  } catch (error) {
    console.error('读取网站数据时出错:', error);
    return [];
  }
}

export default async function Home() {
  const websites = await getWebsites();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">RKPins</h1>
        </div>
        <WebsiteList websites={websites} />
      </div>
    </div>
  );
}
