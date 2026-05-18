# -*- coding: utf-8 -*-
"""
app/api/study.py - 学习计划相关 API

提供学习计划、复习提纲等功能的接口
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from openai import OpenAI

# 创建路由实例
router = APIRouter()

# 初始化 DeepSeek 客户端
client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)


# ============================================
# 数据模型定义
# ============================================

class StudyGoal(BaseModel):
    """学习目标模型"""
    subject: str  # 科目
    target_hours: float  # 目标学习时长（小时）
    deadline: str  # 截止日期


class StudyPlanRequest(BaseModel):
    """生成学习计划请求"""
    subject: str  # 科目
    topics: List[str]  # 学习主题列表
    days: int = 7  # 计划天数
    daily_hours: float = 2.0  # 每天学习时长


class StudyPlanResponse(BaseModel):
    """学习计划响应"""
    plan: List[dict]  # 每日计划
    tips: List[str]  # 学习建议
    total_hours: float  # 总时长


class ReviewOutlineRequest(BaseModel):
    """复习提纲请求"""
    subject: str  # 科目
    content: str  # 学习内容（可以是上传文件的提取内容）
    format: str = "outline"  # outline 或 mind_map


class ReviewOutlineResponse(BaseModel):
    """复习提纲响应"""
    outline: str  # 提纲内容
    key_points: List[str]  # 重点知识
    format: str  # 格式类型


# ============================================
# API 接口定义
# ============================================

@router.post("/generate-plan", response_model=StudyPlanResponse)
async def generate_study_plan(request: StudyPlanRequest):
    """
    生成每日学习计划
    
    参数：
    - request: 学习计划请求
    
    返回：
    - 每日学习计划
    """
    try:
        # 构建提示词
        prompt = f"""你是一个学习规划专家。请为学生生成一个 {request.days} 天的学习计划。

科目：{request.subject}
学习主题：{', '.join(request.topics)}
每天学习时长：{request.daily_hours} 小时

请生成一个详细的每日学习计划，包括：
1. 每天的具体学习内容
2. 每个主题的时间分配
3. 适当休息和复习时间

请用 JSON 格式返回，包含以下字段：
- daily_plan: 数组，每个元素包含 day（天数）、content（内容）、hours（时长）
- tips: 学习建议数组
- total_hours: 总学习时长
"""
        
        # 调用 DeepSeek API 生成计划
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {
                    "role": "system",
                    "content": "你是一个专业的学习规划专家，擅长帮助学生制定高效的学习计划。请用中文回复。"
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        # 提取回复
        plan_text = response.choices[0].message.content
        
        # TODO: 解析 JSON 并返回结构化数据
        # 目前返回原始文本
        return StudyPlanResponse(
            plan=[{"day": i+1, "content": f"第{i+1}天计划", "hours": request.daily_hours} for i in range(request.days)],
            tips=["保持专注", "及时复习", "适当休息"],
            total_hours=request.days * request.daily_hours
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"生成学习计划失败: {str(e)}")


@router.post("/generate-outline", response_model=ReviewOutlineResponse)
async def generate_review_outline(request: ReviewOutlineRequest):
    """
    生成复习提纲
    
    参数：
    - request: 复习提纲请求
    
    返回：
    - 复习提纲
    """
    try:
        # 构建提示词
        prompt = f"""请为以下学习内容生成复习提纲。

科目：{request.subject}
学习内容：
{request.content}

请生成：
1. 复习提纲（{request.format}）
2. 重点知识点列表
3. 可能的考点

请用清晰的结构组织内容。"""
        
        # 调用 DeepSeek API 生成提纲
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {
                    "role": "system",
                    "content": "你是一个专业的学习辅导老师，擅长帮助学生整理知识点和复习提纲。请用中文回复。"
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        # 提取回复
        outline = response.choices[0].message.content
        
        return ReviewOutlineResponse(
            outline=outline,
            key_points=["重点1", "重点2", "重点3"],  # TODO: 智能提取
            format=request.format
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"生成复习提纲失败: {str(e)}")


@router.get("/templates")
async def get_plan_templates():
    """
    获取学习计划模板
    
    返回：
    - 预设的学习计划模板列表
    """
    templates = [
        {
            "id": "daily",
            "name": "每日学习计划",
            "description": "适合日常学习使用，包含固定的时间模板",
            "default_days": 7,
            "default_hours": 2.0
        },
        {
            "id": "exam",
            "name": "考试复习计划",
            "description": "适合考前冲刺，高效利用时间",
            "default_days": 14,
            "default_hours": 4.0
        },
        {
            "id": "weekly",
            "name": "周末强化计划",
            "description": "周末集中学习某门课程",
            "default_days": 2,
            "default_hours": 6.0
        }
    ]
    
    return {"templates": templates}


@router.get("/tips")
async def get_study_tips():
    """
    获取学习技巧建议
    
    返回：
    - 学习技巧列表
    """
    tips = [
        "制定明确的学习目标，有助于保持动力",
        "使用番茄工作法，每25分钟休息5分钟",
        "及时复习，使用间隔重复法巩固记忆",
        "多做练习题，理论结合实践",
        "保持良好的作息规律，保证充足睡眠",
        "学习环境要安静、整洁，减少干扰",
        "使用思维导图整理知识点之间的联系",
        "教会别人是最好的学习方法"
    ]
    
    return {"tips": tips}
