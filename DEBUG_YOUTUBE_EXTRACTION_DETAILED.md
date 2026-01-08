# 🔍 Detailed YouTube Extraction Debugging

## Step 1: Check PM2 Logs for Actual Errors

```bash
pm2 logs freereelsdownload --lines 200 | grep -A 5 -B 5 "youtube\|yt-dlp\|ERROR\|error" | tail -50
```

## Step 2: Test yt-dlp Directly with Verbose Output

```bash
# Test with JS runtime and verbose output
yt-dlp --js-runtimes node:/usr/bin/node --no-check-age --verbose -g -f "bestaudio/best" "https://youtube.com/shorts/jNQXAC9IVRw" 2>&1 | tail -30
```

## Step 3: Test Video URL Extraction (Fallback)

```bash
# Try to get video URL instead of audio
yt-dlp --js-runtimes node:/usr/bin/node --no-check-age --verbose -g -f "best[height<=720]/best" "https://youtube.com/shorts/jNQXAC9IVRw" 2>&1 | tail -30
```

## Step 4: Check if API Route is Actually Using JS Runtime

```bash
# Check the actual command being executed
cd /var/www/freereelsdownload
grep -A 10 "buildYtDlpCommand" src/app/api/download/route.js | head -20
```

## Step 5: Test with Different Player Client

```bash
# Test iOS client specifically
yt-dlp --js-runtimes node:/usr/bin/node --no-check-age --extractor-args "youtube:player_client=ios" -g -f "bestaudio/best" "https://youtube.com/shorts/jNQXAC9IVRw" 2>&1 | tail -10
```

## Step 6: Check yt-dlp Version

```bash
yt-dlp --version
pipx upgrade yt-dlp
yt-dlp --version
```

## Step 7: Test API Route with Full Error Output

```bash
# Get full error response (not just grep)
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/shorts/jNQXAC9IVRw", "format": "mp3"}' \
  2>&1
```

---

**Run Steps 1-7 and share ALL output!**

