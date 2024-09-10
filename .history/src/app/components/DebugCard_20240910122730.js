'use client';

import { useState } from 'react';

const DebugCard = ({ website, error }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-red-100 rounded-lg shadow-md overflow-hidden border border-red-300 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <div className="p-4" onClick={toggleExpand}>
        <h2 className="font-bold text-lg text-red-800 mb-2 break-words">
          {website.filename || '未知文件'}
        </h2>
        {isExpanded && (
          <div className="mt-2">
            <p className="text-red-700 text-sm">错误信息：</p>
            <pre className="bg-red-50 p-2 rounded mt-1 text-xs text-red-600 whitespace-pre-wrap">
              {error || '未知错误'}
            </pre>
            {website.content === '' && (
              <p className="text-red-600 text-sm mt-2">文件内容为空</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugCard;
