'use client'

import { useState, useRef } from 'react'

// 文件类型定义
interface UploadedFile {
  id: string
  filename: string
  file_type: string
  size: number
  upload_time: string
}

export default function FilesPage() {
  // 状态管理
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  
  // 文件输入引用
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 上传文件
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/upload`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('上传失败')
      }
      
      const data = await response.json()
      
      setFiles(prev => [...prev, {
        id: data.id,
        filename: data.filename,
        file_type: data.file_type,
        size: data.size,
        upload_time: new Date().toISOString()
      }])
      
      alert('文件上传成功！')
      
    } catch (error) {
      console.error('上传失败:', error)
      alert('文件上传失败，请重试')
    } finally {
      setIsUploading(false)
      // 清空文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }
  
  // 删除文件
  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('确定要删除这个文件吗？')) return
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/${fileId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('删除失败')
      }
      
      setFiles(prev => prev.filter(f => f.id !== fileId))
      
      if (selectedFile?.id === fileId) {
        setSelectedFile(null)
        setFileContent('')
      }
      
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请重试')
    }
  }
  
  // 查看文件内容
  const handleViewContent = async (file: UploadedFile) => {
    setSelectedFile(file)
    setIsLoadingContent(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/${file.id}/content`)
      
      if (!response.ok) {
        throw new Error('获取内容失败')
      }
      
      const data = await response.json()
      setFileContent(data.content)
      
    } catch (error) {
      console.error('获取内容失败:', error)
      setFileContent('加载失败，请重试')
    } finally {
      setIsLoadingContent(false)
    }
  }
  
  // AI 总结文件
  const handleSummarize = async () => {
    if (!selectedFile) return
    
    setIsSummarizing(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: selectedFile.id,
          summary_type: 'general'
        }),
      })
      
      if (!response.ok) {
        throw new Error('总结失败')
      }
      
      const data = await response.json()
      alert('总结完成！\n\n' + data.summary)
      
    } catch (error) {
      console.error('总结失败:', error)
      alert('总结失败，请重试')
    } finally {
      setIsSummarizing(false)
    }
  }
  
  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* 标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          📁 文件学习中心
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          上传学习资料，让 AI 帮你分析和总结
        </p>
      </div>
      
      {/* 上传区域 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8">
        <div className="flex flex-col items-center justify-center">
          <div className="text-6xl mb-4">📤</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            上传学习文件
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            支持 PDF、PPT、TXT 格式
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.ppt,.pptx,.txt"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? '上传中...' : '选择文件'}
          </button>
        </div>
      </div>
      
      {/* 文件列表 */}
      {files.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            📚 我的文件 ({files.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 cursor-pointer transition-all ${
                  selectedFile?.id === file.id ? 'ring-2 ring-blue-500' : ''
                } hover:shadow-lg`}
                onClick={() => handleViewContent(file)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">
                      {file.file_type === 'pdf' ? '📄' : 
                       file.file_type === 'ppt' || file.file_type === 'pptx' ? '📊' : '📝'}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                        {file.filename}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteFile(file.id)
                    }}
                    className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-1 rounded"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 文件内容预览 */}
      {selectedFile && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              📖 {selectedFile.filename}
            </h2>
            
            <button
              onClick={handleSummarize}
              disabled={isSummarizing}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSummarizing ? '总结中...' : '🤖 AI 总结'}
            </button>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-[400px] overflow-y-auto">
            {isLoadingContent ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-300">加载中...</span>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-mono text-sm">
                {fileContent}
              </pre>
            )}
          </div>
        </div>
      )}
      
      {/* 空状态 */}
      {files.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <div className="text-6xl mb-4">📭</div>
          <p>还没有上传任何文件</p>
          <p className="text-sm mt-2">上传 PDF、PPT 或 TXT 文件开始学习</p>
        </div>
      )}
    </div>
  )
}
