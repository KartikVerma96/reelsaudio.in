# 🧪 Test with Different Video

The video `8SSnvGk_EVw` appears to be blocked by YouTube even with JS runtime. Let's test with a different public video to verify the system works.

## Test Commands:

### 1. Test with a Popular Public Short:
```bash
# Try a well-known public YouTube Short
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/shorts/jNQXAC9IVRw", "format": "mp3"}' \
  -v 2>&1 | grep -E "audioUrl|videoUrl|extractAudioFromVideo|error"
```

### 2. Test Direct yt-dlp with Different Video:
```bash
# Test if yt-dlp can extract from a different video
yt-dlp --js-runtimes node:/usr/bin/node --no-check-age -g -f "bestaudio/best" "https://youtube.com/shorts/jNQXAC9IVRw" 2>&1 | tail -5
```

### 3. Check Video Availability:
```bash
# Check if video is publicly accessible
yt-dlp --js-runtimes node:/usr/bin/node --no-check-age --list-formats "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1 | head -20
```

## Expected Results:

- **If different video works**: The original video is likely age-restricted or requires login
- **If all videos fail**: There's a configuration issue with yt-dlp or YouTube is blocking your IP

## Common Issues:

1. **Age-restricted videos**: Use `--no-check-age` flag (already added)
2. **Region-restricted**: VPN might be needed
3. **Private videos**: Won't work without authentication
4. **IP blocking**: YouTube might be rate-limiting your server IP

---

**Run these tests to see if it's video-specific or a general issue!**

