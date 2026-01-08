# 🔍 Debug Static Files Issue

## Step-by-Step Debugging:

### Step 1: Check if Next.js server is running correctly
```bash
pm2 status
pm2 logs freereelsdownload --lines 50
```

### Step 2: Test Next.js server directly (bypass Nginx)
```bash
curl -I http://localhost:3000
curl -I http://localhost:3000/_next/static/chunks/a75a1885e75eeedb.css
```

**If this fails:** The Next.js server isn't serving files correctly

### Step 3: Check if standalone build exists
```bash
cd /var/www/freereelsdownload
ls -la .next/standalone/
ls -la .next/static/
```

**Should show:** Files exist in both directories

### Step 4: Check Nginx config
```bash
sudo cat /etc/nginx/sites-enabled/freereelsdownload
```

**Should show:** `proxy_pass http://localhost:3000;` in location /

### Step 5: Check Nginx error logs
```bash
sudo tail -50 /var/log/nginx/freereelsdownload_error.log
```

### Step 6: Test Nginx proxy
```bash
curl -I https://freereelsdownload.com/_next/static/chunks/a75a1885e75eeedb.css
```

**Check:** Does it return 404 or wrong content-type?

### Step 7: Rebuild completely
```bash
cd /var/www/freereelsdownload
rm -rf .next
npm run build
pm2 restart freereelsdownload
```

### Step 8: Check if Turbopack is being used (shouldn't be in production)
```bash
grep -r "turbopack" .next/standalone/ || echo "No turbopack found (good!)"
```

**If Turbopack found:** Build is corrupted, need clean rebuild

---

## 🔧 Quick Fix - Complete Rebuild:

```bash
cd /var/www/freereelsdownload

# Stop PM2
pm2 stop freereelsdownload

# Clean everything
rm -rf .next
rm -rf node_modules/.cache

# Rebuild
npm run build

# Verify standalone exists
ls -la .next/standalone/server.js

# Start PM2
pm2 start .next/standalone/server.js --name "freereelsdownload"

# Check logs
pm2 logs freereelsdownload --lines 20
```

---

**Run these steps and share the output!**

