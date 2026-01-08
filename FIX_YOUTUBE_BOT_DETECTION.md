# 🔧 Fix YouTube Bot Detection

## ✅ What Was Fixed:
Added browser-like headers to all yt-dlp commands:
- `--user-agent` - Chrome browser user agent
- `--referer` - YouTube referer header
- `--add-header` - Accept-Language header

## 📋 Deployment Steps:

### Step 1: Update yt-dlp to latest version
```bash
pipx upgrade yt-dlp
```

### Step 2: Pull latest code
```bash
cd /var/www/freereelsdownload
git pull origin main
```

### Step 3: Rebuild the app
```bash
npm run build
```

### Step 4: Restart PM2
```bash
pm2 restart freereelsdownload
```

### Step 5: Test yt-dlp directly
```bash
yt-dlp -g --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" --referer "https://www.youtube.com/" --add-header "Accept-Language:en-US,en;q=0.9" --skip-download --no-playlist --no-warnings --quiet -f "bestaudio[ext=m4a]/bestaudio/best" "https://youtube.com/shorts/bAX57FevSQ0?si=0VnVI5zX7O5A7yGo"
```

**Should return:** A URL starting with `http` (no bot detection error) ✅

### Step 6: Test the API endpoint
```bash
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/shorts/bAX57FevSQ0?si=0VnVI5zX7O5A7yGo", "format": "mp3"}'
```

**Should return:** JSON with `"success": true` and `"audioUrl"` ✅

### Step 7: Test on website
1. Visit: https://freereelsdownload.com
2. Paste: `https://youtube.com/shorts/bAX57FevSQ0?si=0VnVI5zX7O5A7yGo`
3. Click Download MP3
4. Should work! ✅

---

## 🔍 If Still Getting Bot Detection Error:

### Option 1: Update yt-dlp
```bash
pipx upgrade yt-dlp
yt-dlp --version  # Should be latest
```

### Option 2: Try with cookies (advanced)
If bot detection persists, you may need to use cookies:
```bash
yt-dlp --cookies-from-browser chrome "URL"
```

But this requires browser cookies, which is complex for server-side.

### Option 3: Wait and retry
Sometimes YouTube temporarily blocks IPs. Wait a few minutes and try again.

---

**Run the deployment steps above to apply the fix!**

