# 🔧 Fix YouTube Bot Detection - Final Solution

## ❌ Problem:
YouTube is blocking yt-dlp with "Sign in to confirm you're not a bot" error.

## ✅ Solution:

### Step 1: Update yt-dlp to LATEST version (CRITICAL!)
```bash
pipx upgrade yt-dlp
yt-dlp --version
```

**Should show:** Latest version (e.g., `2025.12.8` or newer)

### Step 2: Pull latest code
```bash
cd /var/www/freereelsdownload
git pull origin main
```

### Step 3: Rebuild
```bash
npm run build
mkdir -p .next/standalone/.next/static/chunks
cp -r .next/static/* .next/standalone/.next/static/
```

### Step 4: Restart PM2
```bash
pm2 restart freereelsdownload
```

### Step 5: Test with iOS client (often works best)
```bash
yt-dlp -g --extractor-args "youtube:player_client=ios" -f "bestaudio" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX"
```

**If this works:** The code will now try iOS client first!

### Step 6: Test with Android client
```bash
yt-dlp -g --extractor-args "youtube:player_client=android" -f "bestaudio" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX"
```

### Step 7: Test with TV client
```bash
yt-dlp -g --extractor-args "youtube:player_client=tv_embedded" -f "bestaudio" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX"
```

---

## 🔍 If Still Blocked:

### Option 1: Use cookies (advanced)
YouTube sometimes requires cookies. You can export cookies from your browser:

```bash
# Export cookies from Chrome/Firefox using browser extension
# Then use:
yt-dlp --cookies cookies.txt -g -f "bestaudio" "URL"
```

But this is complex for server-side automation.

### Option 2: Wait and retry
Sometimes YouTube temporarily blocks IPs. Wait 10-15 minutes and try again.

### Option 3: Check yt-dlp GitHub issues
```bash
# Check if there's a known issue
# Visit: https://github.com/yt-dlp/yt-dlp/issues
```

---

## 📝 What Changed:

The code now tries **4 different player clients** in order:
1. `ios` - iOS client (often works best)
2. `android` - Android client
3. `web` - Web client
4. `tv_embedded` - TV client

If all fail, it tries a fallback with iPhone user-agent.

---

**Run Step 1-4 to deploy, then test Step 5-7 to see which client works!**

