# 🔍 Debug YouTube Format Availability

## Step 1: List ALL formats (ignore warnings)
```bash
yt-dlp --cookies cookies.txt --list-formats "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1 | grep -E "ID|audio|m4a|webm|opus" | head -20
```

**Check:** Are there ANY audio formats listed?

## Step 2: Try with format ID directly
```bash
# First, get format IDs
yt-dlp --cookies cookies.txt --list-formats "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1 | grep -i "audio" | head -5

# Then try with specific format ID (replace XXX with actual ID)
yt-dlp --cookies cookies.txt -g -f "XXX" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX"
```

## Step 3: Try with video+audio merge
```bash
yt-dlp --cookies cookies.txt -g -f "best[height<=720]" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX"
```

**If this works:** We can extract audio from video stream

## Step 4: Try without format selector (let yt-dlp choose)
```bash
yt-dlp --cookies cookies.txt -g "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1 | tail -3
```

**Check:** Does it return any URL?

## Step 5: Try with different extractor args
```bash
yt-dlp --cookies cookies.txt --extractor-args "youtube:player_client=ios" -g -f "bestaudio" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1 | tail -3
```

---

**Run Step 1 first to see what formats are actually available!**

