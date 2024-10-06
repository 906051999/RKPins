import { useState } from 'react';

export default function Card({ title, link, parser }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-white rounded-lg transition-all duration-300 flex flex-col p-6 cursor-pointer h-full
        ${isPressed 
          ? 'scale-98 shadow-sm' 
          : 'shadow-md hover:shadow-lg hover:scale-102'}`}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <h2 className="text-lg font-semibold text-gray-800 leading-tight mb-4">
        {title}
      </h2>
      <div className="flex justify-between items-center mt-auto">
        <div className="text-sm text-gray-600 truncate">
          {new URL(link).hostname}
        </div>
        <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
          {parser}
        </div>
      </div>
    </a>
  );
}