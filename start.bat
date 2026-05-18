@echo off
chcp 65001 > nul
REM 大学生 AI 学习助手 - 启动脚本

echo ========================================
echo    AI 学习助手
echo ========================================
echo.
echo   1 - 安装依赖并启动
echo   2 - 直接启动
echo.
echo ========================================

set /p choice=请选择 (1/2): 

if "%choice%"=="1" goto install_start
if "%choice%"=="2" goto start_only
goto end

:install_start
echo.
echo [1/4] 安装前端依赖...
cd frontend
call npm install --registry=https://registry.npmmirror.com
cd ..

echo.
echo [2/4] 安装后端依赖...
cd backend
call pip install -r requirements.txt
cd ..

echo.
echo [3/4] 启动后端服务...
cd backend
start "AI学习助手-后端" cmd /k "python -m uvicorn app.main:app --reload --port 8000"
cd ..

echo.
echo [4/4] 启动前端服务 (5秒后)...
timeout /t 5 /nobreak > nul
cd frontend
start http://localhost:3000
call npm run dev
cd ..
goto end

:start_only
echo.
echo [1/3] 启动后端服务...
cd backend
start "AI学习助手-后端" cmd /k "python -m uvicorn app.main:app --reload --port 8000"
cd ..

echo.
echo [2/3] 启动前端服务...
cd frontend
start http://localhost:3000
call npm run dev
cd ..

echo [3/3] 启动完成！
goto end

:end
