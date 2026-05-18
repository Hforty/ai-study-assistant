/** @type {import('tailwindcss').Config} */
module.exports = {
  // 启用深色模式支持
  darkMode: 'class',
  
  // 内容配置：告诉 Tailwind 在哪些文件中查找类名
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // 主题配置：自定义颜色、字体等
  theme: {
    extend: {
      // 颜色配置
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
      
      // 字体配置
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      
      // 动画配置
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  
  // 插件配置
  plugins: [],
}
