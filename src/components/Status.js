export default function Status({ category, cardCount, totalCategories, lastUpdated }) {
  const translations = {
    'music': '音乐',
    'video': '视频',
    'shop': '购物',
    'web': '网站',
  };

  const translatedCategory = translations[category] || category;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="container mx-auto p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4"></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
          <StatusItem label="类别数" value={totalCategories} />
          <StatusItem label="当前类别" value={`${translatedCategory} (${cardCount} 张卡片)`} />
          <StatusItem
            label="最后更新"
            value={formatDate(lastUpdated)}
          />
        </div>
      </div>
    </div>
  );
}

function StatusItem({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}