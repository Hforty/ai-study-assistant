# 开发文档

## 📋 项目概述

这是一个面向大学生的 AI 学习助手项目，旨在帮助学生更高效地进行日常学习、复习、课程整理和自律规划。

## 🏗️ 项目架构

### 前端（Next.js + TailwindCSS）

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx      # 全局布局
│   │   ├── page.tsx        # 首页
│   │   ├── globals.css     # 全局样式
│   │   ├── chat/           # AI 对话页面
│   │   ├── files/          # 文件管理页面
│   │   └── study/          # 学习计划页面
│   ├── components/         # 组件目录（后续扩展）
│   └── lib/               # 工具函数（后续扩展）
└── public/                # 静态资源
```

### 后端（FastAPI + SQLite）

```
backend/
├── app/
│   ├── main.py            # 应用入口
│   ├── api/               # API 路由
│   │   ├── chat.py        # AI 对话接口
│   │   ├── files.py       # 文件处理接口
│   │   └── study.py       # 学习计划接口
│   ├── models/            # 数据模型（后续扩展）
│   └── services/          # 业务逻辑（后续扩展）
├── uploads/              # 上传文件存储
└── requirements.txt      # Python 依赖
```

## 🔌 API 接口文档

### 基础信息

- 基础 URL：`http://localhost:8000`
- API 文档：`http://localhost:8000/docs`（Swagger UI）
- 数据格式：JSON

### 1. AI 对话接口

#### POST /api/chat/send
发送消息给 AI 并获取回复

**请求体：**
```json
{
  "message": "用户消息",
  "history": [
    {"role": "user", "content": "上一条用户消息"},
    {"role": "assistant", "content": "上一条AI回复"}
  ]
}
```

**响应：**
```json
{
  "response": "AI 回复内容",
  "conversation_id": "conv_12345678"
}
```

#### GET /api/chat/history
获取聊天历史记录

### 2. 文件处理接口

#### POST /api/files/upload
上传文件

**请求：** multipart/form-data
- file: 文件（PDF、PPT、TXT）

**响应：**
```json
{
  "id": "文件ID",
  "filename": "文件名",
  "file_type": "pdf",
  "size": 1024000
}
```

#### GET /api/files/{file_id}/content
获取文件内容

**响应：**
```json
{
  "content": "文件文本内容",
  "file_id": "文件ID",
  "file_type": "pdf"
}
```

#### POST /api/files/summarize
AI 总结文件内容

**请求体：**
```json
{
  "file_id": "文件ID",
  "summary_type": "general"
}
```

### 3. 学习计划接口

#### POST /api/study/generate-plan
生成学习计划

**请求体：**
```json
{
  "subject": "科目名称",
  "topics": ["主题1", "主题2"],
  "days": 7,
  "daily_hours": 2.0
}
```

#### POST /api/study/generate-outline
生成复习提纲

**请求体：**
```json
{
  "subject": "科目名称",
  "content": "学习内容",
  "format": "outline"
}
```

## 🗄️ 数据库设计

### SQLite 表结构（第一版 MVP）

```sql
-- 用户表
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 对话记录表
CREATE TABLE conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 消息记录表
CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

-- 文件记录表
CREATE TABLE files (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    size INTEGER,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🚀 开发指南

### 环境要求

- Node.js 18+
- Python 3.10+
- OpenAI API Key

### 安装步骤

1. **克隆项目**
```bash
git clone <项目地址>
cd ai-study-assistant
```

2. **安装前端依赖**
```bash
cd frontend
npm install
```

3. **安装后端依赖**
```bash
cd ../backend
pip install -r requirements.txt
```

4. **配置环境变量**
```bash
# 后端
cp .env.example .env
# 编辑 .env 填写 OpenAI API Key

# 前端
cp .env.local.example .env.local
```

5. **启动开发服务器**
```bash
# 后端
cd backend
python -m uvicorn app.main:app --reload --port 8000

# 前端（新终端）
cd frontend
npm run dev
```

## 🐛 调试技巧

### 前端调试

1. 使用浏览器开发者工具（F12）
2. React DevTools 扩展
3. Network 标签查看 API 请求

### 后端调试

1. 查看 uvicorn 日志输出
2. 访问 http://localhost:8000/docs 测试 API
3. 使用 Postman 或 curl 测试接口

## 📝 代码规范

### 命名规范

- 文件名：小写 + 下划线（snake_case）
- 函数名：小写 + 下划线（snake_case）
- 类名：大写开头 + 大写（PascalCase）
- 常量：全大写 + 下划线（SCREAMING_SNAKE_CASE）

### 注释规范

- 函数/方法使用文档字符串
- 复杂逻辑添加行内注释
- 代码块说明使用多行注释

## 🔮 未来扩展

- [ ] 用户认证系统
- [ ] 数据库迁移到 PostgreSQL
- [ ] 文件存储到云服务
- [ ] 实时 WebSocket 对话
- [ ] 更多 AI 模型支持
- [ ] 移动端 APP
- [ ] 学习数据统计
- [ ] 社区分享功能
