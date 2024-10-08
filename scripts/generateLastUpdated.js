const fs = require('fs');
const path = require('path');

function getLastUpdatedTime(filePath) {
  const stats = fs.statSync(filePath);
  return stats.mtime.toISOString();
}

function generateLastUpdated() {
  const dataPath = path.join(process.cwd(), 'data');
  const categories = fs.readdirSync(dataPath);
  
  const lastUpdated = {};

  categories.forEach(category => {
    const categoryPath = path.join(dataPath, category);
    const files = fs.readdirSync(categoryPath);
    
    let categoryLastUpdated = null;
    files.forEach(file => {
      const filePath = path.join(categoryPath, file);
      const fileLastUpdated = getLastUpdatedTime(filePath);
      if (!categoryLastUpdated || fileLastUpdated > categoryLastUpdated) {
        categoryLastUpdated = fileLastUpdated;
      }
    });

    lastUpdated[category] = categoryLastUpdated;
  });

  const outputPath = path.join(process.cwd(), 'public', 'lastUpdated.json');
  fs.writeFileSync(outputPath, JSON.stringify(lastUpdated, null, 2));
}

generateLastUpdated();