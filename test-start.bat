@echo off
echo 测试脚本开始...
pause
echo 即将启动服务器...
cd /d "%~dp0"
echo 当前目录: %CD%
pause
npm run dev
pause
