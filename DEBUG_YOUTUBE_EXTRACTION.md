# 🔍 Debug YouTube Audio Extraction

## ❌ Problem:
yt-dlp is failing to extract audio URL from YouTube Shorts.

## ✅ Debug Steps:

### Step 1: Test yt-dlp directly on server
```bash
yt-dlp --version
```

**Should show:** Latest version (e.g., `2025.12.8`)

### Step 2: Test with the exact URL
```bash
yt-dlp -g --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" --referer "https://www.youtube.com/" --add-header "Accept-Language:en-US,en;q=0.9" --skip-download --no-playlist --no-warnings --quiet --no-check-certificate --prefer-insecure --no-cache-dir --no-mtime --no-write-thumbnail --no-write-info-json --no-write-description --no-write-annotations --no-write-sub --no-write-auto-sub -f "bestaudio[ext=m4a]/bestaudio/best" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX"
```

**Check:** Does it return a URL or an error?

### Step 3: Test without all the flags (simpler)
```bash
yt-dlp -g -f "bestaudio" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX"
```

**Check:** Does this work?

### Step 4: Update yt-dlp to latest version
```bash
pipx upgrade yt-dlp
yt-dlp --version
```

### Step 5: Check PM2 logs for detailed error
```bash
pm2 logs freereelsdownload --lines 50 | grep -i "error\|yt-dlp\|extract"
```

### Step 6: Test API endpoint directly
```bash
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX", "format": "mp3"}' \
  -v
```

**Check:** What error is returned?

---

## 🔧 Possible Fixes:

### Fix 1: Update yt-dlp
```bash
pipx upgrade yt-dlp
```

### Fix 2: Try different format selector
The format selector might be too strict. Try:
- `bestaudio` instead of `bestaudio[ext=m4a]/bestaudio/best`
- Or `bestaudio/best`

### Fix 3: Add more yt-dlp flags
- `--extractor-args "youtube:player_client=web"` - Use web client
- `--extractor-args "youtube:player_client=android"` - Use Android client

### Fix 4: Increase timeout
The 8-second timeout might be too short. Increase to 15 seconds.

---

**Run Step 1-6 to diagnose the issue!**

