# 🚀 Complete Deployment Guide for freereelsdownload.com

## ✅ What You Have:
- **Domain:** freereelsdownload.com (1 year)
- **VPS:** Hostinger KVM 2 (Ubuntu 24.04 LTS)
- **Project:** ReelsAudio - Multi-platform downloader

---

## 📋 Pre-Deployment Checklist

- [ ] Domain purchased: freereelsdownload.com ✅
- [ ] VPS purchased: Hostinger KVM 2 ✅
- [ ] SSH access to VPS
- [ ] GitHub repository ready
- [ ] Domain DNS access

---

## 🔧 Step 1: Connect to Your VPS

### Get Your VPS IP Address:
1. Login to Hostinger hPanel
2. Go to **VPS** → **Your VPS**
3. Note your **IP Address** (e.g., 123.456.789.012)
4. Note your **Root Password** (or SSH key)

### Connect via SSH:

**Windows (PowerShell/CMD):**
```bash
ssh root@YOUR_VPS_IP
# Enter your root password when prompted
```

**Mac/Linux:**
```bash
ssh root@YOUR_VPS_IP
# Enter your root password when prompted
```

**First time connection?** Type `yes` when asked about host authenticity.

---

## 📦 Step 2: Run deploy.sh (Quick Setup) ⭐

**You have two options:**

### Option A: Use deploy.sh Script (Recommended - Faster)
```bash
# Download the script (if you uploaded it to your repo)
cd /tmp
wget https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/deploy.sh
chmod +x deploy.sh
sudo ./deploy.sh

# OR if you copied it manually to VPS:
chmod +x deploy.sh
sudo ./deploy.sh
```

**This will automatically install:**
- System updates
- Node.js 20.x
- Python & yt-dlp
- FFmpeg
- PM2
- Nginx
- Certbot

**Time:** 5-10 minutes

**After deploy.sh completes, skip to Step 8 (Clone Repository)**

---

### Option B: Manual Installation (If you prefer step-by-step)

### Update System (Ubuntu 24.04 LTS):
```bash
sudo apt update
sudo apt upgrade -y
```

### Install Essential Tools:
```bash
sudo apt install -y curl wget git build-essential
```

---

## 🟢 Step 3: Install Node.js 20.x (Manual - Skip if you used deploy.sh)

```bash
# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version    # Should show 10.x.x
```

---

## 🐍 Step 4: Install Python & yt-dlp (Manual - Skip if you used deploy.sh)

```bash
# Install Python 3 and pip
sudo apt install -y python3 python3-pip python3-venv

# Install yt-dlp
pip3 install --upgrade yt-dlp

# Verify installation
yt-dlp --version
# Should show: 2025.x.x or similar
```

---

## 🎬 Step 5: Install FFmpeg (Manual - Skip if you used deploy.sh)

```bash
# Install FFmpeg
sudo apt install -y ffmpeg

# Verify installation
ffmpeg -version
# Should show version info
```

---

## ⚙️ Step 6: Install PM2 (Manual - Skip if you used deploy.sh)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command it outputs (usually starts with: sudo env PATH=...)
```

---

## 🌐 Step 7: Install Nginx (Manual - Skip if you used deploy.sh)

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

---

## 📥 Step 8: Clone Your Project (Continue here after deploy.sh OR after Step 7)

```bash
# Navigate to web directory
cd /var/www

# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git freereelsdownload
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual GitHub details

cd freereelsdownload

# Install project dependencies
npm install
```

**If your repo is private:**
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add this key to GitHub: Settings → SSH and GPG keys → New SSH key
```

---

## 🔐 Step 9: Configure Environment Variables

```bash
# Create .env.production file
nano .env.production
```

**Add this content:**
```env
NEXT_PUBLIC_SITE_URL=https://freereelsdownload.com
NODE_ENV=production
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

---

## 🏗️ Step 10: Build the Project

```bash
# Build for production
npm run build

# This will take 2-5 minutes
# Wait for: "✓ Compiled successfully"
```

---

## 🚀 Step 11: Start with PM2

```bash
# Start the Next.js app with PM2
pm2 start npm --name "freereelsdownload" -- start

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs freereelsdownload
```

**Expected output:** App should be running on port 3000

---

## 🌍 Step 12: Configure Domain DNS

### In Hostinger Domain Panel:

1. Login to Hostinger hPanel
2. Go to **Domains** → **freereelsdownload.com**
3. Click **DNS / Name Servers**
4. Add/Edit these **A Records**:

```
Type: A
Name: @
Value: YOUR_VPS_IP_ADDRESS
TTL: 3600

