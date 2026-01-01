# Complete Hostinger Deployment Guide

## 📋 What You Need from Hostinger

### 1. **VPS Plan (Required)**
- **Minimum:** VPS 1 (1 vCPU, 1GB RAM, 20GB SSD) - ~$4-5/month
- **Recommended:** VPS 2 (2 vCPU, 2GB RAM, 40GB SSD) - ~$7-8/month
- **Why VPS?** Shared hosting won't work - you need root access to install system binaries

### 2. **Operating System**
- **Ubuntu 24.04 LTS** ✅ (You have this!)
- **Ubuntu 22.04 LTS** (also supported)
- Hostinger VPS comes with Ubuntu pre-installed

### 3. **Domain Name** ✅
- **Your Domain:** freereelsdownload.com ✅
- Point your domain to Hostinger VPS IP
- See DNS configuration steps below

---

## 🔧 System Requirements & Dependencies

### Required Software:
1. **Node.js** (v18.x or v20.x)
2. **Python 3.8+** (for yt-dlp)
3. **yt-dlp** (Python package)
4. **ffmpeg** (for audio/video processing)
5. **PM2** (process manager - recommended)
6. **Nginx** (reverse proxy - recommended)

---

## 📦 Step-by-Step Deployment

### Step 1: Connect to Your VPS

```bash
# SSH into your Hostinger VPS
ssh root@your-vps-ip
# Or if you created a user:
ssh username@your-vps-ip
```

### Step 2: Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### Step 3: Install Node.js

```bash
# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

### Step 4: Install Python & yt-dlp

```bash
# Install Python 3 and pip
sudo apt install -y python3 python3-pip

# Install yt-dlp
pip3 install --upgrade yt-dlp

# Verify installation
yt-dlp --version
```

### Step 5: Install FFmpeg

```bash
# Install FFmpeg
sudo apt install -y ffmpeg

# Verify installation
ffmpeg -version
```

### Step 6: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs (usually: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u username --hp /home/username)
```

### Step 7: Install Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 8: Clone Your Project

```bash
# Install Git if not already installed
sudo apt install -y git

# Clone your repository
cd /var/www  # or your preferred directory
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git freereelsdownload
cd freereelsdownload
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual GitHub details

# Install project dependencies
npm install
```

### Step 9: Build the Project

```bash
# Build for production
npm run build

# This creates a .next folder with optimized production build
```

### Step 10: Configure Environment Variables

```bash
# Create .env.production file
nano .env.production

# Add these environment variables:
NEXT_PUBLIC_SITE_URL=https://freereelsdownload.com
NODE_ENV=production

# Save: Press Ctrl+X, then Y, then Enter
```

### Step 11: Start with PM2

```bash
# Start the Next.js app with PM2
pm2 start npm --name "freereelsdownload" -- start

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs freereelsdownload
```

