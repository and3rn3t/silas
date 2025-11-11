#!/bin/bash
# Enhanced deploy script for Silas Anderson's website

set -e  # Exit on error

echo ""
echo "🚀 Deploying Silas Anderson's website to Cloudflare Pages..."
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Please install it first:"
    echo "   npm install -g wrangler"
    exit 1
fi

# Run pre-deployment checks
echo "🔍 Running pre-deployment checks..."
npm run lint --silent
echo "✅ Linting passed"

npm run test --silent
echo "✅ Tests passed"

echo "✅ Pre-deployment checks complete!"
echo ""

# Deploy to Cloudflare Pages
echo "☁️ Uploading to Cloudflare Pages..."
wrangler pages deploy . --project-name=silas-anderson

echo ""
echo "✅ Deployment complete!"
echo "🌐 Live at: https://silas-anderson.pages.dev"
echo "🏠 Custom domain: https://silasanderson.us ✅ ACTIVE"
echo "📊 View deployment logs in Cloudflare Pages dashboard"
echo ""
