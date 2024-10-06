import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Card({ title, link, parser }) {
  const [copied, setCopied] = useState(false);

  const copyTitle = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(title).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md hover:shadow-lg p-6 h-full flex flex-col"
      whileHover={{ scale: 1.02 }}
    >
      <h2 className="text-lg font-semibold text-gray-800 leading-tight mb-4">
        {title}
      </h2>
      <div className="flex justify-between items-center mt-auto">
        <motion.div 
          className="text-sm text-gray-600 cursor-pointer hover:text-blue-600 flex items-center"
          onClick={copyTitle}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {copied ? '已复制！' : '复制标题'}
        </motion.div>
        <motion.a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors duration-200 flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {parser}
        </motion.a>
      </div>
    </motion.div>
  );
}