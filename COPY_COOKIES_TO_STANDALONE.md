# 📋 Copy Cookies to Standalone Directory

## Quick Fix: Copy cookies.txt to standalone directory

```bash
cd /var/www/freereelsdownload
cp cookies.txt .next/standalone/cookies.txt
chmod 600 .next/standalone/cookies.txt
```

## Add to Build Script (Optional)

You can add this to your build process so cookies are automatically copied:

```bash
# After npm run build, add:
cp cookies.txt .next/standalone/cookies.txt 2>/dev/null || true
```

## Verify

```bash
# Check if cookies exist in standalone directory
ls -la .next/standalone/cookies.txt

# Test API again
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/shorts/jNQXAC9IVRw", "format": "mp3"}' \
  2>&1 | grep -E "audioUrl|videoUrl|extractAudioFromVideo|error"
```

---

**Run the copy command above, then test the API!**

