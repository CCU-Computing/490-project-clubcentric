@echo off
REM STEP 4 - Load or Generate Mock Data
REM This script generates mock data for analytics and networking

REM Change to script's directory
cd /d "%~dp0"

echo ==================================================
echo STEP 4: Generating Mock Data
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

REM Check if migrations have been run
echo [Step 4.0] Checking migration status...
call venv\Scripts\python.exe backend\manage.py showmigrations --list >nul 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Could not check migrations. Make sure they were run first.
    echo.
    choice /C YN /M "Continue anyway"
    if errorlevel 2 (
        echo Operation cancelled.
        echo Please run 03_run_migrations.bat first.
        pause
        exit /b 0
    )
    echo.
)

REM Generate Analytics Mock Data
echo [Step 4.1] Generating analytics mock data...
call venv\Scripts\python.exe backend\manage.py generate_analytics_data

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo WARNING: Analytics data generation had issues
    echo Continuing with networking data...
    echo.
) else (
    echo Analytics data generated successfully!
    echo.
)

REM Generate Networking Mock Data
echo [Step 4.2] Generating networking mock data...
call venv\Scripts\python.exe backend\manage.py generate_network_data

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo WARNING: Networking data generation had issues
    echo.
) else (
    echo Networking data generated successfully!
    echo.
)

REM Try to load JSON fixtures if they exist
if exist "backend\clubs\fixtures\*.json" (
    echo [Step 4.3] Loading club fixtures (if any)...
    call venv\Scripts\python.exe backend\manage.py loaddata backend\clubs\fixtures\*.json 2>nul
    echo.
)

echo ==================================================
echo Mock Data Generation Complete
echo ==================================================
echo.
echo Mock data has been generated for:
echo   - Analytics (attendance, engagement)
echo   - Networking (connections, profiles, memberships)
echo.
echo Next steps:
echo   1. Run: 05_start_backend.bat
echo   2. Then: start_frontend.bat (in a separate window)
echo.
pause

