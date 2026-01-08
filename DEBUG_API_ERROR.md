# 🔍 Debug API Error

## Step 1: Test API directly and see actual error
```bash
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX", "format": "mp3"}' \
  -v 2>&1 | tail -30
```

**Check:** What's the actual error message?

## Step 2: Check PM2 logs for detailed errors
```bash
pm2 logs freereelsdownload --lines 50 | grep -i "error\|yt-dlp\|extract"
```

**Check:** Are there any yt-dlp errors in logs?

## Step 3: Test video URL extraction directly
```bash
yt-dlp --cookies cookies.txt -g -f "best[height<=720]/best" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1
```

**Check:** Does this return a video URL?

## Step 4: Test with iOS client
```bash
yt-dlp --cookies cookies.txt --extractor-args "youtube:player_client=ios" -g -f "best[height<=720]/best" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1
```

**Check:** Does iOS client work better?

## Step 5: Check if cookies are being used
```bash
# Verify cookies file exists and is readable
ls -la cookies.txt
head -5 cookies.txt
```

---

**Run Step 1-3 first to see what's actually failing!**

