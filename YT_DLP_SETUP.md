# yt-dlp Installation & Setup Guide

## ✅ Installation Complete!

yt-dlp has been successfully installed on your system.

## Verification

To verify yt-dlp is working, run:
```bash
yt-dlp --version
```

You should see something like: `2025.12.8` (or similar version number)

## Testing yt-dlp

### Test with YouTube Shorts:
```bash
yt-dlp -g "https://www.youtube.com/shorts/VIDEO_ID"
```

### Test with Facebook Reels:
```bash
yt-dlp -g "https://www.facebook.com/reel/VIDEO_ID"
```

### Test with Instagram Reels:
```bash
yt-dlp -g "https://www.instagram.com/reel/VIDEO_ID"
```

## Testing Your Application

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test the new features:**
   - Open `http://localhost:3000`
   - Try pasting a YouTube Shorts URL
   - Try pasting a Facebook Reels URL
   - Select "Video (MP4)" format
   - Select different quality options
   - Click "Download Now"

## API Route Testing

The `/api/download` route will now work locally because yt-dlp is installed.

### Test the API directly:
```bash
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/shorts/VIDEO_ID", "format": "mp4", "quality": "best"}'
```

## Common Issues

### Issue: "yt-dlp is not available"
- **Solution:** Make sure yt-dlp is in your PATH
- Check with: `where yt-dlp` (Windows) or `which yt-dlp` (Linux/Mac)
- If not found, restart your terminal/PowerShell

### Issue: "Command not found"
- **Solution:** Try using `python -m yt_dlp` instead of `yt-dlp`
- Or add Python Scripts directory to PATH

### Issue: "Permission denied" or "Access denied"
- **Solution:** Run terminal as Administrator (Windows)
- Or use: `pip install --user yt-dlp`

## Updating yt-dlp

To update to the latest version:
```bash
pip install --upgrade yt-dlp
```

## Production Deployment

⚠️ **Important:** yt-dlp will NOT work on Vercel serverless functions because:
- Serverless functions don't allow installing system binaries
- yt-dlp requires Python and system dependencies

### Options for Production:

1. **Use a VPS/Dedicated Server:**
   - Deploy your Next.js app to a VPS (DigitalOcean, AWS EC2, etc.)
   - Install yt-dlp on the server
   - Your API routes will work

2. **Use a Third-Party API:**
   - Integrate with services like RapidAPI, ScraperAPI, etc.
   - Modify `/api/download/route.js` to use the API instead

3. **Hybrid Approach:**
   - Keep Instagram audio downloads working (current method)
   - Use yt-dlp API only for Facebook/YouTube (optional feature)

## Current Status

✅ **Local Development:** yt-dlp is installed and ready to use
✅ **Instagram Reels:** Works with existing method (no yt-dlp needed for audio)
⚠️ **Facebook/YouTube:** Requires yt-dlp (works locally, needs VPS for production)

## Next Steps

1. Test locally with different platforms
2. Test different formats (MP3, MP4)
3. Test different quality options
4. Plan production deployment strategy (VPS vs API)

