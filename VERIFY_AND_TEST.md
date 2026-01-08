# ✅ Verify Everything is Working

## ✅ Current Status:
- ✅ PM2 is using `.next/standalone/server.js` (CORRECT!)
- ✅ Website is responding (HTTP 200 OK)
- ✅ Process is online

The old error logs are from before the fix. Let's clear them and test!

## Step 1: Clear old logs
```bash
pm2 flush
```

## Step 2: Check fresh logs
```bash
pm2 logs freereelsdownload --lines 10
```

**Should show:** Clean startup, no errors ✅

## Step 3: Test yt-dlp directly on server
```bash
yt-dlp --version
```

**Should show:** Version number (e.g., `2025.12.8`)

## Step 4: Test with the YouTube Shorts URL
```bash
yt-dlp -g --skip-download --no-playlist --no-warnings --quiet -f "bestaudio[ext=m4a]/bestaudio/best" "https://youtube.com/shorts/bAX57FevSQ0?si=0VnVI5zX7O5A7yGo"
```

**Should return:** A URL starting with `http`

## Step 5: Test the API endpoint
```bash
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/shorts/bAX57FevSQ0?si=0VnVI5zX7O5A7yGo", "format": "mp3"}' \
  -v
```

**Should return:** JSON with `audioUrl` ✅

## Step 6: Test on website
1. Visit: https://freereelsdownload.com
2. Paste: `https://youtube.com/shorts/bAX57FevSQ0?si=0VnVI5zX7O5A7yGo`
3. Click Download MP3
4. Should work! ✅

---

## 🔍 If API Test Fails:

Check PM2 logs for errors:
```bash
pm2 logs freereelsdownload --lines 50
```

Look for any yt-dlp related errors.

---

**Run Step 1-5 to verify everything is working!**

