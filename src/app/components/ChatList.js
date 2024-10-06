import React from 'react';

const ChatList = ({ chats, activeChat, onSelectChat, onNewChat, onDeleteChat }) => {
  return (
    <div className="w-72 bg-gray-800 text-white p-4 h-screen flex flex-col">
      <button
        onClick={onNewChat}
        className="w-full bg-blue-500 text-white p-2 rounded-lg mb-4 hover:bg-blue-600 transition duration-200 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        新对话
      </button>
      <div className="flex-grow overflow-y-auto space-y-2">
        {chats.map((chat, index) => (
          <div
            key={chat.id}
            className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition duration-200 ${
              activeChat === chat.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <span>对话 {index + 1}</span>
            </div>
            <div className="flex items-center space-x-2">
              {chat.messages.length === 0 && (
                <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full">空</span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="text-gray-400 hover:text-red-500 transition duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;