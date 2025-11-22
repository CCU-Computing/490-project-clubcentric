@echo off
REM Start frontend and backend servers in separate windows
REM This script only starts servers - no data loading

REM Change to script's directory
cd /d "%~dp0"

echo ---------------------------------------------------
echo Starting Servers (No Data Loading)
echo ---------------------------------------------------

REM Check if we're in the right directory
if not exist "backend\manage.py" (
    echo Error: This script must be run from the project root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Check if venv exists
if not exist "venv\Scripts\python.exe" (
    echo Error: Virtual environment not found at venv\
    echo Please create it first: python -m venv venv
    pause
    exit /b 1
)

REM Start the Backend (Django)
echo [Backend] Starting Django Server...
start "Django Backend - 490-project-clubcentric" cmd /k "cd /d %~dp0backend && ..\venv\Scripts\python.exe manage.py runserver"

REM Wait a moment for backend to initialize
timeout /t 2 /nobreak >nul

REM Start the Frontend (React/Vite)
echo [Frontend] Starting Vite Server...
start "Vite Frontend - 490-project-clubcentric" cmd /k "cd /d %~dp0frontend && npm run dev"

echo ---------------------------------------------------
echo Both servers are running in separate windows.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:5173 (usually)
echo.
echo Close the windows to stop the services.
echo ---------------------------------------------------

pause

