@echo off
cd /d "%~dp0"

echo Starting 2048 AI Game...
echo.

start "" http://localhost:5173

npm run dev
