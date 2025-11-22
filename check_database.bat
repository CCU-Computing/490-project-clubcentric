@echo off
REM Check database connection and configuration

REM Change to script's directory
cd /d "%~dp0"

echo ---------------------------------------------------
echo Checking Database Connection
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

REM Check database connection
echo [Database] Checking connection...
call venv\Scripts\python.exe backend\manage.py check --database default

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Database connection successful!
) else (
    echo.
    echo Database connection failed. Check your .env file in backend\
)

echo.
pause

