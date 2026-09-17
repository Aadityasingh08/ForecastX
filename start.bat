@echo off
title ForecastX - Conversational Weather Intelligence
echo ==============================================================
echo   STARTING FORECASTX: METEOROLOGICAL INTELLIGENCE PLATFORM
echo ==============================================================
echo.

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.11+ and add it to PATH.
    pause
    exit /b 1
)

echo [INFO] Launching ForecastX Dual Development Services...
echo [INFO] Backend API: http://127.0.0.1:8000
echo [INFO] Frontend Web: http://localhost:5173
echo.

python scripts\run_local.py

pause
