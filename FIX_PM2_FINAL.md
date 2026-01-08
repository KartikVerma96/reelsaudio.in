# 🔧 Fix PM2 - Use Standalone Server (FINAL)

## ❌ Current Problem:
PM2 is running `npm start` which calls `next start`, but with `output: 'standalone'` you MUST use:
```bash
node .next/standalone/server.js
```

## ✅ Solution:

### Step 1: Check current PM2 status
```bash
pm2 status
pm2 describe freereelsdownload
```

### Step 2: Stop and delete the current process
```bash
pm2 stop freereelsdownload
pm2 delete freereelsdownload
```

### Step 3: Make sure you're in the right directory
```bash
cd /var/www/freereelsdownload
```

### Step 4: Pull latest code (with yt-dlp fix)
```bash
git pull origin main
```

### Step 5: Rebuild the app
```bash
npm run build
```

### Step 6: Start PM2 with the CORRECT command
```bash
pm2 start .next/standalone/server.js --name "freereelsdownload"
```

### Step 7: Verify it's correct
```bash
pm2 describe freereelsdownload
```

**Should show:** Script path: `.next/standalone/server.js` ✅

### Step 8: Check logs (should be clean)
```bash
pm2 logs freereelsdownload --lines 10
```

**Should show:** Only "Ready" messages, NO errors ✅

### Step 9: Save configuration
```bash
pm2 save
```

### Step 10: Test website
```bash
curl -I https://freereelsdownload.com
```

**Should return:** `HTTP/1.1 200 OK` ✅

---

## 🧪 Test Download:

1. Visit: https://freereelsdownload.com
2. Paste: `https://youtube.com/shorts/bAX57FevSQ0?si=0VnVI5zX7O5A7yGo`
3. Click Download MP3
4. Should work! ✅

---

## 🚫 Never Use Again:
```bash
pm2 start npm --name "freereelsdownload" -- start  # ❌ WRONG
```

## ✅ Always Use:
```bash
pm2 start .next/standalone/server.js --name "freereelsdownload"  # ✅ CORRECT
```

---

**Run these commands in order to fix everything!**

