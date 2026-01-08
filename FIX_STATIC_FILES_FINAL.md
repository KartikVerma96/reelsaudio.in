# 🔧 Fix Static Files - Final Solution

## ❌ Problem:
- CSS file `a75a1885e75eeedb.css` doesn't exist (404)
- HTML is referencing old file names from previous build
- This is a build cache mismatch issue

## ✅ Solution:

### Step 1: Stop PM2
```bash
pm2 stop freereelsdownload
```

### Step 2: Complete clean rebuild
```bash
cd /var/www/freereelsdownload

# Remove all build artifacts
rm -rf .next
rm -rf node_modules/.cache
rm -rf .next/cache

# Clean npm cache
npm cache clean --force

# Rebuild from scratch
npm run build
```

### Step 3: Verify the CSS file exists
```bash
ls -la .next/static/chunks/*.css
```

**Should show:** CSS files with current hash names

### Step 4: Check what CSS files actually exist
```bash
find .next/static -name "*.css" -type f
```

### Step 5: Start PM2 with standalone server
```bash
pm2 start .next/standalone/server.js --name "freereelsdownload"
pm2 save
```

### Step 6: Test the actual CSS file that exists
```bash
# First, find what CSS files exist
CSS_FILE=$(find .next/static -name "*.css" -type f | head -1 | xargs basename)
echo "Testing: $CSS_FILE"
curl -I http://localhost:3000/_next/static/chunks/$CSS_FILE
```

**Should return:** `HTTP/1.1 200 OK` with `Content-Type: text/css`

### Step 7: Check if standalone server can access static files
```bash
# Test if standalone server can serve static files
curl -I http://localhost:3000/
```

**Check:** Does it return HTML? Does HTML reference correct file names?

### Step 8: If still 404, check standalone server configuration
```bash
# Check if standalone server has access to static files
ls -la .next/standalone/.next/static/ 2>/dev/null || echo "Static files not in standalone"
```

**If not found:** Standalone build might be incomplete

### Step 9: Rebuild with explicit standalone
```bash
cd /var/www/freereelsdownload
rm -rf .next
NODE_ENV=production npm run build
```

### Step 10: Verify standalone structure
```bash
ls -la .next/standalone/
ls -la .next/standalone/.next/static/ 2>/dev/null || ls -la .next/static/
```

---

## 🔍 Alternative: Check if it's a Next.js standalone issue

With `output: 'standalone'`, Next.js should copy static files. If not, we might need to:

1. Check `next.config.js` - ensure `output: 'standalone'` is set
2. Verify the build output includes static files
3. Check if we need to serve static files differently

---

## 🚀 Quick Test:

```bash
# Test homepage
curl http://localhost:3000/ | grep -o '_next/static/chunks/[^"]*\.css' | head -1

# Then test that file
curl -I http://localhost:3000/_next/static/chunks/[FILE_FROM_ABOVE]
```

---

**Run Step 1-6 first, then share the output of Step 6!**

