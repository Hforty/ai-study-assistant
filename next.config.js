/** @type {import('next').NextConfig} */
const nextConfig = {
  // 输出目录
  output: 'export',
  
  // 图片优化配置
  images: {
    unoptimized: true,
  },
  
  // 环境变量
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
}

module.exports = nextConfig
