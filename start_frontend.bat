@echo off
REM Start only the frontend server

REM Change to script's directory
cd /d "%~dp0"

echo ---------------------------------------------------
echo Starting Vite Frontend Server
echo ---------------------------------------------------

REM Check if we're in the right directory
if not exist "frontend" (
    echo Error: This script must be run from the project root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Check if node_modules exists (dependencies installed)
if not exist "frontend\node_modules" (
    echo [Frontend] Installing dependencies first...
    cd frontend
    call npm install
    cd ..
)

REM Start the Frontend (React/Vite)
echo [Frontend] Starting Vite Server...
cd frontend
npm run dev

pause

