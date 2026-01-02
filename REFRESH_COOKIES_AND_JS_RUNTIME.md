# 🔧 Refresh Cookies & Enable JS Runtime

## ❌ Problems Found:
1. **Cookies expired:** "The provided YouTube account cookies are no longer valid"
2. **No JS runtime:** yt-dlp can't find JavaScript runtime (Node.js is installed but not detected)

## ✅ Solution:

### Step 1: Enable Node.js as JS runtime for yt-dlp
```bash
# Check Node.js path
which node

# Create yt-dlp config directory
mkdir -p ~/.config/yt-dlp

# Create config file to use Node.js
cat > ~/.config/yt-dlp/config << EOF
--js-runtimes node:/usr/bin/node
EOF

# Test if it works
yt-dlp --version
```

### Step 2: Refresh cookies from browser

#### Option A: Using browser extension (recommended)
1. Install "Get cookies.txt LOCALLY" extension:
   - Chrome: https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc
   - Firefox: https://addons.mozilla.org/en-US/firefox/addon/get-cookies-txt-locally/
2. Visit YouTube and **log in**
3. Click extension → Export cookies
4. Save as `cookies.txt`
5. Upload to server: `/var/www/freereelsdownload/cookies.txt`

#### Option B: Using yt-dlp (if you have browser access)
On a machine with browser access:
```bash
yt-dlp --cookies-from-browser chrome "https://youtube.com"
# This creates cookies.txt
# Then upload to server
```

### Step 3: Upload fresh cookies to server
```bash
# On your local machine
scp cookies.txt root@your-server-ip:/var/www/freereelsdownload/

# Or use SFTP/FTP client
```

### Step 4: Set proper permissions
```bash
cd /var/www/freereelsdownload
chmod 600 cookies.txt
ls -la cookies.txt
```

### Step 5: Test with fresh cookies and JS runtime
```bash
yt-dlp --cookies cookies.txt -g -f "best[height<=720]/best" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1 | tail -5
```

**Should work now!** ✅

### Step 6: Restart PM2 (to pick up config)
```bash
pm2 restart freereelsdownload
```

---

## 🔍 Verify JS Runtime is Working:

```bash
yt-dlp --verbose --cookies cookies.txt --list-formats "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1 | grep -i "js\|runtime\|node"
```

**Should show:** Node.js being used ✅

---

## 📝 Important Notes:

1. **Cookies expire:** Refresh every 1-2 weeks
2. **JS Runtime:** Once configured, yt-dlp will use Node.js automatically
3. **Security:** Keep cookies.txt secure (chmod 600)

---

**Run Step 1-6 to fix both issues!**

