#!/bin/bash
# Deploy script for Silas Anderson's website

echo "🚀 Deploying Silas Anderson's website to Cloudflare Pages..."

# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=silas-anderson

echo "✅ Deployment complete!"
echo "🌐 Live at: https://silas-anderson.pages.dev"
echo "🏠 Custom domain: https://silasanderson.us ✅ ACTIVE"