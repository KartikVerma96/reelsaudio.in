# 🔍 Debug YouTube Extraction Without Cookies

## Step 1: Check PM2 Logs for Actual Error

```bash
pm2 logs freereelsdownload --lines 100 | grep -i "error\|yt-dlp\|youtube\|js\|runtime"
```

## Step 2: Enable JS Runtime (CRITICAL!)

```bash
# Create config directory
mkdir -p ~/.config/yt-dlp

# Find Node.js path
which node
# Output should be: /usr/bin/node (or similar)

# Create config file with correct path
cat > ~/.config/yt-dlp/config << EOF
--js-runtimes node:/usr/bin/node
EOF

# Verify config
cat ~/.config/yt-dlp/config
```

## Step 3: Test yt-dlp Directly with JS Runtime

```bash
# Test if JS runtime works
yt-dlp --verbose -g -f "bestaudio/best" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1 | head -30

# Check if Node.js is being used
yt-dlp --verbose -g -f "bestaudio/best" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1 | grep -i "js\|runtime\|node"
```

## Step 4: Test Different Player Clients

```bash
# Test iOS client
yt-dlp --js-runtimes node:/usr/bin/node --extractor-args "youtube:player_client=ios" -g -f "bestaudio/best" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1 | tail -5

# Test Android client
yt-dlp --js-runtimes node:/usr/bin/node --extractor-args "youtube:player_client=android" -g -f "bestaudio/best" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1 | tail -5

# Test web client
yt-dlp --js-runtimes node:/usr/bin/node --extractor-args "youtube:player_client=web" -g -f "bestaudio/best" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1 | tail -5
```

## Step 5: Check if Video URL Extraction Works (Fallback)

```bash
# Try to get video URL instead
yt-dlp --js-runtimes node:/usr/bin/node --extractor-args "youtube:player_client=ios" -g -f "best[height<=720]/best" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1 | tail -5
```

## Step 6: Update yt-dlp to Latest Version

```bash
pipx upgrade yt-dlp
# or if installed via pip
pip install --upgrade yt-dlp

# Verify version
yt-dlp --version
```

## Step 7: Check API Route Code

The API route should be using the JS runtime automatically. Let's verify:

```bash
# Check if the code was pulled
cd /var/www/freereelsdownload
git log --oneline -5

# Check the actual command being built
grep -A 5 "buildYtDlpCommand" src/app/api/download/route.js
```

## Common Issues:

1. **JS Runtime not configured** - Run Step 2
2. **Node.js path wrong** - Check `which node` and update config
3. **yt-dlp version too old** - Run Step 6
4. **YouTube blocking** - Try different video or wait a few minutes
5. **Rate limiting** - Add delays between requests

---

**Run Steps 1-7 and share the output!**

