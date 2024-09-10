'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useMemo } from 'react';

export default function Card({ website, onClick, highlightedText }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef(null);
  const timerRef = useRef(null);

  // 使用 useMemo 来记忆 logo URL
  const logoUrl = useMemo(() => website.logo, []);

  const handleImageLoad = () => {
    clearTimeout(timerRef.current);
    setImageLoaded(true);
  };

  const handleImageError = () => {
    clearTimeout(timerRef.current);
    console.error('加载图片失败:', logoUrl);
    setImageError(true);
  };

  useEffect(() => {
    if (imgRef.current) {
      if (imgRef.current.complete) {
        handleImageLoad();
      } else {
        imgRef.current.onload = handleImageLoad;
        imgRef.current.onerror = handleImageError;

        // 设置 10 秒超时
        timerRef.current = setTimeout(() => {
          handleImageError();
        }, 10000);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

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
      className="bg-white bg-opacity-80 rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 relative cursor-pointer" 
      style={{aspectRatio: '1 / 1.5'}}
      onClick={onClick}
    >
      {/* 卡片内容 */}
      <div className="absolute inset-0 flex flex-col">
        <div className="relative h-1/5 flex items-center justify-center bg-gradient-to-r from-blue-100 to-green-100">
          {/* Logo 部分 */}
          {logoUrl && !imageError ? (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white flex items-center justify-center">
              <Image
                src={logoUrl}
                alt={`${website.title || website.filename} logo`}
                width={40}
                height={40}
                className={`object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                ref={imgRef}
              />
            </div>
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-xs sm:text-sm">
              {website.filename.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-grow p-2 flex flex-col justify-between text-xs sm:text-sm">
          <div>
            <h2 className="font-bold text-gray-800 mb-1 break-words">
              {highlightText(website.title || website.filename)}
            </h2>
            <a 
              href={website.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block text-blue-600 hover:underline mb-1 break-words"
              onClick={(e) => e.stopPropagation()}
            >
              {highlightText(website.url)}
            </a>
            <p className="text-gray-700 mb-1 line-clamp-2 break-words">
              {highlightText(website.description)}
            </p>
          </div>
          <div className="mt-1 space-y-1">
            <div>
              <h3 className="font-semibold text-gray-700">类型：</h3>
              <div className="flex flex-wrap">
                {website.type.map((type, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-1 py-0.5 rounded-full m-0.5 text-xs">
                    {highlightText(type)}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">标签：</h3>
              <div className="flex flex-wrap">
                {website.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded-full m-0.5 text-xs">
                    {highlightText(tag)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}