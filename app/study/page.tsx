'use client'

import { useState } from 'react'

// 学习计划模板类型
interface StudyTemplate {
  id: string
  name: string
  description: string
  default_days: number
  default_hours: number
}

export default function StudyPage() {
  // 状态管理
  const [activeTab, setActiveTab] = useState<'plan' | 'outline'>('plan')
  const [subject, setSubject] = useState('')
  const [topics, setTopics] = useState('')
  const [days, setDays] = useState(7)
  const [dailyHours, setDailyHours] = useState(2)
  const [studyPlan, setStudyPlan] = useState<any>(null)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  
  // 复习提纲状态
  const [outlineSubject, setOutlineSubject] = useState('')
  const [outlineContent, setOutlineContent] = useState('')
  const [outline, setOutline] = useState<any>(null)
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false)
  
  // 学习技巧
  const [tips, setTips] = useState<string[]>([])
  const [isLoadingTips, setIsLoadingTips] = useState(false)
  
  // 学习计划模板
  const templates: StudyTemplate[] = [
    {
      id: 'daily',
      name: '每日学习计划',
      description: '适合日常学习使用',
      default_days: 7,
      default_hours: 2.0
    },
    {
      id: 'exam',
      name: '考试复习计划',
      description: '适合考前冲刺',
      default_days: 14,
      default_hours: 4.0
    },
    {
      id: 'weekly',
      name: '周末强化计划',
      description: '周末集中学习',
      default_days: 2,
      default_hours: 6.0
    }
  ]
  
  // 应用模板
  const applyTemplate = (template: StudyTemplate) => {
    setDays(template.default_days)
    setDailyHours(template.default_hours)
  }
  
  // 生成学习计划
  const handleGeneratePlan = async () => {
    if (!subject.trim() || !topics.trim()) {
      alert('请填写科目和学习主题')
      return
    }
    
    setIsGeneratingPlan(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subject.trim(),
          topics: topics.split('\n').filter(t => t.trim()),
          days: days,
          daily_hours: dailyHours
        }),
      })
      
      if (!response.ok) {
        throw new Error('生成失败')
      }
      
      const data = await response.json()
      setStudyPlan(data)
      
    } catch (error) {
      console.error('生成失败:', error)
      alert('生成学习计划失败，请重试')
    } finally {
      setIsGeneratingPlan(false)
    }
  }
  
  // 生成复习提纲
  const handleGenerateOutline = async () => {
    if (!outlineSubject.trim() || !outlineContent.trim()) {
      alert('请填写科目和学习内容')
      return
    }
    
    setIsGeneratingOutline(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study/generate-outline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: outlineSubject.trim(),
          content: outlineContent.trim(),
          format: 'outline'
        }),
      })
      
      if (!response.ok) {
        throw new Error('生成失败')
      }
      
      const data = await response.json()
      setOutline(data)
      
    } catch (error) {
      console.error('生成失败:', error)
      alert('生成复习提纲失败，请重试')
    } finally {
      setIsGeneratingOutline(false)
    }
  }
  
  // 加载学习技巧
  const loadTips = async () => {
    setIsLoadingTips(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/study/tips`)
      const data = await response.json()
      setTips(data.tips)
    } catch (error) {
      console.error('加载失败:', error)
    } finally {
      setIsLoadingTips(false)
    }
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* 标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          📅 学习规划中心
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          AI 帮你制定学习计划，生成复习提纲
        </p>
      </div>
      
      {/* 标签页切换 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('plan')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'plan'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          📋 学习计划
        </button>
        <button
          onClick={() => setActiveTab('outline')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'outline'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          🎯 复习提纲
        </button>
      </div>
      
      {/* 学习计划表单 */}
      {activeTab === 'plan' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：表单 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              创建学习计划
            </h2>
            
            {/* 快速模板 */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">快速模板：</p>
              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 表单字段 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  科目
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="例如：高等数学"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  学习主题（每行一个）
                </label>
                <textarea
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  placeholder="例如：
第一章 函数与极限
第二章 导数与微分
第三章 积分"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    计划天数
                  </label>
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    min={1}
                    max={30}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    每天学习时长（小时）
                  </label>
                  <input
                    type="number"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(Number(e.target.value))}
                    min={0.5}
                    max={12}
                    step={0.5}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <button
                onClick={handleGeneratePlan}
                disabled={isGeneratingPlan}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isGeneratingPlan ? '生成中...' : '🤖 AI 生成学习计划'}
              </button>
            </div>
          </div>
          
          {/* 右侧：结果展示 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              学习计划预览
            </h2>
            
            {studyPlan ? (
              <div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                  <p className="text-blue-600 dark:text-blue-400">
                    📊 总学习时长：{studyPlan.total_hours} 小时
                  </p>
                </div>
                
                <div className="space-y-3">
                  {studyPlan.plan.map((day: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          第 {day.day} 天
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {day.hours} 小时
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {day.content}
                      </p>
                    </div>
                  ))}
                </div>
                
                {studyPlan.tips && studyPlan.tips.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      💡 学习建议
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                      {studyPlan.tips.map((tip: string, index: number) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">📋</div>
                <p>填写左侧表单生成学习计划</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 复习提纲表单 */}
      {activeTab === 'outline' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：表单 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              生成复习提纲
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  科目
                </label>
                <input
                  type="text"
                  value={outlineSubject}
                  onChange={(e) => setOutlineSubject(e.target.value)}
                  placeholder="例如：计算机网络"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  学习内容（可以粘贴笔记或关键知识点）
                </label>
                <textarea
                  value={outlineContent}
                  onChange={(e) => setOutlineContent(e.target.value)}
                  placeholder="粘贴你的学习笔记或关键知识点..."
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              
              <button
                onClick={handleGenerateOutline}
                disabled={isGeneratingOutline}
                className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isGeneratingOutline ? '生成中...' : '🤖 AI 生成复习提纲'}
              </button>
            </div>
          </div>
          
          {/* 右侧：结果展示 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              复习提纲预览
            </h2>
            
            {outline ? (
              <div>
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                    {outline.outline}
                  </pre>
                </div>
                
                {outline.key_points && outline.key_points.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      🔑 重点知识
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {outline.key_points.map((point: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm"
                        >
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">🎯</div>
                <p>填写左侧表单生成复习提纲</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 学习技巧 */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            💡 学习技巧
          </h2>
          <button
            onClick={loadTips}
            disabled={isLoadingTips}
            className="px-4 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          >
            {isLoadingTips ? '加载中...' : '🔄 刷新'}
          </button>
        </div>
        
        {tips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4"
              >
                <p className="text-gray-700 dark:text-gray-300">{tip}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            点击刷新按钮加载学习技巧
          </p>
        )}
      </div>
    </div>
  )
}
