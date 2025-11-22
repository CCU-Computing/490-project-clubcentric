@echo off
REM Start only the backend server

REM Change to script's directory
cd /d "%~dp0"

echo ---------------------------------------------------
echo Starting Django Backend Server
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
cd backend
..\venv\Scripts\python.exe manage.py runserver

pause

