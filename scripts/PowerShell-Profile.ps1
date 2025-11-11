# PowerShell profile for Silas Anderson project
# Place this in your PowerShell profile ($PROFILE) or source it when working on the project

# Project-specific functions for enhanced terminal experience
function Start-SilasDevServer {
    [CmdletBinding()]
    param()

    Write-Host "🚀 Starting Silas Anderson Development Server..." -ForegroundColor Green

    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Error "❌ Failed to install dependencies"
            return
        }
    }

    Write-Host "🔍 Running pre-development checks..." -ForegroundColor Blue
    npm run lint --silent
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Linting failed. Run 'npm run lint:fix' to auto-fix issues."
        return
    }

    Write-Host "✅ Pre-checks passed!" -ForegroundColor Green
    Write-Host "🌐 Server will start at http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🎮 Navigate to game section to test RPG features" -ForegroundColor Magenta

    npm run serve
}

function Test-SilasProject {
    [CmdletBinding()]
    param(
        [switch]$Coverage,
        [switch]$E2E,
        [switch]$Watch
    )

    if ($Coverage) {
        Write-Host "🧪 Running tests with coverage..." -ForegroundColor Blue
        npm run test:coverage
    } elseif ($E2E) {
        Write-Host "🎭 Running E2E tests..." -ForegroundColor Blue
        npm run test:e2e
    } elseif ($Watch) {
        Write-Host "👀 Starting test watcher..." -ForegroundColor Blue
        npm run test:watch
    } else {
        Write-Host "🧪 Running unit tests..." -ForegroundColor Blue
        npm run test
    }
}

function Deploy-SilasProject {
    [CmdletBinding()]
    param()

    Write-Host "🚀 Deploying Silas Anderson project..." -ForegroundColor Green

    Write-Host "🔍 Running pre-deployment checks..." -ForegroundColor Blue
    npm run predeploy
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Pre-deployment checks failed"
        return
    }

    Write-Host "☁️ Deploying to Cloudflare Pages..." -ForegroundColor Cyan
    npm run deploy

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Deployment successful!" -ForegroundColor Green
        Write-Host "🌐 Live at: https://silas-anderson.pages.dev" -ForegroundColor Cyan
        Write-Host "🏠 Custom domain: https://silasanderson.us" -ForegroundColor Cyan
    }
}

# Aliases for quick access
Set-Alias -Name sdev -Value Start-SilasDevServer
Set-Alias -Name stest -Value Test-SilasProject
Set-Alias -Name sdeploy -Value Deploy-SilasProject

# Display helpful commands when sourced
if ($MyInvocation.InvocationName -ne ".") {
    Write-Host ""
    Write-Host "🎮 Silas Anderson Project Commands:" -ForegroundColor Yellow
    Write-Host "  sdev          - Start development server" -ForegroundColor White
    Write-Host "  stest         - Run unit tests" -ForegroundColor White
    Write-Host "  stest -Coverage - Run tests with coverage" -ForegroundColor White
    Write-Host "  stest -E2E    - Run E2E tests" -ForegroundColor White
    Write-Host "  stest -Watch  - Start test watcher" -ForegroundColor White
    Write-Host "  sdeploy       - Deploy to production" -ForegroundColor White
    Write-Host ""
}
