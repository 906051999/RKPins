import { useState } from 'react';

export default function Card({ title, link, parser }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-card-bg rounded-lg transition-all duration-300 w-full h-40 sm:h-48 flex flex-col justify-between p-3 sm:p-4 cursor-pointer
        ${isPressed 
          ? 'scale-95 shadow-sm' 
          : 'shadow-md hover:shadow-lg hover:border-primary-light hover:scale-102'}`}
      style={{
        boxShadow: isPressed ? 'var(--elevation-1)' : 'var(--elevation-2)',
      }}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <h2 className="text-sm sm:text-base font-semibold text-foreground line-clamp-3 leading-tight">
        {title}
      </h2>
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs sm:text-sm text-gray-600 truncate">
          {new URL(link).hostname}
        </div>
        <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
          {parser}
        </div>
      </div>
    </a>
  );
}