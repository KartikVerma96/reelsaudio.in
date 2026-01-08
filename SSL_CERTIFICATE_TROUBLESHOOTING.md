# 🔒 SSL Certificate Troubleshooting

## ❌ Error:
```
Certbot failed to authenticate some domains
Domain: freereelsdownload.com
Type: unauthorized
Detail: Invalid response from http://freereelsdownload.com/.well-known/acme-challenge/...
```

## 🔍 Possible Causes:

1. **DNS not pointing to your VPS** (most common)
2. **Nginx not running or misconfigured**
3. **App not running on port 3000**
4. **Firewall blocking port 80**
5. **Domain not accessible from internet**

---

## ✅ Step-by-Step Fix:

### Step 1: Check if your app is running
```bash
pm2 status
curl http://localhost:3000
```

**If not running:**
```bash
pm2 start npm --name "freereelsdownload" -- start
pm2 save
```

### Step 2: Check Nginx is running
```bash
sudo systemctl status nginx
```

**If not running:**
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 3: Check DNS Configuration

**On your local computer (Windows PowerShell):**
```powershell
nslookup freereelsdownload.com
```

**Should show your VPS IP:** `72.60.220.145`

**If it shows a different IP or doesn't resolve:**
- Go to Hostinger hPanel
- Domains → freereelsdownload.com → DNS
- Make sure you have:
  - A Record: `@` → `72.60.220.145`
  - A Record: `www` → `72.60.220.145`
- Wait 5-30 minutes for DNS propagation

### Step 4: Test domain accessibility

**From your VPS:**
```bash
curl -I http://freereelsdownload.com
```

**Should return:** `200 OK` or `301/302 redirect`

**If it fails:**
- DNS might not be configured
- Wait longer for DNS propagation (can take up to 24 hours)

### Step 5: Check firewall

```bash
sudo ufw status
```

**Make sure port 80 and 443 are open:**
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### Step 6: Verify Nginx configuration

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 7: Test ACME challenge manually

```bash
# Create test file
sudo mkdir -p /var/www/html/.well-known/acme-challenge
echo "test" | sudo tee /var/www/html/.well-known/acme-challenge/test

# Test access
curl http://freereelsdownload.com/.well-known/acme-challenge/test
```

**Should return:** `test`

---

## 🎯 Most Likely Issue: DNS Not Configured

### Check DNS in Hostinger:

1. Login to Hostinger hPanel
2. Go to **Domains** → **freereelsdownload.com**
3. Click **DNS / Name Servers**
4. Check if you have these records:

```
Type: A
Name: @
Value: 72.60.220.145
TTL: 3600

Type: A
Name: www
Value: 72.60.220.145
TTL: 3600
```

5. **If missing, add them**
6. **Wait 5-30 minutes** (sometimes up to 24 hours)

### Verify DNS from your computer:

**Windows:**
```powershell
nslookup freereelsdownload.com
```

**Should show:** `72.60.220.145`

---

## ✅ After DNS is Configured:

### Wait for DNS propagation, then retry:

```bash
# Test domain first
curl -I http://freereelsdownload.com

# If it works, retry certbot
sudo certbot --nginx -d freereelsdownload.com -d www.freereelsdownload.com
```

---

## 🔄 Alternative: Use Standalone Mode (if DNS is slow)

If DNS is taking too long, you can temporarily use standalone mode:

```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Run certbot in standalone mode
sudo certbot certonly --standalone -d freereelsdownload.com -d www.freereelsdownload.com

# Start Nginx again
sudo systemctl start nginx

# Then manually configure Nginx for SSL (more complex)
```

**But it's better to wait for DNS and use `--nginx` mode!**

---

## 📝 Quick Checklist:

- [ ] DNS configured in Hostinger (A records pointing to 72.60.220.145)
- [ ] DNS propagated (check with nslookup)
- [ ] App running on port 3000 (pm2 status)
- [ ] Nginx running (systemctl status nginx)
- [ ] Firewall allows port 80 (ufw status)
- [ ] Domain accessible (curl http://freereelsdownload.com)

**Once all checked, retry certbot!**

