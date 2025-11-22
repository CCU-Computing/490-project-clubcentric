@echo off
REM STEP 5 - Start the Backend Server
REM This script starts the Django development server

REM Change to script's directory
cd /d "%~dp0"

echo ==================================================
echo STEP 5: Starting Django Backend Server
echo ==================================================
echo.

REM Check if we're in the right directory
if not exist "backend\manage.py" (
    echo ERROR: This script must be run from the project root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Check if venv exists
if not exist "venv\Scripts\python.exe" (
    echo ERROR: Virtual environment not found at venv\
    echo Please run 01_setup_venv.bat first
    pause
    exit /b 1
)

REM Check if migrations have been run (optional check)
echo [Step 5.0] Verifying setup...
call venv\Scripts\python.exe backend\manage.py check --database default >nul 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Database check failed. Server may not start correctly.
    echo Make sure:
    echo   1. PostgreSQL is running
    echo   2. .env file is configured correctly
    echo   3. Migrations have been run (03_run_migrations.bat)
    echo.
    choice /C YN /M "Continue anyway"
    if errorlevel 2 (
        echo Operation cancelled.
        pause
        exit /b 0
    )
    echo.
)

echo [Step 5.1] Starting Django development server...
echo.
echo Server will be available at: http://127.0.0.1:8000
echo Admin panel: http://127.0.0.1:8000/admin/
echo.
echo Press Ctrl+C to stop the server
echo ==================================================
echo.

REM Start the server
cd backend
..\venv\Scripts\python.exe manage.py runserver

REM If server stops, show message
echo.
echo ==================================================
echo Server stopped.
echo ==================================================
pause

