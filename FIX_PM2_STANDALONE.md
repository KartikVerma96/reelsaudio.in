# 🔧 Fix PM2 Standalone Warning

## ⚠️ Warning:
```
⚠ "next start" does not work with "output: standalone" configuration. 
Use "node .next/standalone/server.js" instead.
```

## ✅ Solution: Update PM2 to use standalone server

Your `next.config.js` has `output: 'standalone'` which creates an optimized standalone server. We need to update PM2 to use it.

### Step 1: Stop current PM2 process
```bash
pm2 stop freereelsdownload
pm2 delete freereelsdownload
```

### Step 2: Start with standalone server
```bash
cd /var/www/freereelsdownload
pm2 start node --name "freereelsdownload" -- .next/standalone/server.js
pm2 save
```

### Step 3: Verify it's working
```bash
pm2 status
pm2 logs freereelsdownload
```

**Should show:** No warnings, app running smoothly

### Step 4: Test
```bash
curl http://localhost:3000
```

---

## ✅ Alternative: Remove standalone mode (if you prefer)

If you want to keep using `next start`, you can remove standalone mode:

### Edit next.config.js:
```bash
cd /var/www/freereelsdownload
nano next.config.js
```

**Find and comment out or remove:**
```javascript
// output: 'standalone',
```

**Then rebuild:**
```bash
npm run build
pm2 restart freereelsdownload
```

---

## 💡 Recommendation:

**Use the standalone server** (first option) - it's more optimized for production and uses less memory!

