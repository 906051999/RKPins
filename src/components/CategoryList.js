import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CategoryList({ categories, onSelectCategory, selectedCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 5000);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="fixed bottom-4 right-4 z-20">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 ${
          showPulse ? 'animate-pulse' : ''
        }`}
        style={{ 
          backgroundColor: 'var(--primary-color, rgba(0, 0, 0, 0.8))',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
        }}
        whileHover={{ scale: 1.1, boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)' }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-48"
          >
            <div className="flex flex-col gap-2">
              {sortedCategories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => {
                    onSelectCategory(category);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 rounded-full shadow-sm transition-all duration-300 text-sm font-medium whitespace-nowrap ${
                    category === selectedCategory
                      ? 'bg-black text-white border border-primary hover:bg-primary hover:text-white'
                      : 'bg-white text-primary border border-primary hover:bg-primary hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {translateCategory(category)}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
