@echo off
REM Master script to run all setup steps in sequence
REM This automates the entire setup process

REM Change to script's directory
cd /d "%~dp0"

echo ==================================================
echo Automated Setup - All Steps
echo ==================================================
echo.
echo This script will run all setup steps in sequence:
echo   1. Create virtual environment
echo   2. Install dependencies
echo   3. Run migrations
echo   4. Generate mock data
echo   5. Start backend server
echo.
echo Note: Steps 4 and 5 are optional and can be skipped.
echo.
pause

REM Step 1: Setup venv
echo.
echo ==================================================
echo Running STEP 1: Virtual Environment Setup
echo ==================================================
call 01_setup_venv.bat

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Setup failed at Step 1
    pause
    exit /b 1
)

REM Step 2: Install dependencies
echo.
echo ==================================================
echo Running STEP 2: Install Dependencies
echo ==================================================
call 02_install_dependencies.bat

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Setup failed at Step 2
    pause
    exit /b 1
)

REM Step 3: Run migrations
echo.
echo ==================================================
echo Running STEP 3: Run Migrations
echo ==================================================
call 03_run_migrations.bat

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Setup failed at Step 3
    pause
    exit /b 1
)

REM Step 4: Generate mock data (optional)
echo.
echo ==================================================
echo Running STEP 4: Generate Mock Data (Optional)
echo ==================================================
choice /C YN /M "Do you want to generate mock data"
if not errorlevel 2 (
    call 04_generate_mock_data.bat
)

REM Step 5: Start server (optional)
echo.
echo ==================================================
echo Setup Complete!
echo ==================================================
echo.
choice /C YN /M "Do you want to start the backend server now"
if not errorlevel 2 (
    echo.
    echo Starting backend server...
    echo.
    call 05_start_backend.bat
)

echo.
echo ==================================================
echo All setup steps completed!
echo ==================================================
echo.
pause

