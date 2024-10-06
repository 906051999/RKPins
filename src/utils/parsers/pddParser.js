export function parsePdd(content) {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    return lines.map(line => {
    const [fullTitle, rest] = line.split('https://');
    const link = 'https://' + (rest ? rest.split(' ')[0] : '');
    
    // 提取标题中的关键信息
    const title = extractTitle(fullTitle);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        title: title.trim(),
        description: '',
        link: link.trim(),
        parser: '拼多多'  // 添加这行
      };
    });
  }

  function extractTitle(fullTitle) {
    // 移除常见的无用词
    const uselessWords = ['点击拼多多链接，再选择浏览器打开', '整箱', '散装', '网红', '休闲', '小吃','8090后', '90后','80后','小零食','零食', '特价', '包邮', '热卖', '爆款', '促销', '限时', '抢购', '秒杀', '优惠', '折扣', '低价', '便宜', '实惠', '划算', '厂家直销', '开袋即食', '解馋', '宿舍', '卤味', '素食', '怀旧', '童年', '健康', '整袋', '特色', '特产'];
    let title = fullTitle;
    
    uselessWords.forEach(word => {
      title = title.replace(new RegExp(word, 'g'), '');
    });
    
    // 提取前30个字符作为标题
    title = title.trim().slice(0, 50);
    // 去除标题内的所有标点符号
    title = title.replace(/[，。！？、：；""''（）【】《》]/g, '');
    
    return title.trim();
  }