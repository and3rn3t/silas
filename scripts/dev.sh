#!/bin/bash
# Enhanced development script for Unix systems

set -e  # Exit on error

echo "🚀 Starting Silas Anderson Development Environment..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run pre-development checks
echo "🔍 Running pre-development checks..."
npm run lint --silent
echo "✅ Code linting passed"

# Start development server
echo "🌐 Starting development server on http://localhost:3000"
echo "📝 Press Ctrl+C to stop the server"
echo "🎮 Navigate to the game section to test RPG features"
echo ""

npm run serve
