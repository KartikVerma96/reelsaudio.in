# 🔧 Fix: yt-dlp Installation Error on Ubuntu 24.04

## ❌ Error You're Seeing:
```
error: externally-managed-environment
× This environment is externally managed
```

## ✅ Quick Fix (Run This Now):

Since you're already connected to your VPS, run these commands:

```bash
# Install pipx (tool for installing Python apps)
apt install -y pipx python3-full

# Install yt-dlp using pipx
pipx install yt-dlp

# Make yt-dlp available system-wide
pipx ensurepath

# Verify installation
yt-dlp --version
```

**Then continue with the rest of deploy.sh steps manually:**

```bash
# Step 4: Install FFmpeg
apt install -y ffmpeg

# Step 5: Install PM2
npm install -g pm2

# Step 6: Install Nginx
apt install -y nginx

# Step 7: Install Certbot
apt install -y certbot python3-certbot-nginx
```

---

## 📝 What Happened?

Ubuntu 24.04 has **PEP 668** protection that prevents installing Python packages system-wide using `pip3 install`. This is a security feature.

**Solution:** Use `pipx` instead, which is designed for installing Python applications system-wide.

---

## ✅ After Running the Fix:

Your deploy.sh script stopped at Step 3. After running the fix above, you can:

1. **Continue manually** with the commands above, OR
2. **Skip the rest of deploy.sh** and go directly to cloning your repository

The script has been updated for future use, but since you're already running it, just use the manual fix above.

---

## 🎯 Next Steps After Fix:

Once yt-dlp is installed, continue with:
1. Clone repository
2. Create .env.production
3. Build project
4. Start PM2
5. Configure Nginx
6. Setup SSL

See `DEPLOYMENT_STEPS.md` for detailed instructions.

