# 🔧 Fix Nginx Syntax Error & Static Files 404

## Issue 1: Nginx Syntax Error
Line 45 has: `proxy_cache_bypass $http_upgrade;0` - remove the `0`

## Issue 2: CSS File 404
Standalone server can't find static files. Need to check standalone build structure.

## ✅ Fix Steps:

### Step 1: Fix Nginx syntax error
```bash
sudo nano /etc/nginx/sites-enabled/freereelsdownload
```

**Find line 45** and change:
```nginx
proxy_cache_bypass $http_upgrade;0
```

**To:**
```nginx
proxy_cache_bypass $http_upgrade;
```

**Remove the `0` at the end!**

### Step 2: Test Nginx config
```bash
sudo nginx -t
```

**Should show:** `syntax is ok` ✅

### Step 3: Check standalone build structure
```bash
ls -la .next/standalone/.next/static/chunks/a75a1885e75eeedb.css 2>/dev/null || echo "File NOT in standalone"
ls -la .next/standalone/.next/ 2>/dev/null || echo ".next directory NOT in standalone"
```

### Step 4: Check what's actually in standalone
```bash
ls -la .next/standalone/
```

**Should show:** `server.js` and possibly `.next` directory

### Step 5: If static files missing, copy them
```bash
# Create directory structure
mkdir -p .next/standalone/.next/static/chunks

# Copy static files
cp -r .next/static/* .next/standalone/.next/static/

# Verify
ls -la .next/standalone/.next/static/chunks/a75a1885e75eeedb.css
```

**Should show:** File exists ✅

### Step 6: Restart PM2 (to pick up new files)
```bash
pm2 restart freereelsdownload
```

### Step 7: Test CSS file on localhost
```bash
curl -I http://localhost:3000/_next/static/chunks/a75a1885e75eeedb.css
```

**Should return:** `200 OK` ✅

### Step 8: Reload Nginx
```bash
sudo systemctl reload nginx
```

### Step 9: Test CSS file via HTTPS
```bash
curl -I https://freereelsdownload.com/_next/static/chunks/a75a1885e75eeedb.css
```

**Should return:** `200 OK` ✅

---

## 🔍 If Still 404 After Copying:

The standalone server might be looking in a different location. Check:

```bash
# Check server.js to see how it resolves paths
grep -r "static" .next/standalone/server.js | head -3

# Or check the actual working directory
pm2 describe freereelsdownload | grep "exec cwd"
```

With `output: 'standalone'`, Next.js should automatically copy static files, but sometimes they need to be in the right place relative to `server.js`.

---

**Run Step 1-9 to fix both issues!**

