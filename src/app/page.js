'use client';

import { useState, useEffect } from 'react';
import CategoryList from '../components/CategoryList';
import Card from '../components/Card';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchCategories();
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
    <div className="flex flex-col h-screen">
      <header className="fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-white">RK Pins</h1>
          {categories.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <CategoryList 
                categories={categories} 
                onSelectCategory={setSelectedCategory} 
              />
            </div>
          )}
        </div>
        <div className="header-fold"></div>
      </header>
      <main className="flex-grow overflow-y-auto pt-48 sm:pt-56">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {cards.flat().map((card) => (
              <Card key={card.id} {...card} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
