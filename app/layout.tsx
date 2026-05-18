/**
 * layout.tsx - 应用布局组件
 * 
 * 这个文件定义了应用的全局布局结构
 * 包括：HTML 结构、头部、底部导航栏
 */

import './globals.css'
import type { Metadata } from 'next'

// 定义应用元数据
export const metadata: Metadata = {
  title: '大学生 AI 学习助手',
  description: '一个帮助你学习、复习、规划的大学生 AI 学习工具',
}

// 根布局组件
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // 设置 HTML 语言为中文
    <html lang="zh-CN">
      {/* Body 添加深色模式支持 */}
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo 和标题 */}
              <div className="flex items-center gap-3">
                <div className="text-3xl">🎓</div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    AI 学习助手
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    你的智能学习伙伴
                  </p>
                </div>
              </div>
              
              {/* 导航链接 */}
              <nav className="hidden md:flex items-center gap-6">
                <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors">
                  首页
                </a>
                <a href="/chat" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors">
                  AI 对话
                </a>
                <a href="/files" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors">
                  文件学习
                </a>
                <a href="/study" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors">
                  学习计划
                </a>
              </nav>
              
              {/* 深色模式切换按钮 */}
              <button
                id="theme-toggle"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="切换深色模式"
              >
                <span className="text-xl">🌙</span>
              </button>
            </div>
          </div>
        </header>
        
        {/* 主内容区域 */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        
        {/* 底部版权信息 */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
            <p>© 2024 大学生 AI 学习助手. 使用 Next.js + FastAPI 构建</p>
            <p className="mt-2 text-sm">
              旨在帮助大学生更高效地学习 📚
            </p>
          </div>
        </footer>
        
        {/* 深色模式切换脚本 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 深色模式切换逻辑
              // 检测用户偏好并应用
              if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
              
              // 切换按钮点击事件
              document.getElementById('theme-toggle')?.addEventListener('click', function() {
                document.documentElement.classList.toggle('dark');
                localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                this.querySelector('span').textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
