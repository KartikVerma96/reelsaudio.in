# 🔧 Debug yt-dlp Not Working

## ❌ Problem:
Downloads fail with: "Could not extract audio URL"

## 🔍 Root Cause:
`yt-dlp` was installed with `pipx` (in `/root/.local/bin`), but Node.js process might not have this in PATH.

## ✅ Solution:

### Step 1: Test yt-dlp directly on server
```bash
cd /var/www/freereelsdownload
yt-dlp --version
```

**If this works:** yt-dlp is accessible to root user

### Step 2: Test with the exact URL
```bash
yt-dlp -g --skip-download --no-playlist --no-warnings --quiet --no-check-certificate --prefer-insecure --no-cache-dir -f "bestaudio[ext=m4a]/bestaudio/best" "https://youtube.com/shorts/bAX57FevSQ0?si=0VnVI5zX7O5A7yGo"
```

**Should return:** A URL starting with `http`

### Step 3: Check if Node.js can find yt-dlp
```bash
cd /var/www/freereelsdownload
node -e "const {exec} = require('child_process'); exec('yt-dlp --version', (e,o) => console.log(e ? 'ERROR: ' + e.message : 'SUCCESS: ' + o));"
```

**If ERROR:** yt-dlp is not in Node.js PATH

### Step 4: Find full path to yt-dlp
```bash
which yt-dlp
```

**Should show:** `/root/.local/bin/yt-dlp`

### Step 5: Fix Option A - Add PATH to PM2 environment

Create/edit PM2 ecosystem file:
```bash
cd /var/www/freereelsdownload
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'freereelsdownload',
    script: '.next/standalone/server.js',
    cwd: '/var/www/freereelsdownload',
    env: {
      NODE_ENV: 'production',
      PATH: '/root/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
    }
  }]
}
EOF
```

### Step 6: Restart PM2 with ecosystem file
```bash
pm2 delete freereelsdownload
pm2 start ecosystem.config.js
pm2 save
```

### Step 7: Test again
```bash
pm2 logs freereelsdownload --lines 20
```

Then test the website with the YouTube Shorts URL.

---

## ✅ Alternative Fix: Use Full Path in Code

If PATH fix doesn't work, we can modify the API route to use full path `/root/.local/bin/yt-dlp` instead of just `yt-dlp`.

---

**Run Step 1-4 first to diagnose, then apply the fix!**

