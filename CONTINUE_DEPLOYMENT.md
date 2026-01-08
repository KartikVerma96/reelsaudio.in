# ✅ Continue Deployment - Next Steps

## ✅ What's Done:
- ✅ pipx installed
- ✅ yt-dlp installed (version 2025.12.8)

## 🔧 Next Steps:

### Step 1: Add yt-dlp to PATH
```bash
pipx ensurepath
```

### Step 2: Reload shell or verify
```bash
# Reload shell configuration
source ~/.bashrc

# OR just verify yt-dlp works
yt-dlp --version
```

### Step 3: Continue with remaining installations
```bash
# Install FFmpeg
apt install -y ffmpeg

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install Certbot
apt install -y certbot python3-certbot-nginx
```

### Step 4: Verify all installations
```bash
# Check Node.js
node --version

# Check yt-dlp
yt-dlp --version

# Check FFmpeg
ffmpeg -version

# Check PM2
pm2 --version

# Check Nginx
nginx -v
```

### Step 5: Setup PM2 to start on boot
```bash
pm2 startup
# Copy and run the command it outputs
```

---

## 🎯 After All Dependencies Are Installed:

1. **Clone your repository:**
   ```bash
   cd /var/www
   git clone https://github.com/KartikVerma96/reelsaudio.in.git freereelsdownload
   cd freereelsdownload
   ```

2. **Create .env.production:**
   ```bash
   nano .env.production
   ```
   Add:
   ```env
   NEXT_PUBLIC_SITE_URL=https://freereelsdownload.com
   NODE_ENV=production
   ```
   Save: `Ctrl+X`, `Y`, `Enter`

3. **Install dependencies and build:**
   ```bash
   npm install
   npm run build
   ```

4. **Start with PM2:**
   ```bash
   pm2 start npm --name "freereelsdownload" -- start
   pm2 save
   ```

5. **Configure Nginx** (see DEPLOYMENT_STEPS.md)

6. **Setup SSL:**
   ```bash
   sudo certbot --nginx -d freereelsdownload.com -d www.freereelsdownload.com
   ```

---

**You're making great progress! 🚀**

