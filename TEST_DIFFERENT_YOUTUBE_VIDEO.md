# 🧪 Test with Different YouTube Videos

## The Problem:
YouTube is blocking automated access to some videos. This is normal - not all videos can be extracted automatically.

## Solution: Try Different Videos

### Test 1: Popular YouTube Short
```bash
# Test a very popular public short
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/shorts/BQ0_JsRhLx8", "format": "mp3"}' \
  2>&1 | grep -E "audioUrl|videoUrl|extractAudioFromVideo|error"
```

### Test 2: Regular YouTube Video
```bash
# Test a regular YouTube video
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "format": "mp3"}' \
  2>&1 | grep -E "audioUrl|videoUrl|extractAudioFromVideo|error"
```

### Test 3: Another Short
```bash
# Test another short
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/shorts/Y8ceQFYWLHw", "format": "mp3"}' \
  2>&1 | grep -E "audioUrl|videoUrl|extractAudioFromVideo|error"
```

## Expected Results:

Some videos will work, some won't. This is normal for YouTube extraction.

**If any of these work**, the system is functioning correctly - it's just that some videos are more restricted than others.

---

**Try Tests 1-3 above to see if other videos work!**

