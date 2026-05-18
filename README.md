# 🎓 大学生 AI 学习助手

一个简单易用的 AI 学习工具，帮助大学生进行日常学习、复习、课程整理和自律规划。

## 📚 功能特性

- ✅ AI 聊天学习助手
- ✅ 上传 PDF/PPT/TXT 文件
- ✅ AI 自动总结内容
- ✅ 生成复习提纲
- ✅ 生成每日学习计划
- ✅ 保存聊天记录
- ✅ 深色模式
- ✅ 响应式设计（适配手机）

## 🛠️ 技术栈

- **前端**: Next.js + TailwindCSS
- **后端**: Python FastAPI
- **数据库**: SQLite
- **AI**: DeepSeek API（国内可用，性价比高）

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Python 3.10+
- DeepSeek API Key（免费获取：https://platform.deepseek.com/）

### 方法一：一键启动（Windows）

1. 双击运行 `start.bat`
2. 选择 `1` - 安装依赖并启动（首次使用）
3. 选择 `2` - 直接启动（后续使用）

### 方法二：手动启动

#### 1. 配置 API Key

创建 `backend/.env` 文件：
```env
DEEPSEEK_API_KEY=你的DeepSeek API Key
DATABASE_URL=sqlite:///./data/study_assistant.db
```

#### 2. 安装依赖

```bash
# 前端依赖
cd frontend
npm install

# 后端依赖
cd ../backend
pip install -r requirements.txt
```

#### 3. 启动服务

```bash
# 终端1：启动后端
cd backend
python -m uvicorn app.main:app --reload --port 8000

# 终端2：启动前端
cd frontend
npm run dev
```

#### 4. 打开浏览器

访问 http://localhost:3000

---

## 🎮 启动脚本说明

`start.bat` 提供两个选项：

| 选项 | 说明 |
|------|------|
| 1 | 安装全部依赖并启动（首次使用） |
| 2 | 直接启动（依赖已安装时使用） |

---

## 📁 项目结构

```
ai-study-assistant/
├── frontend/           # Next.js 前端
│   ├── src/
│   │   ├── app/       # 页面组件
│   │   ├── components/ # UI 组件
│   │   ├── lib/       # 工具函数
│   │   └── styles/    # 样式文件
│   └── public/        # 静态资源
├── backend/           # Python FastAPI 后端
│   ├── app/
│   │   ├── api/       # API 路由
│   │   ├── models/    # 数据模型
│   │   └── services/  # 业务逻辑
│   ├── uploads/       # 上传文件目录
│   └── main.py        # 后端入口
├── docs/              # 开发文档
├── start.bat          # Windows 启动脚本
└── start.sh           # Mac/Linux 启动脚本
```

---

## 🌐 访问地址

| 服务 | 地址 |
|------|------|
| 前端应用 | http://localhost:3000 |
| 后端 API | http://localhost:8000 |
| API 文档 | http://localhost:8000/docs |

---

## 👨‍💻 开发指南

### 添加新功能

1. 在 `backend/app/api/` 创建新的 API 路由
2. 在 `frontend/src/components/` 创建对应的前端组件
3. 更新相关的数据模型

### 代码规范

- 使用中文注释
- 变量和函数使用英文命名
- 保持代码简洁

---

## 🐛 常见问题

**Q: npm install 很慢或卡住？**
```bash
npm install --registry=https://registry.npmmirror.com
```

**Q: 启动失败？**
- 检查 Node.js 和 Python 版本
- 确保依赖安装完整
- 检查端口是否被占用

**Q: AI 不回答？**
- 检查 `backend/.env` 中的 `DEEPSEEK_API_KEY` 是否正确
- 检查网络连接（需访问 api.deepseek.com）

**Q: 端口被占用？**
```bash
# 后端改用其他端口
python -m uvicorn app.main:app --reload --port 8001
```

---

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
