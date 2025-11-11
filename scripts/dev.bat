@echo off
REM Enhanced development script for Windows

echo 🚀 Starting Silas Anderson Development Environment...

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Run pre-development checks
echo 🔍 Running pre-development checks...
call npm run lint --silent
if errorlevel 1 (
    echo ❌ Linting failed. Please fix errors before continuing.
    pause
    exit /b 1
)
echo ✅ Code linting passed

REM Start development server
echo 🌐 Starting development server on http://localhost:3000
echo 📝 Press Ctrl+C to stop the server
echo 🎮 Navigate to the game section to test RPG features
echo.

call npm run serve