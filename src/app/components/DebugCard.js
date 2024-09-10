'use client';

const DebugCard = ({ website, error }) => {
  return (
    <div className="bg-red-100 rounded-lg shadow-md overflow-hidden border border-red-300 hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <h2 className="font-bold text-lg text-red-800 mb-2 break-words">
          {website.filename || '未知文件'}
        </h2>
        <div className="mt-2">
          <p className="text-red-700 text-sm">错误信息：</p>
          <pre className="bg-red-50 p-2 rounded mt-1 text-xs text-red-600 whitespace-pre-wrap">
            {error || '未知错误'}
          </pre>
          {website.content === '' && (
            <p className="text-red-600 text-sm mt-2">文件内容为空</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugCard;
