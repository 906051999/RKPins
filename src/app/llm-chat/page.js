'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { sendMessageToLLM } from '../api/llm';
import ChatList from '../components/ChatList';

export default function LLMChat() {
  const [chats, setChats] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedChats = localStorage.getItem('llmChats');
      return savedChats ? JSON.parse(savedChats) : [{ id: 1, messages: [] }];
    }
    return [{ id: 1, messages: [] }];
  });

  const [activeChat, setActiveChat] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedActiveChat = localStorage.getItem('activeChat');
      return savedActiveChat ? parseInt(savedActiveChat) : 1;
    }
    return 1;
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('llmChats', JSON.stringify(chats));
    }
  }, [chats]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeChat', activeChat.toString());
    }
  }, [activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chats]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || activeChat === null) return;

    setIsLoading(true);
    const newMessage = { role: 'user', content: input };

    setChats(prevChats => prevChats.map(chat => 
      chat.id === activeChat 
        ? { ...chat, messages: [...chat.messages, newMessage] }
        : chat
    ));

    try {
      const response = await sendMessageToLLM(input);
      const assistantMessage = { role: 'assistant', content: response };
      setChats(prevChats => prevChats.map(chat => 
        chat.id === activeChat 
          ? { ...chat, messages: [...chat.messages, assistantMessage] }
          : chat
      ));
    } catch (error) {
      console.error("Error in LLM chat:", error);
      const errorMessage = { role: 'assistant', content: "抱歉,发生了错误。请稍后再试。" };
      setChats(prevChats => prevChats.map(chat => 
        chat.id === activeChat 
          ? { ...chat, messages: [...chat.messages, errorMessage] }
          : chat
      ));
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleNewChat = () => {
    const emptyChat = chats.find(chat => chat.messages.length === 0);
    if (emptyChat) {
      setActiveChat(emptyChat.id);
    } else {
      const newChatId = Math.max(...chats.map(chat => chat.id)) + 1;
      const newChat = { id: newChatId, messages: [] };
      setChats([...chats, newChat]);
      setActiveChat(newChatId);
    }
  };

  const handleSelectChat = (chatId) => {
    setActiveChat(chatId);
  };

  const handleDeleteChat = (chatId) => {
    if (chats.length === 1) {
      // 如果只剩一个对话，清空其内容
      setChats([{ id: chatId, messages: [] }]);
    } else {
      // 删除选中的对话
      setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
      if (activeChat === chatId) {
        // 如果删除的是当前活动对话，切换到其他对话
        const remainingChats = chats.filter(chat => chat.id !== chatId);
        setActiveChat(remainingChats[0].id);
      }
    }
  };

  const activeMessages = chats.find(chat => chat.id === activeChat)?.messages || [];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex">
      <ChatList
        chats={chats}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      <div className="flex-1 flex flex-col">
        <div className="bg-blue-600 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">LLM 聊天</h1>
          <Link href="/" className="text-white hover:text-blue-200 transition duration-300">
            返回主页
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 bg-gray-100">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500 bg-white"
              placeholder="输入您的问题..."
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className={`p-3 rounded-full ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
              } text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
