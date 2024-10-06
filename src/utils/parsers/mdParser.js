import matter from 'gray-matter';

export function parseMd(content) {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  
  return lines.map(line => {
    const [title, rest] = line.split('https://');
    const link = 'https://' + rest.split(' ')[0];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      description: '',  // 如果需要描述，可以在这里添加
      link: link.trim()
    };
  });
}