Type: A
Name: www
Value: YOUR_VPS_IP_ADDRESS
TTL: 3600
```

5. **Save** and wait 5-30 minutes for DNS propagation

**Check DNS propagation:**
```bash
# From your local computer
nslookup freereelsdownload.com
# Should show your VPS IP
```

---

## 🔒 Step 13: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/freereelsdownload
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name freereelsdownload.com www.freereelsdownload.com;

    # Increase client body size for large downloads
    client_max_body_size 100M;

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

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:3000;
    }
}
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

**Enable the site:**
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/freereelsdownload /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔐 Step 14: Setup SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d freereelsdownload.com -d www.freereelsdownload.com

# Follow the prompts:
# - Enter your email address
# - Agree to terms (Y)
# - Share email with EFF? (N or Y, your choice)
# - Certbot will automatically configure Nginx
```

**Auto-renewal is already set up!** Certificates renew automatically every 90 days.

---

## 🔥 Step 15: Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

---

## ✅ Step 16: Verify Everything Works

### Test Locally on Server:
```bash
# Test if app is running
curl http://localhost:3000
# Should return HTML content
```

### Test from Browser:
1. Open: `http://freereelsdownload.com` (should redirect to HTTPS)
2. Open: `https://freereelsdownload.com`
3. Test download functionality:
   - Try Instagram Reel
   - Try YouTube Short
   - Try Facebook Reel

---

## 🔍 Troubleshooting

### Issue: Domain not resolving
```bash
# Check DNS propagation
dig freereelsdownload.com
# Or
nslookup freereelsdownload.com

# Wait up to 24 hours for DNS propagation
```

### Issue: 502 Bad Gateway
```bash
# Check if app is running
pm2 status

# Check logs
pm2 logs freereelsdownload

# Restart app
pm2 restart freereelsdownload

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Issue: yt-dlp not found
```bash
# Check if installed
which yt-dlp

# Reinstall if needed
pip3 install --upgrade yt-dlp

# Check PATH
echo $PATH
```

### Issue: Port 3000 already in use
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

---

## 📊 Monitoring Commands

```bash
# Check app status
pm2 status

# View logs
pm2 logs freereelsdownload

# Monitor resources
pm2 monit

# Check Nginx status
sudo systemctl status nginx

# Check system resources
htop
# Or
free -h
df -h
```

---

## 🔄 Updating Your App

```bash
# Navigate to project directory
cd /var/www/freereelsdownload

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Rebuild
npm run build

# Restart app
pm2 restart freereelsdownload

# Check logs
pm2 logs freereelsdownload
```

---

## 📝 Post-Deployment Checklist

- [ ] Domain DNS configured
- [ ] SSL certificate installed
- [ ] App running on PM2
- [ ] Nginx configured and running
- [ ] Firewall configured
- [ ] Website accessible via HTTPS
- [ ] Test Instagram download
- [ ] Test YouTube download
- [ ] Test Facebook download
- [ ] All features working

---

## 🎯 Next Steps After Deployment

1. **Submit to Google Search Console:**
   - Go to: https://search.google.com/search-console
   - Add property: `https://freereelsdownload.com`
   - Verify ownership
   - Submit sitemap: `https://freereelsdownload.com/sitemap.xml`

2. **Submit to Bing Webmaster Tools:**
   - Go to: https://www.bing.com/webmasters
   - Add site and submit sitemap

3. **Setup Google Analytics** (optional):
   - Create GA4 property
   - Add tracking code to your app

4. **Setup Google AdSense** (when ready):
   - Apply for AdSense
   - Add publisher ID to your app

---

## 💡 Pro Tips

1. **Enable Auto-Updates for yt-dlp:**
   ```bash
   crontab -e
   # Add this line (updates every Sunday at 2 AM):
   0 2 * * 0 pip3 install --upgrade yt-dlp
   ```

2. **Setup Backups:**
   ```bash
   # Backup script (run daily)
   tar -czf /root/backups/freereelsdownload-$(date +%Y%m%d).tar.gz /var/www/freereelsdownload
   ```

3. **Monitor Disk Space:**
   ```bash
   # Check disk usage
   df -h
   # Clean old logs if needed
   pm2 flush
   ```

---

## 🎉 Congratulations!

Your website **freereelsdownload.com** should now be live! 🚀

**Your site URL:** https://freereelsdownload.com

---

## 📞 Need Help?

If you encounter any issues:
1. Check PM2 logs: `pm2 logs freereelsdownload`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify all services: `pm2 status && sudo systemctl status nginx`
4. Check Hostinger VPS documentation
5. Review error messages carefully

**Good luck with your deployment! 🎊**

