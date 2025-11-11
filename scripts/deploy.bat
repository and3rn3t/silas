@echo off
REM Enhanced deploy script for Silas Anderson's website (Windows)

echo.
echo 🚀 Deploying Silas Anderson's website to Cloudflare Pages...
echo.

REM Check if wrangler is installed
where wrangler >nul 2>&1
if errorlevel 1 (
    echo ❌ Wrangler CLI not found. Please install it first:
    echo    npm install -g wrangler
    pause
    exit /b 1
)

REM Run pre-deployment checks
echo 🔍 Running pre-deployment checks...
call npm run lint --silent
if errorlevel 1 (
    echo ❌ Linting failed. Please fix errors before deploying.
    pause
    exit /b 1
)

call npm run test --silent
if errorlevel 1 (
    echo ❌ Tests failed. Please fix tests before deploying.
    pause
    exit /b 1
)

echo ✅ Pre-deployment checks passed!
echo.

REM Deploy to Cloudflare Pages
echo ☁️ Uploading to Cloudflare Pages...
wrangler pages deploy . --project-name=silas-anderson

if errorlevel 1 (
    echo ❌ Deployment failed!
    pause
    exit /b 1
)

echo.
echo ✅ Deployment complete!
echo 🌐 Live at: https://silas-anderson.pages.dev
echo 🏠 Custom domain: https://silasanderson.us ✅ ACTIVE
echo 📊 View deployment logs in Cloudflare Pages dashboard
echo.
pause