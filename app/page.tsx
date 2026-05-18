/**
 * page.tsx - 首页
 * 
 * 这是应用的入口页面
 * 展示功能介绍和快速入口
 */

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* 欢迎区域 */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          欢迎使用 <span className="text-blue-500">AI 学习助手</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          一个专为大学生设计的智能学习工具，帮助你更高效地学习、复习和规划
        </p>
        
        {/* 快速开始按钮 */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/chat"
            className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
          >
            🚀 开始 AI 对话
          </a>
          <a
            href="/files"
            className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            📄 上传学习资料
          </a>
        </div>
      </section>

      {/* 功能卡片区域 */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
          ✨ 核心功能
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* AI 对话功能 */}
          <FeatureCard
            icon="💬"
            title="AI 对话助手"
            description="随时提问，获得详细的解答和学习建议。支持多轮对话，理解上下文。"
          />
          
          {/* 文件上传功能 */}
          <FeatureCard
            icon="📁"
            title="智能文件处理"
            description="上传 PDF、PPT、TXT 文件，AI 自动提取关键内容，省时省力。"
          />
          
          {/* 自动总结功能 */}
          <FeatureCard
            icon="📝"
            title="AI 内容总结"
            description="自动总结长文档，生成摘要和要点，轻松掌握核心知识点。"
          />
          
          {/* 复习提纲功能 */}
          <FeatureCard
            icon="🎯"
            title="复习提纲生成"
            description="根据学习内容自动生成复习提纲，帮你梳理知识框架，备战考试。"
          />
          
          {/* 学习计划功能 */}
          <FeatureCard
            icon="📅"
            title="学习计划制定"
            description="AI 智能生成每日学习计划，合理安排时间，培养良好学习习惯。"
          />
          
          {/* 聊天记录保存 */}
          <FeatureCard
            icon="💾"
            title="历史记录保存"
            description="所有对话和学习资料自动保存，随时回顾，方便复习。"
          />
        </div>
      </section>

      {/* 使用流程区域 */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800 rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
          📖 快速开始
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <StepCard
            step="1"
            title="登录或注册"
            description="创建你的个人账号，开始智能学习之旅"
          />
          <StepCard
            step="2"
            title="上传学习资料"
            description="上传课程 PDF、课件 PPT 或笔记 TXT"
          />
          <StepCard
            step="3"
            title="开始智能学习"
            description="让 AI 帮你总结、复习、制定计划"
          />
        </div>
      </section>

      {/* 底部提示区域 */}
      <section className="py-12 text-center">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            💡 小贴士
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            建议每天固定时间使用 AI 学习助手，形成良好的学习习惯。
            结合番茄工作法效果更佳：学习 25 分钟，休息 5 分钟，保持专注！
          </p>
        </div>
      </section>
    </div>
  )
}

// 功能卡片组件
function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: string
  title: string
  description: string 
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  )
}

// 步骤卡片组件
function StepCard({ 
  step, 
  title, 
  description 
}: { 
  step: string
  title: string
  description: string 
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {step}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  )
}
