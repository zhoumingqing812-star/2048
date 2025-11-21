@echo off
REM 2048 AI Game Launcher - PowerShell Wrapper
REM 这个批处理文件用于启动 PowerShell 脚本，避免执行策略问题

cd /d "%~dp0"

REM 尝试使用 PowerShell 运行脚本
powershell.exe -ExecutionPolicy Bypass -File "%~dp0start.ps1"

REM 如果 PowerShell 脚本执行失败，显示错误信息
if errorlevel 1 (
    echo.
    echo [X] Failed to start server
    echo.
    echo If you see execution policy errors, run this command:
    echo   powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser"
    echo.
    pause
)




