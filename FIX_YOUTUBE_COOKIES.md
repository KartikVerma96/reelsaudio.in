# 🔧 Fix YouTube Cookies Issue

## Problem:
Your cookies are loaded (path is correct) but YouTube still blocks extraction with "Failed to extract any player response". This means either:

1. **Cookies expired** - YouTube rotates cookies frequently
2. **Cookies not valid for this video** - Some videos require different auth
3. **IP blocking** - YouTube may block your server's IP

## Solution:

### Step 1: Export Fresh Cookies
1. Go to YouTube.com in Chrome/Firefox
2. Log in to your Google account
3. Visit a few YouTube Shorts to establish session
4. Click browser extension → Export cookies
5. Save as `cookies.txt`
6. Upload to server: `/var/www/freereelsdownload/cookies.txt`

### Step 2: Test Cookies Directly
```bash
# Test if cookies work at all
yt-dlp --cookies cookies.txt --js-runtimes node:/usr/bin/node --verbose -g -f "bestaudio/best" "https://youtube.com/shorts/jNQXAC9IVRw" 2>&1 | head -20

# Check if cookies are valid (should see valid session info)
grep -i "login\|auth\|session" cookies.txt | head -5
```

### Step 3: Try Different Video
If cookies work, test with a different video:
```bash
# Try a very popular public video
yt-dlp --cookies cookies.txt --js-runtimes node:/usr/bin/node -g -f "bestaudio/best" "https://www.youtube.com/watch?v=dQw4w9WgXcQ" 2>&1 | tail -10
```

### Step 4: Check Cookie Format
Cookies should be in Netscape format:
```
# Netscape HTTP Cookie File
.youtube.com	TRUE	/	TRUE	...	CONSENT=PENDING+123
```

### Step 5: Update yt-dlp (Critical)
```bash
pipx upgrade yt-dlp
yt-dlp --version
```

---

**Most likely: Cookies expired. Export fresh ones from a browser where you're logged into YouTube!**

