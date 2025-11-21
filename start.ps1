# 2048 AI Game Launcher (PowerShell Version)
# 这个版本可以更好地处理 Ctrl+C 信号

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   2048 AI Game Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
Write-Host "[1/3] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[X] Error: Node.js is not installed" -ForegroundColor Red
    Write-Host "Please visit https://nodejs.org to download and install" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# 检查依赖
Write-Host "[2/3] Checking dependencies..." -ForegroundColor Yellow
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

if (-not (Test-Path "node_modules")) {
    Write-Host "[!] First run, installing dependencies..." -ForegroundColor Yellow
    Write-Host "[!] This may take a few minutes, please wait..." -ForegroundColor Yellow
    Write-Host ""
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[X] Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[OK] Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "[OK] Dependencies already exist" -ForegroundColor Green
}
Write-Host ""

# 启动服务器
Write-Host "[3/3] Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Game URL: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "  Please open the URL above in your browser" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Start-Sleep -Seconds 2
Start-Process "http://localhost:5173"

# 清理函数
function Cleanup-Processes {
    Write-Host ""
    Write-Host "Cleaning up processes..." -ForegroundColor Yellow
    
    # 等待一下，让进程有时间正常退出
    Start-Sleep -Milliseconds 500
    
    # 查找并结束所有占用 5173 端口的进程
    try {
        $connections = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
        foreach ($conn in $connections) {
            if ($conn.State -eq "Listen") {
                $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host "Killing process: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Yellow
                    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
                }
            }
        }
    } catch {
        # 如果 Get-NetTCPConnection 不可用，使用 netstat
        $netstatOutput = netstat -ano | Select-String ":5173" | Select-String "LISTENING"
        if ($netstatOutput) {
            $pids = $netstatOutput | ForEach-Object {
                if ($_ -match '\s+(\d+)\s*$') {
                    $matches[1]
                }
            }
            foreach ($pid in $pids) {
                Write-Host "Killing process PID: $pid" -ForegroundColor Yellow
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
        }
    }
    
    Write-Host "[OK] Cleanup completed" -ForegroundColor Green
}

# 捕获 Ctrl+C 信号
$script:cleanupDone = $false

# 使用 C# 代码来正确注册 CancelKeyPress 事件并直接清理进程
try {
    Add-Type -TypeDefinition @"
using System;
using System.Diagnostics;
using System.Text.RegularExpressions;
public class CancelHandler {
    public static void Register() {
        Console.CancelKeyPress += (sender, e) => {
            e.Cancel = true;
            Console.WriteLine();
            Console.WriteLine("Stopping server...");
            CleanupPort(5173);
        };
    }
    private static void CleanupPort(int port) {
        try {
            var process = new Process {
                StartInfo = new ProcessStartInfo {
                    FileName = "netstat",
                    Arguments = "-ano",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    CreateNoWindow = true
                }
            };
            process.Start();
            var output = process.StandardOutput.ReadToEnd();
            process.WaitForExit();
            
            var pattern = @":(\d+)\s+.*LISTENING\s+(\d+)";
            var matches = Regex.Matches(output, pattern);
            foreach (Match match in matches) {
                var portStr = match.Groups[1].Value;
                int p;
                if (int.TryParse(portStr, out p) && p == port) {
                    var pidStr = match.Groups[2].Value;
                    int pid;
                    if (int.TryParse(pidStr, out pid)) {
                        try {
                            var proc = Process.GetProcessById(pid);
                            proc.Kill();
                            Console.WriteLine("Killed process: " + proc.ProcessName + " (PID: " + pid + ")");
                        } catch {}
                    }
                }
            }
            Console.WriteLine("Cleanup completed");
        } catch {}
    }
}
"@
    [CancelHandler]::Register()
} catch {
    Write-Host "[!] Warning: Could not register Ctrl+C handler: $_" -ForegroundColor Yellow
    Write-Host "[!] You may need to manually kill processes on port 5173" -ForegroundColor Yellow
}

# 注册清理函数到退出事件
Register-EngineEvent PowerShell.Exiting -Action {
    if (-not $script:cleanupDone) {
        $script:cleanupDone = $true
        Cleanup-Processes
    }
} | Out-Null

# 启动服务器（直接调用，让 Ctrl+C 信号正确传递）
try {
    # 方法1: 直接使用 vite.cmd（Windows 上最可靠的方法）
    $vitePath = Join-Path $scriptPath "node_modules\.bin\vite.cmd"
    if (Test-Path $vitePath) {
        & $vitePath
    } else {
        # 方法2: 尝试使用 npm.cmd（Windows 上的 npm 通常是 .cmd 文件）
        $npmPaths = @(
            "D:\Node.js\npm.cmd",
            "$env:ProgramFiles\nodejs\npm.cmd",
            "$env:ProgramFiles(x86)\nodejs\npm.cmd"
        )
        
        $npmFound = $false
        foreach ($npmPath in $npmPaths) {
            if (Test-Path $npmPath) {
                & $npmPath run dev
                $npmFound = $true
                break
            }
        }
        
        if (-not $npmFound) {
            # 方法3: 使用 Get-Command 查找 npm
            $npmCmd = Get-Command npm -ErrorAction SilentlyContinue
            if ($npmCmd) {
                & $npmCmd.Source run dev
            } else {
                Write-Host "[X] Error: Cannot find npm or vite" -ForegroundColor Red
                exit 1
            }
        }
    }
} catch {
    Write-Host "[X] Failed to start server: $_" -ForegroundColor Red
    if (-not $script:cleanupDone) {
        $script:cleanupDone = $true
        Cleanup-Processes
    }
    exit 1
} finally {
    if (-not $script:cleanupDone) {
        $script:cleanupDone = $true
        Cleanup-Processes
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Server stopped" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to close"

