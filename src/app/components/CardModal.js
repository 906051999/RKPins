import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CardModal({ website, onClose, highlightedText }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (highlightedText && contentRef.current) {
      const regex = new RegExp(highlightedText, 'gi');
      const content = contentRef.current.innerHTML;
      const highlightedContent = content.replace(regex, match => `<span class="bg-yellow-200">${match}</span>`);
      contentRef.current.innerHTML = highlightedContent;

      // 滚动到第一个高亮的文本
      const firstHighlight = contentRef.current.querySelector('.bg-yellow-200');
      if (firstHighlight) {
        firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedText]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 flex-shrink-0 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{website.title}</h2>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="prose max-w-none text-gray-800" ref={contentRef}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {website.content}
            </ReactMarkdown>
          </div>
        </div>
        <div className="p-6 flex-shrink-0 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
