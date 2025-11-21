@echo off
cd /d "%~dp0"

echo ========================================
echo    2048 AI Game Launcher
echo ========================================
echo.

echo [1/3] Checking Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo.
    echo [X] Error: Node.js is not installed
    echo.
    echo Please visit https://nodejs.org to download and install
    echo.
    pause
    exit /b 1
)

node --version
echo [OK] Node.js is installed
echo.

echo [2/3] Checking dependencies...
if not exist "node_modules\" (
    echo.
    echo [!] First run, installing dependencies...
    echo [!] This may take a few minutes, please wait...
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo [X] Failed to install dependencies
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed successfully
) else (
    echo [OK] Dependencies already exist
)
echo.

echo [3/3] Starting development server...
echo.
echo ========================================
echo.
echo   Game URL: http://localhost:5173
echo.
echo   Please open the URL above in your browser
echo.
echo   Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

timeout /t 2 /nobreak >nul
start http://localhost:5173

npm run dev

:end
echo.
echo ========================================
echo   Server stopped
echo ========================================
echo.
echo Press any key to close...
pause >nul




