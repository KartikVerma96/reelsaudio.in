# 🔧 Fix Nginx Static Files Issue

## ❌ Problem:
- Static files (_next/static) returning 404 or wrong MIME types
- Turbopack files being referenced (shouldn't be in production)
- CSS/JS files not loading

## ✅ Solution:
Nginx needs to proxy ALL requests to the Next.js standalone server. With `output: 'standalone'`, Next.js serves everything including static files.

## 📋 Fix Steps:

### Step 1: Backup current Nginx config
```bash
sudo cp /etc/nginx/sites-enabled/freereelsdownload /etc/nginx/sites-enabled/freereelsdownload.backup
```

### Step 2: Update Nginx configuration
```bash
sudo nano /etc/nginx/sites-enabled/freereelsdownload
```

**Replace entire file with:**
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

### Step 3: Test Nginx configuration
```bash
sudo nginx -t
```

**Should show:** `syntax is ok` and `test is successful` ✅

### Step 4: Reload Nginx
```bash
sudo systemctl reload nginx
```

### Step 5: Clear browser cache
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or clear browser cache completely

### Step 6: Test website
Visit: https://freereelsdownload.com

**Should work:** No console errors, CSS/JS loading correctly ✅

---

## 🔍 If Still Having Issues:

### Check Nginx error logs:
```bash
sudo tail -f /var/log/nginx/freereelsdownload_error.log
```

### Check if Next.js server is running:
```bash
pm2 status
curl http://localhost:3000
```

### Rebuild Next.js app:
```bash
cd /var/www/freereelsdownload
npm run build
pm2 restart freereelsdownload
```

---

**Run these steps to fix the static files issue!**

