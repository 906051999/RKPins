'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DocumentCard = ({ document, onClick, highlightedText }) => {
  const [excerpt, setExcerpt] = useState('');
  const [isMini, setIsMini] = useState(false);

  useEffect(() => {
    // 提取文档内容的前 100 个字符作为摘要
    const contentExcerpt = document.content.slice(0, 100).trim() + '...';
    setExcerpt(contentExcerpt);
    
    // 检查是否为迷你卡片
    setIsMini(!document.content && (!document.tags || document.tags.length === 0));
  }, [document.content, document.tags]);

  const highlightText = (text) => {
    if (!highlightedText || typeof text !== 'string') return text;
    const parts = text.split(new RegExp(`(${highlightedText})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlightedText.toLowerCase() ? 
        <span key={index} className="bg-yellow-200">{part}</span> : part
    );
  };

  if (isMini) {
    return (
      <div 
        className="bg-white bg-opacity-80 rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col min-h-[100px] max-h-[120px] min-w-[200px] max-w-[240px]"
        onClick={onClick}
      >
        <div className="p-3 flex items-center justify-center h-full">
          <h2 className="font-bold text-base text-gray-800 text-center break-words">
            {highlightText(document.filename)}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white bg-opacity-80 rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col min-h-[320px] max-h-[480px] min-w-[240px] max-w-[320px]"
      onClick={onClick}
    >
      <div className="p-4 sm:p-6 flex flex-col flex-grow overflow-hidden">
        <h2 className="font-bold text-lg sm:text-xl text-gray-800 mb-2 sm:mb-4 break-words">
          {highlightText(document.filename)}
        </h2>
        <div className="text-sm sm:text-base text-gray-600 prose prose-sm sm:prose-base max-w-none overflow-y-auto flex-grow custom-scrollbar">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {excerpt}
          </ReactMarkdown>
        </div>
      </div>
      {document.tags && document.tags.length > 0 && (
        <div className="p-4 sm:p-6 bg-gray-50 overflow-y-auto max-h-[120px] custom-scrollbar">
          <h3 className="font-semibold text-sm sm:text-base text-gray-700 mb-2">标签：</h3>
          <div className="flex flex-wrap">
            {document.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs sm:text-sm px-2 py-1 rounded-full mr-2 mb-2">
                {highlightText(tag)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
