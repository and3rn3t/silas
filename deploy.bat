@echo off
REM Deploy script for Silas Anderson's website (Windows)

echo 🚀 Deploying Silas Anderson's website to Cloudflare Pages...

REM Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=silas-anderson

echo ✅ Deployment complete!
echo 🌐 Live at: https://silas-anderson.pages.dev
echo 🏠 Custom domain: https://silasanderson.us (when configured)