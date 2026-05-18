'use client'

import { useState, useRef, useEffect } from 'react'

// 消息类型定义
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  // 状态管理
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // 消息列表引用，用于自动滚动
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // 发送消息
  const handleSend = async () => {
    // 忽略空消息
    if (!input.trim() || isLoading) return
    
    // 创建用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }
    
    // 添加用户消息到列表
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      // 调用后端 API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      })
      
      if (!response.ok) {
        throw new Error('API 请求失败')
      }
      
      const data = await response.json()
      
      // 添加 AI 回复
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      
    } catch (error) {
      // 错误处理
      console.error('发送消息失败:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，发生了错误。请稍后重试。\n\n如果问题持续存在，请检查：\n1. 网络连接是否正常\n2. 后端服务是否运行\n3. OpenAI API Key 是否配置正确',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }
  
  // 处理键盘事件（Enter 发送，Shift+Enter 换行）
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  
  // 清除聊天记录
  const handleClear = () => {
    setMessages([])
  }
  
  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            💬 AI 对话助手
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            随时提问，获得详细解答
          </p>
        </div>
        
        {/* 清除按钮 */}
        <button
          onClick={handleClear}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          🗑️ 清空对话
        </button>
      </div>
      
      {/* 欢迎消息 */}
      {messages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            欢迎使用 AI 对话助手
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            我可以帮助你解答学习问题、解释复杂概念、提供学习建议。输入你的问题开始吧！
          </p>
          
          {/* 快捷问题 */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              '解释一下什么是机器学习',
              '帮我制定一个数学复习计划',
              '如何高效记忆英语单词',
            ].map((question) => (
              <button
                key={question}
                onClick={() => setInput(question)}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* 消息列表区域 */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-xl ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                {/* 消息角色图标 */}
                <div className="text-sm mb-1 opacity-70">
                  {message.role === 'user' ? '👤 你' : '🤖 AI 助手'}
                </div>
                
                {/* 消息内容 */}
                <div className="whitespace-pre-wrap">
                  {message.content}
                </div>
                
                {/* 时间戳 */}
                <div className="text-xs mt-2 opacity-50">
                  {message.timestamp.toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {/* 加载动画 */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '400ms'}}></span>
                </div>
              </div>
            </div>
          )}
          
          {/* 滚动锚点 */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* 输入区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <div className="flex gap-3">
          {/* 文本输入框 */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题... (Enter 发送, Shift+Enter 换行)"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            disabled={isLoading}
          />
          
          {/* 发送按钮 */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '发送中...' : '发送'}
          </button>
        </div>
        
        {/* 提示信息 */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          💡 按 Enter 发送消息，Shift + Enter 换行
        </p>
      </div>
    </div>
  )
}
