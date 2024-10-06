'use client';

import { useState, useEffect } from 'react';
import CategoryList from '../components/CategoryList';
import Card from '../components/Card';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cards, setCards] = useState([]);
  const [showCategoryList, setShowCategoryList] = useState(false);

  useEffect(() => {
    fetchCategories();
    const timer = setTimeout(() => setShowCategoryList(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchCards(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    const response = await fetch('/api/categories');
    const data = await response.json();
    setCategories(data);
    if (data.length > 0) {
      setSelectedCategory(data[0]);
    }
  };

  const fetchCards = async (category) => {
    const response = await fetch(`/api/cards?category=${category}`);
    const data = await response.json();
    setCards(data);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-5">
          <h1 className="text-3xl font-bold text-primary tracking-wide">RK Pins</h1>
        </div>
      </header>
      <main className="flex-grow overflow-auto mt-4">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cards.map((card) => (
              <Card key={card.id} {...card} />
            ))}
          </div>
        </div>
      </main>
      {showCategoryList && categories.length > 0 && (
        <CategoryList 
          categories={categories} 
          onSelectCategory={setSelectedCategory} 
          selectedCategory={selectedCategory}  // 添加这一行
        />
      )}
    </div>
  );
}
