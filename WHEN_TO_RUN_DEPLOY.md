# ⏰ When to Run deploy.sh

## 🎯 **Answer: Run it ONCE at the very beginning, right after connecting to your VPS**

---

## 📋 Complete Deployment Timeline

### **Step 1: Connect to VPS** ✅
```bash
ssh root@YOUR_VPS_IP
```
**When:** First thing you do

---

### **Step 2: Run deploy.sh** ⭐ **THIS IS WHERE YOU RUN IT**
```bash
# Option A: Download and run from GitHub
cd /tmp
wget https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/deploy.sh
chmod +x deploy.sh
sudo ./deploy.sh

# Option B: Copy script to VPS manually
# Upload deploy.sh to your VPS, then:
chmod +x deploy.sh
sudo ./deploy.sh
```

**When:** Right after connecting to VPS (Step 1)
**What it does:** Installs all system dependencies:
- Updates system
- Installs Node.js 20.x
- Installs Python & yt-dlp
- Installs FFmpeg
- Installs PM2
- Installs Nginx
- Installs Certbot

**Time:** Takes 5-10 minutes

---

### **Step 3: Clone Your Repository**
```bash
cd /var/www
git clone YOUR_REPO_URL freereelsdownload
cd freereelsdownload
```
**When:** After deploy.sh completes successfully

---

### **Step 4: Create Environment File**
```bash
nano .env.production
# Add: NEXT_PUBLIC_SITE_URL=https://freereelsdownload.com
```
**When:** After cloning repository

---

### **Step 5: Install & Build**
```bash
npm install
npm run build
```
**When:** After creating .env.production

---

### **Step 6: Start with PM2**
```bash
pm2 start npm --name "freereelsdownload" -- start
pm2 save
pm2 startup
```
**When:** After build completes

---

### **Step 7: Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/freereelsdownload
# (Paste Nginx config)
```
**When:** After PM2 is running

---

### **Step 8: Setup SSL**
```bash
sudo certbot --nginx -d freereelsdownload.com -d www.freereelsdownload.com
```
**When:** After Nginx is configured

---

## ✅ Quick Answer

**Run `deploy.sh` ONCE:**
- ✅ Right after connecting to VPS for the first time
- ✅ Before cloning your repository
- ✅ Before building your project
- ✅ At the very beginning of deployment

**Don't run it:**
- ❌ After you've already installed dependencies manually
- ❌ Every time you update your code
- ❌ Multiple times (it will reinstall everything)

---

## 🔄 What If You Already Installed Dependencies?

If you've already installed Node.js, Python, yt-dlp, etc. manually, you can **skip** `deploy.sh` and go directly to **Step 3** (Clone Repository).

---

## 📊 Visual Timeline

```
1. Connect to VPS
   ↓
2. Run deploy.sh ⭐ (ONCE - installs all dependencies)
   ↓
3. Clone repository
   ↓
4. Create .env.production
   ↓
5. npm install && npm run build
   ↓
6. Start PM2
   ↓
7. Configure Nginx
   ↓
8. Setup SSL
   ↓
9. ✅ Done! Site is live
```

---

## 🚨 Common Mistake

**WRONG:**
```bash
# Don't do this - running deploy.sh multiple times
git pull
npm run build
./deploy.sh  # ❌ Don't run again!
pm2 restart
```

**CORRECT:**
```bash
# After initial deployment, just update code:
git pull
npm install
npm run build
pm2 restart freereelsdownload  # ✅ Just restart PM2
```

---

## 💡 Summary

**deploy.sh = Initial Setup Script**
- Run it **ONCE** at the beginning
- Installs all system dependencies
- After that, you only need to update your code and restart PM2

**Think of it like:** Installing Windows on a new computer - you do it once, then you just use the computer!

