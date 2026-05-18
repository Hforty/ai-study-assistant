# -*- coding: utf-8 -*-
"""
app/api/chat.py - AI 对话相关 API

提供与 AI 聊天机器人的交互接口
包括：
- 发送消息并获取 AI 回复
- 获取聊天历史记录
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from openai import OpenAI

# 创建路由实例
router = APIRouter()

# 初始化 DeepSeek 客户端
# DeepSeek 使用 OpenAI SDK，只需更换 API 地址和 Key
client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),  # DeepSeek API Key
    base_url="https://api.deepseek.com"      # DeepSeek API 地址
)


# ============================================
# 数据模型定义
# 使用 Pydantic 进行数据验证
# ============================================

class Message(BaseModel):
    """
    单条消息的数据模型
    
    属性：
    - role: 角色，'user' 表示用户，'assistant' 表示 AI
    - content: 消息内容
    """
    role: str  # 'user' 或 'assistant'
    content: str


class ChatRequest(BaseModel):
    """
    聊天请求的数据模型
    
    属性：
    - message: 用户发送的消息
    - history: 可选的聊天历史（用于上下文）
    """
    message: str
    history: Optional[List[Message]] = []


class ChatResponse(BaseModel):
    """
    聊天响应的数据模型
    
    属性：
    - response: AI 的回复内容
    - conversation_id: 对话 ID（用于保存历史）
    """
    response: str
    conversation_id: str


# ============================================
# API 接口定义
# ============================================

@router.post("/send", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """
    发送消息给 AI 并获取回复
    
    参数：
    - request: ChatRequest 对象，包含用户消息和历史
    
    返回：
    - ChatResponse 对象，包含 AI 回复
    
    异常：
    - 400: 请求参数错误
    - 500: AI 服务错误
    """
    try:
        # 构建消息列表
        # 加入系统提示，引导 AI 成为学习助手
        messages = [
            {
                "role": "system",
                "content": """你是一个友好、有耐心的 AI 学习助手。
                你的目标是帮助大学生学习，包括：
                1. 解答学术问题
                2. 帮助理解复杂概念
                3. 提供学习建议和方法
                4. 生成复习计划
                5. 帮助总结知识点
                
                请用简洁、易懂的语言回答。
                如果问题不清楚，可以询问更多信息。"""
            }
        ]
        
        # 添加历史记录（用于上下文理解）
        if request.history:
            for msg in request.history[-10:]:  # 只保留最近 10 条
                messages.append({
                    "role": msg.role,
                    "content": msg.content
                })
        
        # 添加当前用户消息
        messages.append({
            "role": "user",
            "content": request.message
        })
        
        # 调用 DeepSeek API
        response = client.chat.completions.create(
            model="deepseek-chat",  # DeepSeek 聊天模型
            messages=messages,
            temperature=0.7,  # 创造性参数，0-2，越高越有创意
            max_tokens=1000  # 最大回复长度
        )
        
        # 提取 AI 回复
        ai_response = response.choices[0].message.content
        
        return ChatResponse(
            response=ai_response,
            conversation_id="conv_" + str(hash(request.message))[:8]  # 简单的会话 ID
        )
        
    except Exception as e:
        # 错误处理
        raise HTTPException(status_code=500, detail=f"AI 服务出错: {str(e)}")


@router.get("/history")
async def get_history():
    """
    获取聊天历史记录
    
    这个接口用于演示，后续会连接数据库
    目前返回空列表
    
    返回：
    - 空的历史记录列表
    """
    # TODO: 从数据库读取历史记录
    return {"history": []}


@router.delete("/history")
async def clear_history():
    """
    清除聊天历史记录
    
    返回：
    - 成功消息
    """
    # TODO: 清空数据库中的历史记录
    return {"message": "历史记录已清除"}
