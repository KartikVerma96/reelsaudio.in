# ⚡ Quick Deployment Guide - freereelsdownload.com

## 🎯 Your Setup:
- **Domain:** freereelsdownload.com ✅
- **VPS:** Hostinger KVM 2 (Ubuntu 24.04 LTS) ✅
- **Ready to deploy!**

---

## 🚀 Quick Start (Copy-Paste Commands)

### 1. Connect to VPS
```bash
ssh root@YOUR_VPS_IP
```

### 2. Run Quick Setup Script
```bash
cd /var/www
wget https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/deploy.sh
chmod +x deploy.sh
sudo ./deploy.sh
```

**OR** Install manually (see DEPLOYMENT_STEPS.md for detailed guide)

### 3. Clone Your Repository
```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git freereelsdownload
cd freereelsdownload
```

### 4. Create Environment File
```bash
nano .env.production
```
**Add:**
```env
NEXT_PUBLIC_SITE_URL=https://freereelsdownload.com
NODE_ENV=production
```
**Save:** `Ctrl+X`, `Y`, `Enter`

### 5. Install & Build
```bash
npm install
npm run build
```

### 6. Start with PM2
```bash
pm2 start npm --name "freereelsdownload" -- start
pm2 save
pm2 startup  # Copy and run the command it outputs
```

### 7. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/freereelsdownload
```

**Paste:**
```nginx
server {
    listen 80;
    server_name freereelsdownload.com www.freereelsdownload.com;
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
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
```

**Enable:**
```bash
sudo ln -s /etc/nginx/sites-available/freereelsdownload /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 8. Setup SSL
```bash
sudo certbot --nginx -d freereelsdownload.com -d www.freereelsdownload.com
```

### 9. Configure Firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 10. Configure Domain DNS
**In Hostinger hPanel:**
- Go to **Domains** → **freereelsdownload.com** → **DNS**
- Add A Record: `@` → `YOUR_VPS_IP`
- Add A Record: `www` → `YOUR_VPS_IP`
- Wait 5-30 minutes for propagation

---

## ✅ Verify Deployment

```bash
# Check app
pm2 status
pm2 logs freereelsdownload

# Check Nginx
sudo systemctl status nginx

# Test locally
curl http://localhost:3000
```

**Visit:** https://freereelsdownload.com

---

## 🔄 Update Your App

```bash
cd /var/www/freereelsdownload
git pull origin main
npm install
npm run build
pm2 restart freereelsdownload
```

---

## 📞 Troubleshooting

**502 Bad Gateway?**
```bash
pm2 restart freereelsdownload
sudo systemctl restart nginx
```

**Domain not working?**
- Check DNS: `nslookup freereelsdownload.com`
- Wait up to 24 hours for DNS propagation

**yt-dlp not found?**
```bash
pip3 install --upgrade yt-dlp
```

---

**🎉 Done! Your site is live at https://freereelsdownload.com**

