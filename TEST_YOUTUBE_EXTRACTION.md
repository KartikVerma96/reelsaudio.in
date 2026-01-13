# 🧪 Testing YouTube Extraction

## Check What's Happening

The curl command might be taking time because we're trying multiple strategies. Check the logs:

```bash
# View real-time logs
pm2 logs freereelsdownload --lines 50

# Or view last 100 lines
pm2 logs freereelsdownload --lines 100 --nostream | tail -50
```

## Test with Timeout

Use curl with a timeout to see if it's just slow:

```bash
# Test with 30 second timeout
timeout 30 curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/shorts/8FDh9WWf5Tc?si=4a-fYzeX83ZezhIw", "format": "mp3"}' \
  -v
```

## Test Production Endpoint

Test through the full stack (Nginx + SSL):

```bash
# Test production endpoint
curl -X POST https://freereelsdownload.com/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/shorts/8FDh9WWf5Tc?si=4a-fYzeX83ZezhIw", "format": "mp3"}' \
  -v \
  --max-time 60
```

## What to Look For in Logs

The logs should show:
- `Executing simple extraction command:`
- `Simple extraction stdout length:`
- `SUCCESS: Extracted audio using URL format...`
- Or error messages showing which strategies failed

## Expected Behavior

With the new improvements, the extraction will:
1. Try simple extraction (fast)
2. Try multiple URL formats × player clients (slower, but more thorough)
3. Try video URL extraction as fallback (slowest)

**Total time:** Could take 30-60 seconds if trying all strategies.

## Quick Test - Direct yt-dlp

Test yt-dlp directly to see if it works:

```bash
# Test with simple format
yt-dlp -g -f "bestaudio/best" "https://youtube.com/shorts/8FDh9WWf5Tc?si=4a-fYzeX83ZezhIw" 2>&1 | head -20

# Test with watch format
yt-dlp -g -f "bestaudio/best" "https://www.youtube.com/watch?v=8FDh9WWf5Tc" 2>&1 | head -20

# Test with iOS client
yt-dlp -g --extractor-args "youtube:player_client=ios" -f "bestaudio/best" "https://www.youtube.com/watch?v=8FDh9WWf5Tc" 2>&1 | head -20
```

## If It's Still Failing

Check:
1. **yt-dlp version:** `yt-dlp --version` (should be latest)
2. **Node.js JS runtime:** Check `~/.config/yt-dlp/config` has `--js-runtimes node:/usr/bin/node`
3. **Logs:** Check PM2 logs for specific error messages
4. **Network:** Check if YouTube is accessible from server: `curl -I https://www.youtube.com`

## Monitor in Real-Time

```bash
# Watch logs in real-time
pm2 logs freereelsdownload --lines 0

# In another terminal, run the curl command
```
