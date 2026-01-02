# 🔧 YouTube Bot Detection - Cookie Solution

## ❌ Problem:
YouTube is blocking all yt-dlp player clients with bot detection.

## ✅ Solution: Use Cookies

### Step 1: Check yt-dlp version
```bash
yt-dlp --version
pipx upgrade yt-dlp
yt-dlp --version
```

**Make sure it's the latest version!**

### Step 2: Export cookies from browser

#### Option A: Using browser extension (easiest)
1. Install "Get cookies.txt LOCALLY" extension in Chrome/Firefox
2. Visit YouTube and log in
3. Click extension → Export cookies
4. Save as `cookies.txt`
5. Upload to server: `/var/www/freereelsdownload/cookies.txt`

#### Option B: Using yt-dlp (if you have browser access)
```bash
# On a machine with browser access
yt-dlp --cookies-from-browser chrome "https://youtube.com/shorts/8SSnvGk_EVw"
# This will create cookies.txt
```

### Step 3: Test with cookies
```bash
cd /var/www/freereelsdownload
yt-dlp --cookies cookies.txt -g -f "bestaudio" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX"
```

**Should work!** ✅

### Step 4: Update code to use cookies
We need to modify the API route to use cookies if available.

---

## 🔄 Alternative: Wait for yt-dlp Update

Sometimes YouTube blocks are temporary. Check yt-dlp GitHub for updates:
- https://github.com/yt-dlp/yt-dlp/issues

Newer versions often have better bypass methods.

---

## ⚠️ Note About Cookies:

- Cookies expire (usually 1-2 weeks)
- Need to refresh regularly
- Security: Keep cookies.txt secure (don't commit to git!)

---

**Try Step 1-3 first to see if cookies work!**

