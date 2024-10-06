export default function CategoryList({ categories, onSelectCategory }) {
  const translateCategory = (category) => {
    const translations = {
      'music': '音乐',
      'video': '视频',
      'shop': '购物',
    };
    return translations[category.toLowerCase()] || category;
  };

  const customOrder = ['shop', 'video', 'music'];

  const sortedCategories = [...categories].sort((a, b) => {
    const indexA = customOrder.indexOf(a.toLowerCase());
    const indexB = customOrder.indexOf(b.toLowerCase());
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
      {sortedCategories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className="px-3 sm:px-4 py-1 sm:py-2 bg-primary text-white rounded-full shadow-sm hover:bg-primary-light transition-all duration-300 text-xs sm:text-sm font-medium uppercase tracking-wide"
        >
          {translateCategory(category)}
        </button>
      ))}
    </div>
  );
}
