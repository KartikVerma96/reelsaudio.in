# 🔧 Fix Nginx Syntax Error & Static Files 404

## ❌ Problems:
1. Nginx config has syntax error: `unknown directive "0"` on line 45
2. CSS file returns 404 through Nginx but exists locally

## ✅ Solution:

### Step 1: Fix Nginx syntax error first
```bash
sudo nano /etc/nginx/sites-enabled/freereelsdownload
```

**Check line 45** - there's likely a stray "0" or incorrect syntax. The file should look like:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name freereelsdownload.com www.freereelsdownload.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name freereelsdownload.com www.freereelsdownload.com;

    ssl_certificate /etc/letsencrypt/live/freereelsdownload.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/freereelsdownload.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    proxy_connect_timeout 600;
    proxy_send_timeout 600;
    proxy_read_timeout 600;
    send_timeout 600;

    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
    }

    access_log /var/log/nginx/freereelsdownload_access.log;
    error_log /var/log/nginx/freereelsdownload_error.log;
}
```

### Step 2: Test Nginx config
```bash
sudo nginx -t
```

**Should show:** `syntax is ok` and `test is successful`

### Step 3: Check if standalone server can serve static files
```bash
curl -I http://localhost:3000/_next/static/chunks/a75a1885e75eeedb.css
```

**If 404:** The standalone server isn't serving static files correctly

### Step 4: Check standalone build structure
```bash
ls -la .next/standalone/.next/static/chunks/a75a1885e75eeedb.css 2>/dev/null || echo "File not in standalone directory"
ls -la .next/static/chunks/a75a1885e75eeedb.css
```

**If file not in standalone:** Next.js standalone build might not have copied static files

### Step 5: Check if Next.js standalone needs static files symlinked
With `output: 'standalone'`, Next.js should copy static files, but sometimes they need to be accessible. Check:

```bash
# Check what's in standalone directory
ls -la .next/standalone/

# Check if .next directory exists in standalone
ls -la .next/standalone/.next/ 2>/dev/null || echo "No .next in standalone"
```

### Step 6: If static files missing from standalone, copy them
```bash
# Copy static files to standalone (if missing)
cp -r .next/static .next/standalone/.next/ 2>/dev/null || echo "Already exists or can't copy"
```

### Step 7: Reload Nginx
```bash
sudo systemctl reload nginx
```

### Step 8: Test CSS file
```bash
curl -I https://freereelsdownload.com/_next/static/chunks/a75a1885e75eeedb.css
```

**Should return:** `200 OK` with `Content-Type: text/css`

---

## 🔍 If Still 404:

The standalone server might need the static files in a specific location. Check Next.js documentation or try:

```bash
# Check Next.js standalone server.js to see how it serves static files
grep -r "static" .next/standalone/server.js | head -5
```

---

**Run Step 1-8 to fix both issues!**

