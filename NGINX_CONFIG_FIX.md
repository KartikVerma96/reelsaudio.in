# 🔧 Fix Nginx Configuration Error

## ❌ Error:
```
unknown directive "nginx" in /etc/nginx/sites-enabled/freereelsdownload:2
```

## ✅ Solution: Check and Fix the Configuration File

### Step 1: View the current file
```bash
cat /etc/nginx/sites-available/freereelsdownload
```

### Step 2: Edit the file with correct configuration
```bash
sudo nano /etc/nginx/sites-available/freereelsdownload
```

### Step 3: Replace with this CORRECT configuration:

**Delete everything** and paste this:

```nginx
server {
    listen 80;
    server_name freereelsdownload.com www.freereelsdownload.com;

    # Increase client body size for large downloads
    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeouts for long-running downloads
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:3000;
    }
}
```

**Save:** `Ctrl+X`, then `Y`, then `Enter`

### Step 4: Test the configuration
```bash
sudo nginx -t
```

**Should show:**
```
nginx: the configuration file /etc/nginx/nginx.conf test is successful
```

### Step 5: Reload Nginx
```bash
sudo systemctl reload nginx
```

---

## 🚨 Common Mistakes:

1. **Don't include** `nginx` as a directive
2. **Don't include** comments like `# nginx config` at the top (sometimes causes issues)
3. **Make sure** there are no extra characters or typos
4. **Ensure** proper indentation (spaces or tabs, but be consistent)

---

## ✅ Quick Fix Command (if you want to recreate the file):

```bash
# Remove the broken file
sudo rm /etc/nginx/sites-available/freereelsdownload
sudo rm /etc/nginx/sites-enabled/freereelsdownload

# Create new file with correct config
sudo nano /etc/nginx/sites-available/freereelsdownload
```

Then paste the configuration above and save.

