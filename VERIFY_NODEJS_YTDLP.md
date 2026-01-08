# 🔍 Verify Node.js for yt-dlp

## Step 1: Verify Node.js is installed and accessible
```bash
node --version
which node
```

**Should show:** Node.js version and path ✅

## Step 2: Check if yt-dlp can detect Node.js
```bash
yt-dlp --version
yt-dlp --verbose --cookies cookies.txt --list-formats "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1 | grep -i "node\|javascript\|runtime"
```

**Check:** Does it mention Node.js or JavaScript runtime?

## Step 3: Try without challenge solving (if possible)
Some videos might work even with the warning. Try:
```bash
yt-dlp --cookies cookies.txt -g -f "bestaudio" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" 2>&1
```

**Check:** Does it return a URL despite the warning?

## Step 4: Update yt-dlp to latest (might have better challenge solver)
```bash
pipx upgrade yt-dlp
yt-dlp --version
```

## Step 5: Try with explicit Node.js path
```bash
# Find Node.js path
which node

# Try setting it explicitly (if yt-dlp supports it)
NODE_PATH=$(which node) yt-dlp --cookies cookies.txt -g -f "bestaudio" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX"
```

---

## 🔧 If Still Not Working:

The warning might be harmless - YouTube might still return formats. Try:
1. Ignore the warning and test if extraction works
2. Check if the API route handles this gracefully
3. Some videos might work even with challenge warnings

---

**Run Step 1-3 first to see if extraction works despite the warning!**

