# Deployment Guide for Silas Anderson's Website

## 🌐 Live Website
- **Cloudflare Pages URL**: https://silas-anderson.pages.dev
- **Custom Domain**: silasanderson.us (requires DNS configuration)

## 🚀 Quick Deployment

### Option 1: Using Deploy Scripts
**Windows:**
```cmd
deploy.bat
```

**Unix/Linux/Mac:**
```bash
./deploy.sh
```

### Option 2: Manual Command
```bash
wrangler pages deploy . --project-name=silas-anderson
```

## 🔧 Setting Up Custom Domain (silasanderson.us)

### Step 1: Configure DNS Records
You need to set up DNS records for `silasanderson.us` to point to Cloudflare Pages:

1. **If using Cloudflare DNS:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Select your domain `silasanderson.us`
   - Add CNAME record: `silasanderson.us` → `silas-anderson.pages.dev`
   - Add CNAME record: `www.silasanderson.us` → `silas-anderson.pages.dev`

2. **If using other DNS providers:**
   - Add CNAME record: `silasanderson.us` → `silas-anderson.pages.dev`
   - Add CNAME record: `www.silasanderson.us` → `silas-anderson.pages.dev`

### Step 2: Add Custom Domain in Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to Pages → silas-anderson
3. Go to "Custom domains" tab
4. Click "Set up a custom domain"
5. Enter `silasanderson.us`
6. Follow the verification process

### Step 3: Enable HTTPS (Automatic)
Cloudflare will automatically provision SSL certificates for your custom domain.

## 📁 Project Structure
```
silas/
├── index.html          # Main website file
├── script.js           # All JavaScript functionality
├── styles.css          # Complete styling
├── wrangler.toml       # Cloudflare configuration
├── deploy.sh           # Unix deployment script
├── deploy.bat          # Windows deployment script
├── README.md           # Project documentation
├── USER_GUIDE.md       # User instructions
└── DEPLOYMENT.md       # This file
```

## 🔄 Development Workflow

1. **Make changes** to HTML, CSS, or JavaScript files
2. **Test locally** by opening `index.html` in browser
3. **Deploy** using one of the methods above
4. **Verify** changes at https://silas-anderson.pages.dev

## 🛠️ Troubleshooting

### Common Issues:

**Deployment fails:**
- Check if you're logged in: `wrangler whoami`
- Re-authenticate: `wrangler login`

**Custom domain not working:**
- Verify DNS records are properly configured
- Check SSL certificate status in Cloudflare dashboard
- Allow up to 24 hours for DNS propagation

**Files not updating:**
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Check deployment logs for errors

## 📊 Performance Features

Cloudflare Pages automatically provides:
- **Global CDN** - Fast loading worldwide
- **Automatic HTTPS** - Secure connections
- **Branch previews** - Test changes before going live
- **Analytics** - Track website performance
- **DDoS protection** - Built-in security

## 🔒 Security Notes

- **Password protection** is handled client-side (localStorage)
- **Data persistence** uses browser LocalStorage only
- **No server-side** data processing or storage
- **HTTPS enforced** on custom domain

---

💡 **Need help?** Check the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/)