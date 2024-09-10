'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useMemo, memo } from 'react';

const Card = memo(function Card({ website, onClick, highlightedText }) {
  const [imageStatus, setImageStatus] = useState('loading'); // 'loading', 'loaded', 'error'
  const imgRef = useRef(null);
  const timerRef = useRef(null);
  const attemptedLoadRef = useRef(false);

  // 使用 useMemo 来记忆 logo URL
  const logoUrl = useMemo(() => website.logo, [website.logo]);

  const handleImageLoad = () => {
    clearTimeout(timerRef.current);
    setImageStatus('loaded');
  };

  const handleImageError = () => {
    clearTimeout(timerRef.current);
    console.error('加载图片失败:', logoUrl);
    setImageStatus('error');
  };

  useEffect(() => {
    if (logoUrl && !attemptedLoadRef.current) {
      attemptedLoadRef.current = true;
      
      if (imgRef.current) {
        if (imgRef.current.complete) {
          handleImageLoad();
        } else {
          imgRef.current.onload = handleImageLoad;
          imgRef.current.onerror = handleImageError;

          // 设置 10 秒超时
          timerRef.current = setTimeout(() => {
            handleImageError();
          }, 1000);
        }
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [logoUrl]);

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
      className="bg-white bg-opacity-80 rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 relative cursor-pointer flex flex-col h-full"
      style={{ maxWidth: '400px', maxHeight: '600px', minWidth: '200px', minHeight: '300px' }}
      onClick={onClick}
    >
      <div className="relative h-24 sm:h-32 flex items-center justify-center bg-gradient-to-r from-blue-100 to-green-100">
        {/* Logo 部分 */}
        {logoUrl && imageStatus !== 'error' ? (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white flex items-center justify-center">
            <Image
              src={logoUrl}
              alt={`${website.title || website.filename} logo`}
              width={80}
              height={80}
              className={`object-contain ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              ref={imgRef}
            />
          </div>
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-2xl sm:text-3xl">
            {website.filename.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-grow p-4 flex flex-col justify-between overflow-hidden">
        <div>
          <h2 className="font-bold text-lg text-gray-800 mb-2 break-words line-clamp-2">
            {highlightText(website.title || website.filename)}
          </h2>
          <a 
            href={website.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block text-blue-600 hover:underline mb-2 break-words text-sm line-clamp-1"
            onClick={(e) => e.stopPropagation()}
          >
            {highlightText(website.url)}
          </a>
          <p className="text-gray-700 mb-4 line-clamp-3 break-words text-sm">
            {highlightText(website.description)}
          </p>
        </div>
        <div className="mt-auto">
          <div className="mb-2">
            <h3 className="font-semibold text-gray-700 text-sm">类型：</h3>
            <div className="flex flex-wrap">
              {website.type.map((type, index) => (
                <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                  {highlightText(type)}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 text-sm">标签：</h3>
            <div className="flex flex-wrap">
              {website.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-1">
                  {highlightText(tag)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数，只有在必要的属性发生变化时才重新渲染
  return (
    prevProps.website.logo === nextProps.website.logo &&
    prevProps.website.title === nextProps.website.title &&
    prevProps.website.filename === nextProps.website.filename &&
    prevProps.website.url === nextProps.website.url &&
    prevProps.website.description === nextProps.website.description &&
    prevProps.website.type.join(',') === nextProps.website.type.join(',') &&
    prevProps.website.tags.join(',') === nextProps.website.tags.join(',') &&
    prevProps.highlightedText === nextProps.highlightedText
  );
});

export default Card;