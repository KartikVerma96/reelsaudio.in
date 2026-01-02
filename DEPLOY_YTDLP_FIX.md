# 🚀 Deploy yt-dlp Path Fix

## ✅ What Was Fixed:
The API routes now automatically find `yt-dlp` in common locations including `/root/.local/bin/yt-dlp` (pipx default).

## 📋 Deployment Steps:

### Step 1: Pull latest code
```bash
cd /var/www/freereelsdownload
git pull origin main
```

### Step 2: Rebuild the app
```bash
npm run build
```

### Step 3: Restart PM2
```bash
pm2 restart freereelsdownload
```

### Step 4: Check logs
```bash
pm2 logs freereelsdownload --lines 20
```

**Should show:** Clean startup, no errors ✅

### Step 5: Test the fix
```bash
curl -X POST https://freereelsdownload.com/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/shorts/bAX57FevSQ0?si=0VnVI5zX7O5A7yGo", "format": "mp3"}'
```

**Should return:** JSON with `audioUrl` ✅

---

## 🧪 Manual Test on Server:

### Test yt-dlp directly:
```bash
yt-dlp --version
```

**Should show:** Version number (e.g., `2025.12.8`)

### Test with the YouTube Shorts URL:
```bash
yt-dlp -g --skip-download --no-playlist --no-warnings --quiet -f "bestaudio[ext=m4a]/bestaudio/best" "https://youtube.com/shorts/bAX57FevSQ0?si=0VnVI5zX7O5A7yGo"
```

**Should return:** A URL starting with `http`

---

## ✅ Verify Everything Works:

1. **Visit website:** https://freereelsdownload.com
2. **Paste URL:** `https://youtube.com/shorts/bAX57FevSQ0?si=0VnVI5zX7O5A7yGo`
3. **Click Download MP3**
4. **Should work!** ✅

---

## 🔍 If Still Not Working:

### Check PM2 environment:
```bash
pm2 env 0
```

**Look for:** `PATH` should include `/root/.local/bin`

### If PATH is missing, add it:
```bash
cd /var/www/freereelsdownload
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'freereelsdownload',
    script: '.next/standalone/server.js',
    cwd: '/var/www/freereelsdownload',
    env: {
      NODE_ENV: 'production',
      PATH: '/root/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
    }
  }]
}
EOF

pm2 delete freereelsdownload
pm2 start ecosystem.config.js
pm2 save
```

---

**Run the deployment steps above to apply the fix!**

