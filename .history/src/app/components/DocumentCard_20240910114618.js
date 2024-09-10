'use client';

import { useState, useEffect, useMemo } from 'react';

const DocumentCard = ({ document, onClick, highlightedText }) => {
  const [excerpt, setExcerpt] = useState('');

  useEffect(() => {
    // 提取文档内容的前 100 个字符作为摘要
    const contentExcerpt = document.content.slice(0, 200).trim() + '...';
    setExcerpt(contentExcerpt);
  }, [document.content]);

  const highlightText = (text) => {
    if (!highlightedText || typeof text !== 'string') return text;
    const parts = text.split(new RegExp(`(${highlightedText})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlightedText.toLowerCase() ? 
        <span key={index} className="bg-yellow-200">{part}</span> : part
    );
  };

  return (
    <div 
      className="bg-white bg-opacity-80 rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4">
        <h2 className="font-bold text-lg text-gray-800 mb-2 break-words">
          {highlightText(document.filename)}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-3 break-words">
          {highlightText(excerpt)}
        </p>
      </div>
      <div className="px-4 py-2 bg-gray-50">
        <h3 className="font-semibold text-gray-700 mb-1">标签：</h3>
        <div className="flex flex-wrap">
          {document.tags.map((tag, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
              {highlightText(tag)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
