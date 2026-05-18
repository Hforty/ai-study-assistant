# 大学生 AI 学习助手 - 快速启动脚本

echo "========================================"
echo "  🎓 大学生 AI 学习助手"
echo "========================================"
echo ""

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ 错误: $1 未安装"
        echo "   请先安装 $1"
        exit 1
    fi
}

# 检查依赖
echo "📦 检查依赖..."
check_command "node"
check_command "npm"
check_command "python"

echo "✅ 依赖检查通过"
echo ""

# 安装前端依赖
echo "📚 安装前端依赖..."
cd frontend
npm install
cd ..
echo ""

# 安装后端依赖
echo "📚 安装后端依赖..."
cd backend
pip install -r requirements.txt
cd ..
echo ""

# 检查环境变量
if [ ! -f "backend/.env" ]; then
    echo "⚠️  警告: backend/.env 文件不存在"
    echo "   请复制 backend/.env.example 为 .env 并填写 OpenAI API Key"
    echo ""
fi

echo "========================================"
echo "  🚀 启动服务"
echo "========================================"
echo ""
echo "后端服务将运行在: http://localhost:8000"
echo "前端服务将运行在: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

# 启动后端（在后台）
cd backend
echo "🔧 启动后端服务..."
python -m uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 启动前端
cd frontend
echo "🔧 启动前端服务..."
npm run dev &
FRONTEND_PID=$!
cd ..

# 等待中断信号
trap "echo '正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

wait
