# 🔧 Fix PM2 Startup - Use Standalone Server

## ❌ Problem:
Process 0 is running `npm start` (which calls `next start`), but with `output: 'standalone'` you MUST use:
```bash
node .next/standalone/server.js
```

## ✅ Solution:

### Step 1: Stop the current process
```bash
pm2 stop freereelsdownload
```

### Step 2: Delete it (to recreate with correct command)
```bash
pm2 delete freereelsdownload
```

### Step 3: Start with the CORRECT command
```bash
cd /var/www/freereelsdownload
pm2 start .next/standalone/server.js --name "freereelsdownload"
```

### Step 4: Verify it's running correctly
```bash
pm2 status
pm2 describe freereelsdownload
```

**Should show:** Script path: `.next/standalone/server.js` ✅

### Step 5: Check logs (should be clean)
```bash
pm2 logs freereelsdownload --lines 10
```

**Should show:** Only "Ready" messages, NO errors ✅

### Step 6: Save configuration
```bash
pm2 save
```

---

## ✅ Verify Everything Works:

```bash
curl -I https://freereelsdownload.com
```

Should return: `HTTP/1.1 200 OK`

---

## 🚫 Never Use:
```bash
pm2 start npm --name "freereelsdownload" -- start  # ❌ WRONG
```

## ✅ Always Use:
```bash
pm2 start .next/standalone/server.js --name "freereelsdownload"  # ✅ CORRECT
```

---

**Run these commands to fix it!**

