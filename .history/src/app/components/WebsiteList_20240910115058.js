'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Card from './Card';
import DocumentCard from './DocumentCard';
import CardModal from './CardModal';
import { pinyin } from 'pinyin-pro';

export default function WebsiteList({ websites }) {
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showDocuments, setShowDocuments] = useState(false);
  const [highlightedText, setHighlightedText] = useState('');
  const [highlightedWebsites, setHighlightedWebsites] = useState([]);
  const [modalHighlightedText, setModalHighlightedText] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const searchInputRef = useRef(null);

  const allTypes = [...new Set(websites.flatMap(website => website.type))].filter(type => type !== '文档');

  const allContent = useMemo(() => {
    return websites.flatMap(website => {
      // 排除 logo 属性和内容中的图片链接
      const { logo, ...rest } = website;
      const contentWithoutImages = rest.content.replace(/!\[.*?\]\(.*?\)/g, ''); // 移除 Markdown 图片语法
      const words = Object.entries(rest)
        .filter(([key, value]) => typeof value === 'string' && key !== 'content')
        .map(([_, value]) => value)
        .concat(contentWithoutImages)
        .join(' ')
        .split(/\s+/);
      return [...new Set(words)]; // 去重
    });
  }, [websites]);

  const contentWithPinyin = useMemo(() => {
    return allContent.map(word => ({
      word,
      pinyin: pinyin(word, { toneType: 'none' }),
      pinyinInitials: pinyin(word, { pattern: 'first', toneType: 'none' })
    }));
  }, [allContent]);

  useEffect(() => {
    setIsAllSelected(selectedTypes.length === 0);
  }, [selectedTypes]);

  useEffect(() => {
    if (search.length > 0) {
      const lowerSearch = search.toLowerCase();
      const matchedSuggestions = contentWithPinyin
        .filter(item => {
          const website = websites.find(w => 
            w.searchableContent.toLowerCase().includes(item.word.toLowerCase()) && 
            !w.logo.includes(item.word) // 确保不匹配 logo URL
          );
          if (!website) return false;
          const isDocument = website.type.includes('文档');
          return (showDocuments ? isDocument : !isDocument) &&
            (item.word.toLowerCase().includes(lowerSearch) ||
             item.pinyin.includes(lowerSearch) ||
             item.pinyinInitials.includes(lowerSearch));
        })
        .map(item => item.word)
        .slice(0, 5); // 限制建议数量为5个
      setSuggestions(matchedSuggestions);
    } else {
      setSuggestions([]);
      resetHighlight();
    }
  }, [search, contentWithPinyin, showDocuments, websites]);

  const filteredWebsites = websites.filter(website => 
    website.searchableContent.toLowerCase().includes(search.toLowerCase()) &&
    (isAllSelected || selectedTypes.some(type => website.type.includes(type))) &&
    (showDocuments ? website.type.includes('文档') : !website.type.includes('文档'))
  );

  const handleTypeChange = (type) => {
    if (type === '文档') {
      setShowDocuments(!showDocuments);
      setSelectedTypes([]);
      setIsAllSelected(false);
    } else {
      setSelectedTypes(prev => {
        if (prev.includes(type)) {
          return prev.filter(t => t !== type);
        } else {
          return [...prev, type];
        }
      });
    }
  };

  const handleAllSelect = () => {
    if (!isAllSelected) {
      setSelectedTypes([]);
      setShowDocuments(false);
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleCardClick = (website) => {
    setSelectedWebsite(website);
  };

  const handleCloseModal = () => {
    setSelectedWebsite(null);
    setModalHighlightedText('');
  };

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    setSuggestions([]);
    handleSuggestionSearch(suggestion);
    if (searchInputRef.current) {
      searchInputRef.current.value = suggestion;
    }
  };

  const handleSearchChange = (e) => {
    if (!isComposing) {
      const newSearch = e.target.value;
      setSearch(newSearch);
      if (newSearch === '') {
        resetHighlight();
      }
    }
  };

  const handleSuggestionSearch = (searchText) => {
    const matchedWebsites = websites.filter(w => w.searchableContent.toLowerCase().includes(searchText.toLowerCase()));
    if (matchedWebsites.length > 0) {
      const websitesWithContent = matchedWebsites.filter(w => w.content.toLowerCase().includes(searchText.toLowerCase()));
      if (websitesWithContent.length > 0) {
        setSelectedWebsite(websitesWithContent[0]);
        setModalHighlightedText(searchText);
        setHighlightedWebsites([]);
      } else {
        setSelectedWebsite(null);
        setHighlightedWebsites(matchedWebsites);
        setModalHighlightedText('');
        // 滚动到第一个高亮的卡片
        setTimeout(() => {
          const element = document.getElementById(`card-${matchedWebsites[0].filename}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    } else {
      resetHighlight();
    }
  };

  const resetHighlight = () => {
    setHighlightedText('');
    setHighlightedWebsites([]);
    setSelectedWebsite(null);
  };

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.addEventListener('compositionstart', handleCompositionStart);
      searchInputRef.current.addEventListener('compositionend', handleCompositionEnd);
    }
    return () => {
      if (searchInputRef.current) {
        searchInputRef.current.removeEventListener('compositionstart', handleCompositionStart);
        searchInputRef.current.removeEventListener('compositionend', handleCompositionEnd);
      }
    };
  }, []);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (event) => {
    setIsComposing(false);
    handleSearchChange(event);
  };

  const handleClearSearch = () => {
    setSearch('');
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    resetHighlight();
  };

  return (
    <>
      <div className="flex justify-end items-center mb-8"></div>
        <button
          className={`px-4 py-2 rounded-full text-lg font-semibold transition-colors duration-200 ${
            showDocuments
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => handleTypeChange('文档')}
        >
          文档
        </button>
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="搜索内容..."
          className="w-full p-3 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          onChange={handleSearchChange}
          ref={searchInputRef}
        />
        {search && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={handleClearSearch}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      {!showDocuments && (
        <div className="mb-8">
          <div className="flex flex-wrap justify-center items-center">
            <button
              className={`m-1 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                isAllSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={handleAllSelect}
            >
              全选
            </button>
            {allTypes.map(type => (
              <button
                key={type}
                className={`m-1 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedTypes.includes(type) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => handleTypeChange(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredWebsites.map(website => (
          <div
            key={website.url}
            id={`card-${website.filename}`}
            className={`${
              highlightedWebsites.includes(website)
                ? 'animate-pulse shadow-lg ring-2 ring-blue-500'
                : ''
            } ${website.type.includes('文档') ? 'col-span-2 row-span-2' : ''}`}
          >
            {website.type.includes('文档') ? (
              <DocumentCard 
                document={website} 
                onClick={() => handleCardClick(website)}
                highlightedText={highlightedText}
              />
            ) : (
              <Card 
                website={website} 
                onClick={() => handleCardClick(website)}
                highlightedText={highlightedText}
              />
            )}
          </div>
        ))}
      </div>
      {selectedWebsite && (
        <CardModal 
          website={selectedWebsite} 
          onClose={handleCloseModal} 
          highlightedText={modalHighlightedText}
        />
      )}
    </>
  );
}
