export function parseBilibili(content) {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    return lines.map(line => {
      const [title, link] = line.split('https://');
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        title: cleanTitle(title),
        description: '',
        link: 'https://' + link.trim(),
        parser: '哔哩哔哩'
      };
    });
}

function cleanTitle(title) {
        return title
            .trim()
            .replace(/^【/, '')
            .replace(/】$/, '')
            .replace(/-?哔哩哔哩$/, '')
            .trim();
    }