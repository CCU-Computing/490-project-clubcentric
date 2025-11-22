@echo off
REM Generate mock data for analytics and networking

REM Change to script's directory
cd /d "%~dp0"

echo ---------------------------------------------------
echo Generating Mock Data
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

REM Generate Analytics Mock Data
echo [Analytics] Generating mock analytics data...
call venv\Scripts\python.exe backend\manage.py generate_analytics_data

echo.

REM Generate Networking Mock Data
echo [Networking] Generating mock network data...
call venv\Scripts\python.exe backend\manage.py generate_network_data

echo.
echo ---------------------------------------------------
echo Mock data generation complete!
echo ---------------------------------------------------

pause

