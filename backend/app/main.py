# -*- coding: utf-8 -*-
"""
大学生 AI 学习助手 - 后端入口文件
使用 FastAPI 框架构建 REST API

为什么用 FastAPI？
1. 自动生成 API 文档（Swagger UI）
2. 异步支持，性能好
3. 类型检查，减少 bug
4. 简单易学，适合入门
"""

# 导入 FastAPI 核心组件
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# 导入自定义的 API 路由
from app.api import chat, files, study

# 创建 FastAPI 应用实例
# title: API 文档中显示的名称
# version: API 版本号
# description: API 功能描述
app = FastAPI(
    title="大学生 AI 学习助手 API",
    version="1.0.0",
    description="提供 AI 对话、文件处理、学习计划等功能"
)

# ============================================
# 配置 CORS（跨域资源共享）
# 为什么需要 CORS？
# 因为前端运行在 3000 端口，后端在 8000 端口
# 浏览器默认不允许跨域请求，需要明确允许
# ============================================
app.add_middleware(
    CORSMiddleware,
    # 允许访问的源（前端地址）
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    # 允许携带凭证（cookies）
    allow_credentials=True,
    # 允许的方法
    allow_methods=["*"],
    # 允许的头部
    allow_headers=["*"],
)

# ============================================
# 注册路由
# 将不同的功能模块挂载到不同的路径下
# ============================================
# /api/chat - AI 对话相关
app.include_router(chat.router, prefix="/api/chat", tags=["AI 对话"])

# /api/files - 文件上传和处理相关
app.include_router(files.router, prefix="/api/files", tags=["文件处理"])

# /api/study - 学习计划相关
app.include_router(study.router, prefix="/api/study", tags=["学习计划"])


# ============================================
# 根路径 - 健康检查
# 用于测试服务是否正常运行
# ============================================
@app.get("/")
async def root():
    """
    根路径返回欢迎信息
    """
    return {
        "message": "🎓 欢迎使用大学生 AI 学习助手",
        "version": "1.0.0",
        "status": "running"
    }


# ============================================
# 健康检查接口
# 用于部署时检查服务状态
# ============================================
@app.get("/health")
async def health_check():
    """
    返回服务健康状态
    """
    return {"status": "healthy"}


# ============================================
# 启动提示
# 当直接运行此文件时显示信息
# ============================================
if __name__ == "__main__":
    import uvicorn
    print("=" * 50)
    print("🚀 启动后端服务...")
    print("📖 API 文档: http://localhost:8000/docs")
    print("=" * 50)
    # 使用 uvicorn 运行应用
    # reload=True: 代码修改后自动重载（开发模式）
    # host="0.0.0.0": 允许外部访问
    # port=8000: 监听端口
    uvicorn.run("app.main:app", reload=True, host="0.0.0.0", port=8000)