### Step 12: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/reelsaudio
```

**Add this configuration:**

```nginx
server {
    listen 80;
    server_name freereelsdownload.com www.freereelsdownload.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeouts for long-running downloads
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # Increase client body size for large files
    client_max_body_size 100M;
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/reelsaudio /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 13: Setup SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d freereelsdownload.com -d www.freereelsdownload.com

# Certbot will automatically configure Nginx for HTTPS
# Certificates auto-renew every 90 days
```

### Step 14: Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

---

## 🔍 Verification Checklist

### Test Each Component:

```bash
# 1. Check Node.js
node --version

# 2. Check yt-dlp
yt-dlp --version

# 3. Check FFmpeg
ffmpeg -version

# 4. Check PM2
pm2 status

# 5. Check Nginx
sudo systemctl status nginx

# 6. Test your app locally
curl http://localhost:3000

# 7. Test from browser
# Visit: http://your-domain.com or http://your-vps-ip
```

---

## 🚀 Common Commands

### PM2 Commands:
```bash
pm2 status                    # Check app status
pm2 logs freereelsdownload    # View logs
pm2 restart freereelsdownload # Restart app
pm2 stop freereelsdownload    # Stop app
pm2 delete freereelsdownload  # Remove from PM2
```

### Update Your App:
```bash
cd /var/www/freereelsdownload
git pull origin main
npm install
npm run build
pm2 restart freereelsdownload
```

### View Logs:
```bash
# PM2 logs
pm2 logs freereelsdownload

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

---

## ⚙️ Performance Optimization

### 1. Increase Node.js Memory (if needed):
```bash
# Edit PM2 ecosystem file
pm2 ecosystem

# Or set in PM2 start command:
pm2 start npm --name "freereelsdownload" -- start --max-old-space-size=2048
```

### 2. Optimize Nginx:
Add to your Nginx config:
```nginx
# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# Cache static files
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Monitor Resources:
```bash
# Check CPU and Memory usage
htop

# Check disk space
df -h

# Check PM2 memory usage
pm2 monit
```

---

## 🐛 Troubleshooting

### Issue: yt-dlp not found
```bash
# Check if yt-dlp is in PATH
which yt-dlp

# If not found, add to PATH or use full path
# Or reinstall:
pip3 install --upgrade yt-dlp
```

### Issue: Port 3000 already in use
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

### Issue: Nginx 502 Bad Gateway
```bash
# Check if Next.js app is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart freereelsdownload
sudo systemctl restart nginx
```

### Issue: Downloads timing out
- Increase Nginx timeouts (already in config above)
- Check server resources: `htop`
- Consider upgrading VPS plan if consistently slow

---

## 📊 Monitoring & Maintenance

### Setup Automatic Updates:
```bash
# Update yt-dlp weekly (add to crontab)
crontab -e

# Add this line (runs every Sunday at 2 AM):
0 2 * * 0 pip3 install --upgrade yt-dlp
```

### Backup Strategy:
```bash
# Backup your project
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/freereelsdownload

# Backup PM2 configuration
pm2 save
```

---

## 💰 Estimated Costs

- **VPS 1:** $4-5/month (minimum, might be slow)
- **VPS 2:** $7-8/month (recommended)
- **Domain:** $10-15/year (optional)
- **SSL:** Free (Let's Encrypt)
- **Total:** ~$7-10/month

---

## ✅ Final Checklist

- [ ] VPS purchased and accessible via SSH
- [ ] Node.js installed and verified
- [ ] Python 3 and yt-dlp installed
- [ ] FFmpeg installed
- [ ] Project cloned and dependencies installed
- [ ] Project built successfully (`npm run build`)
- [ ] PM2 running the app
- [ ] Nginx configured and running
- [ ] SSL certificate installed (if using domain)
- [ ] Firewall configured
- [ ] App accessible from browser
- [ ] Test download functionality (Instagram, Facebook, YouTube)
- [ ] Domain DNS configured (freereelsdownload.com → VPS IP)
- [ ] SSL certificate installed and working

---

## 🎯 Quick Start Script

Save this as `setup.sh` and run: `bash setup.sh`

```bash
#!/bin/bash
set -e

echo "🚀 Starting Hostinger VPS Setup..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python & yt-dlp
sudo apt install -y python3 python3-pip
pip3 install --upgrade yt-dlp

# Install FFmpeg
sudo apt install -y ffmpeg

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git

echo "✅ Setup complete! Now:"
echo "1. Clone your repository"
echo "2. Run: npm install"
echo "3. Run: npm run build"
echo "4. Run: pm2 start npm --name 'reelsaudio' -- start"
echo "5. Configure Nginx (see guide above)"
```

---

## 📞 Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs reelsaudio`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify all dependencies: `yt-dlp --version`, `ffmpeg -version`, `node --version`
4. Check Hostinger VPS documentation
5. Review Hostinger support tickets

---

**🎉 Your app should now be live on Hostinger!**

