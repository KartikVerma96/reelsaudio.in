# 🔧 Install Node.js for yt-dlp Challenge Solving

## ❌ Problem:
YouTube "n challenge" requires JavaScript runtime to solve. yt-dlp needs Node.js or another JS runtime.

## ✅ Solution:

### Step 1: Check if Node.js is installed
```bash
node --version
npm --version
```

**If installed:** Should show version numbers ✅

**If not installed:** Continue to Step 2

### Step 2: Install Node.js (if not installed)
```bash
# Check current Node.js version
node --version

# If not installed or old version, install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

**Should show:** Node.js v20.x.x ✅

### Step 3: Update yt-dlp to latest version
```bash
pipx upgrade yt-dlp
yt-dlp --version
```

### Step 4: Test with Node.js available
```bash
yt-dlp --cookies cookies.txt --list-formats "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX" | grep -i audio
```

**Should show:** Audio formats listed ✅

### Step 5: Test audio extraction
```bash
yt-dlp --cookies cookies.txt -g -f "bestaudio" "https://youtube.com/shorts/8SSnvGk_EVw?si=wS8sUceb-oURSRMX"
```

**Should return:** Audio URL ✅

---

## 🔍 Alternative: Use Python's JS runtime

If Node.js installation fails, yt-dlp can use Python's JS runtime:

```bash
# Install PyExecJS (if needed)
pip3 install PyExecJS

# yt-dlp should automatically detect and use it
```

But Node.js is preferred and more reliable.

---

## 📝 Note:

- Node.js is already installed on your server (you're using it for Next.js!)
- Just make sure it's in PATH and yt-dlp can access it
- yt-dlp should automatically detect Node.js

---

**Run Step 1-5 to fix the challenge solving issue!**

