# 🔧 Fix YouTube Extraction Issues

## Step 1: Update yt-dlp to Latest Version

```bash
# Update yt-dlp
pipx upgrade yt-dlp
# or
pip install --upgrade yt-dlp

# Verify version
yt-dlp --version
```

## Step 2: Test with Latest Version

```bash
# Test direct extraction
yt-dlp --js-runtimes node:/usr/bin/node -g -f "bestaudio/best" "https://youtube.com/shorts/jNQXAC9IVRw" 2>&1 | tail -10
```

## Step 3: Try Different Extraction Methods

```bash
# Try with iOS client
yt-dlp --js-runtimes node:/usr/bin/node --extractor-args "youtube:player_client=ios" -g -f "bestaudio/best" "https://youtube.com/shorts/jNQXAC9IVRw" 2>&1 | tail -10

# Try with Android client
yt-dlp --js-runtimes node:/usr/bin/node --extractor-args "youtube:player_client=android" -g -f "bestaudio/best" "https://youtube.com/shorts/jNQXAC9IVRw" 2>&1 | tail -10

# Try with web client
yt-dlp --js-runtimes node:/usr/bin/node --extractor-args "youtube:player_client=web" -g -f "bestaudio/best" "https://youtube.com/shorts/jNQXAC9IVRw" 2>&1 | tail -10
```

## Step 4: Check if Video is Accessible

```bash
# List available formats
yt-dlp --js-runtimes node:/usr/bin/node --list-formats "https://youtube.com/shorts/jNQXAC9IVRw" 2>&1 | head -30
```

---

**If all methods fail, YouTube may be blocking your server IP or the video requires authentication.**

