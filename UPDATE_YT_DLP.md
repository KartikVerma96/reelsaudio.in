# 🔄 Update yt-dlp to Latest Version

## Current Issue
YouTube is blocking extraction with "Sign in to confirm you're not a bot" error. Updating yt-dlp to the latest version may help.

## Update Command

```bash
# Update yt-dlp to latest version
pipx upgrade yt-dlp

# Verify version
yt-dlp --version

# Check for updates
yt-dlp -U
```

## After Update

1. **Restart the application:**
   ```bash
   pm2 restart freereelsdownload
   ```

2. **Test extraction:**
   ```bash
   yt-dlp -g -f "bestaudio/best" "https://www.youtube.com/watch?v=8FDh9WWf5Tc" 2>&1 | head -20
   ```

3. **Check logs:**
   ```bash
   pm2 logs freereelsdownload --lines 50
   ```

## Expected Result

After updating, yt-dlp should have the latest YouTube extraction fixes. However, YouTube's bot detection is aggressive, so some videos may still fail.

## Alternative: Check yt-dlp GitHub Issues

If updating doesn't help, check for known issues:
- https://github.com/yt-dlp/yt-dlp/issues?q=is%3Aissue+is%3Aopen+youtube+bot

---

**Note:** Even with the latest yt-dlp, YouTube may still block some videos. This is expected behavior without cookies.
