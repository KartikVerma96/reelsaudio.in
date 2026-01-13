# 📚 ReelsAudio.in - Complete Project Documentation

## 🎯 What We Are Developing

**ReelsAudio.in** (also known as **freereelsdownload.com**) is a **multi-platform audio and video downloader** web application that allows users to download audio (MP3) and video (MP4) content from popular social media platforms.

### Supported Platforms:
1. **Instagram Reels** - Audio and video extraction
2. **YouTube Shorts** - Audio and video extraction
3. **Facebook Reels** - Audio and video extraction

### Key Features:
- 🎨 **Modern UI** - Beautiful mobile-first gradient design (purple → pink → red)
- 🚀 **Fast Processing** - Audio extraction in 3-8 seconds using FFmpeg.wasm
- 🌍 **Multi-Language Support** - Hindi, English, Tamil, Telugu, Bengali, Kannada, Malayalam
- 📱 **PWA Ready** - Progressive Web App functionality
- 🌙 **Dark Mode** - Beautiful dark theme support
- 📊 **Social Proof** - Live download counter
- 🔗 **Deep Links** - Direct integration with CapCut and InShot
- 📢 **Ad Ready** - Google AdSense placeholder slots
- 🔍 **SEO Optimized** - Perfect meta tags, Open Graph, JSON-LD
- 🎯 **Hybrid Architecture** - Client-side FFmpeg.wasm + Server-side yt-dlp

### Technology Stack:
- **Frontend Framework:** Next.js 16.0.8 (App Router)
- **UI Library:** React 19.2.1
- **Styling:** Tailwind CSS 3.4.13
- **Audio Processing:** FFmpeg.wasm (@ffmpeg/ffmpeg, @ffmpeg/core, @ffmpeg/util)
- **Notifications:** react-hot-toast
- **Backend Processing:** yt-dlp (Python-based media extractor)
- **Server:** Node.js 20.x
- **Process Manager:** PM2
- **Web Server:** Nginx (reverse proxy)
- **SSL:** Let's Encrypt (Certbot)
- **Hosting:** Hostinger VPS (Ubuntu 24.04 LTS)

---

## 🖥️ Server Configuration

### Server Details:
- **Provider:** Hostinger
- **VPS Type:** KVM 2
- **Operating System:** Ubuntu 24.04 LTS
- **IP Address:** 72.60.220.145
- **Domain:** freereelsdownload.com (and www.freereelsdownload.com)
- **Project Directory:** `/var/www/freereelsdownload`

### Network Configuration:
- **HTTP Port:** 80 (redirects to HTTPS)
- **HTTPS Port:** 443 (SSL enabled)
- **Application Port:** 3000 (internal, proxied by Nginx)
- **Firewall:** UFW enabled (SSH, HTTP, HTTPS allowed)

### DNS Configuration:
- **A Record (@):** Points to VPS IP (72.60.220.145)
- **A Record (www):** Points to VPS IP (72.60.220.145)
- **TTL:** 3600 seconds

### Nginx Configuration:
- **Config File:** `/etc/nginx/sites-available/freereelsdownload`
- **Enabled Site:** `/etc/nginx/sites-enabled/freereelsdownload`
- **Reverse Proxy:** All requests proxied to `http://localhost:3000`
- **SSL:** Auto-configured by Certbot
- **Static Files:** Served with caching headers
- **Client Body Size:** 100MB (for large downloads)
- **Timeouts:** 300 seconds (for long-running downloads)

### PM2 Configuration:
- **App Name:** freereelsdownload
- **Startup Script:** `.next/standalone/server.js`
- **Auto-restart:** Enabled
- **Logs:** Managed by PM2
- **Startup on Boot:** Configured via `pm2 startup`

### SSL/TLS:
- **Certificate Provider:** Let's Encrypt
- **Auto-renewal:** Enabled (via Certbot)
- **Certificate Path:** `/etc/letsencrypt/live/freereelsdownload.com/`
- **Renewal Frequency:** Every 90 days (automatic)

---

## 📦 Installed Software & Dependencies

### System-Level Packages:

#### 1. **Node.js & npm**
- **Version:** Node.js 20.x (LTS)
- **Installation Method:** NodeSource repository
- **Purpose:** Runtime for Next.js application
- **Command:** `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -`

#### 2. **Python 3**
- **Version:** Python 3.x (system default)
- **Installation Method:** `apt install python3 python3-pip python3-venv python3-full`
- **Purpose:** Required for yt-dlp and pipx
- **Note:** Ubuntu 24.04 uses PEP 668 protection (prevents system-wide pip installs)

#### 3. **pipx**
- **Version:** Latest from apt repository
- **Installation Method:** `apt install pipx`
- **Purpose:** Isolated Python package installation (required for Ubuntu 24.04)
- **Usage:** `pipx install yt-dlp`

#### 4. **yt-dlp**
- **Version:** Latest (2025.x.x)
- **Installation Method:** `pipx install yt-dlp`
- **Purpose:** Media extraction from YouTube, Instagram, Facebook
- **Location:** `/root/.local/bin/yt-dlp` (or in PATH after `pipx ensurepath`)
- **Configuration:** `~/.config/yt-dlp/config` (JS runtime configured)

#### 5. **FFmpeg**
- **Version:** Latest from apt repository
- **Installation Method:** `apt install ffmpeg`
- **Purpose:** Server-side video/audio processing (backup method)
- **Note:** Primary audio extraction uses FFmpeg.wasm (client-side)

#### 6. **PM2**
- **Version:** Latest
- **Installation Method:** `npm install -g pm2`
- **Purpose:** Process manager for Node.js application
- **Features:** Auto-restart, logging, monitoring, startup on boot

#### 7. **Nginx**
- **Version:** Latest from apt repository
- **Installation Method:** `apt install nginx`
- **Purpose:** Reverse proxy, SSL termination, static file serving
- **Status:** Enabled and running

#### 8. **Certbot**
- **Version:** Latest from apt repository
- **Installation Method:** `apt install certbot python3-certbot-nginx`
- **Purpose:** SSL certificate management (Let's Encrypt)
- **Usage:** `certbot --nginx -d freereelsdownload.com -d www.freereelsdownload.com`

### Application Dependencies (npm):

#### Production Dependencies:
- **next:** ^16.0.8 - Next.js framework
- **react:** ^19.2.1 - React library
- **react-dom:** ^19.2.1 - React DOM renderer
- **@ffmpeg/ffmpeg:** ^0.12.10 - FFmpeg WebAssembly wrapper
- **@ffmpeg/core:** ^0.12.6 - FFmpeg core WebAssembly
- **@ffmpeg/util:** ^0.12.1 - FFmpeg utilities
- **react-hot-toast:** ^2.6.0 - Toast notifications

#### Development Dependencies:
- **tailwindcss:** ^3.4.13 - CSS framework
- **postcss:** ^8.4.47 - CSS post-processor
- **autoprefixer:** ^10.4.20 - CSS vendor prefixer

### System Tools:
- **git** - Version control
- **curl** - HTTP client (for testing)
- **wget** - File downloader
- **build-essential** - Compilation tools
- **ufw** - Firewall management

---

## 🏗️ Application Architecture

### Frontend (Client-Side):
- **Framework:** Next.js 16 with App Router
- **Build Output:** Standalone mode (`output: 'standalone'`)
- **Static Files:** Served from `.next/static/`
- **Audio Processing:** FFmpeg.wasm runs in browser
- **Platform Detection:** Custom library (`src/lib/platform-detector.js`)

### Backend (Server-Side):
- **API Routes:** Next.js API routes (`src/app/api/`)
- **Main API:** `/api/download` - Unified download endpoint
- **Extraction API:** `/api/extract` - Instagram-specific extraction
- **Fallback API:** `/api/extract-ytdlp` - yt-dlp fallback
- **Health Check:** `/api/health` - Server health monitoring
- **Metrics:** `/api/metrics` - Application metrics

### Processing Flow:

#### For Instagram Reels:
1. User submits URL → Client detects platform
2. Client calls `/api/extract` → Server scrapes Instagram
3. If successful → Returns video URL
4. Client downloads video → FFmpeg.wasm extracts audio
5. User downloads MP3

#### For YouTube/Facebook:
1. User submits URL → Client detects platform
2. Client calls `/api/download` → Server uses yt-dlp
3. Server attempts audio extraction → Returns audio URL or video URL
4. If video URL → Client uses FFmpeg.wasm to extract audio
5. User downloads MP3/MP4

### File Structure:
```
/var/www/freereelsdownload/
├── .next/                    # Next.js build output
│   ├── standalone/          # Standalone server files
│   └── static/              # Static assets
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   │   ├── download/   # Main download API
│   │   │   ├── extract/    # Instagram extraction
│   │   │   └── extract-ytdlp/ # yt-dlp fallback
│   │   ├── page.js         # Home page
│   │   └── layout.js       # Root layout
│   ├── components/         # React components
│   │   ├── Downloader.js  # Main download component
│   │   ├── AdSlot.js      # AdSense slots
│   │   └── ShareButtons.js # Social sharing
│   └── lib/                # Utility libraries
│       ├── platform-detector.js
│       └── translations.js
├── public/                  # Static public files
├── .env.production         # Production environment variables
├── package.json            # npm dependencies
├── next.config.js          # Next.js configuration
└── deploy.sh               # Deployment script
```

---

## ⚠️ Current Issues & Challenges

### 1. **YouTube Bot Detection** 🔴 **CRITICAL**

#### Problem:
YouTube is actively blocking automated access to many videos, even with:
- ✅ JavaScript runtime enabled (`--js-runtimes node:/usr/bin/node`)
- ✅ Latest yt-dlp version
- ✅ Multiple player clients (ios, android, web, tv_embedded, mweb)
- ✅ Proper browser-like headers (user-agent, referer, Accept-Language, etc.)
- ✅ Anti-bot headers (DNT, Connection, Upgrade-Insecure-Requests)

#### Error Messages:
```
ERROR: [youtube] VIDEO_ID: Failed to extract any player response; please report this issue...
ERROR: [youtube] VIDEO_ID: Sign in to confirm you're not a bot.
ERROR: [youtube] VIDEO_ID: n challenge solving failed
```

#### Current Status:
- **Some videos work** (popular/public videos)
- **Many videos fail** (especially newer or restricted content)
- **No cookie-based solution** (user explicitly requested cookie-free approach)

#### Attempted Solutions:
1. ✅ Rotating user agents (Windows, Mac, Linux, iOS)
2. ✅ Multiple player clients with retry mechanism
3. ✅ JavaScript runtime configuration
4. ✅ Comprehensive browser headers
5. ✅ Format selector optimization (`bestaudio/best`)
6. ✅ Fallback to video URL extraction (client-side FFmpeg processing)
7. ✅ Detailed logging for debugging

#### Workaround:
- Extract video URL instead of audio URL when audio extraction fails
- Return `extractAudioFromVideo: true` flag to client
- Client downloads video and uses FFmpeg.wasm to extract audio
- **Limitation:** Still requires successful video URL extraction

#### Impact:
- **User Experience:** Some YouTube Shorts fail to download
- **Success Rate:** Varies by video (estimated 30-60% success rate)
- **User Feedback:** Error message suggests trying different videos

---

### 2. **Ubuntu 24.04 PEP 668 Protection** 🟡 **RESOLVED**

#### Problem:
Ubuntu 24.04 blocks system-wide `pip install` commands to prevent conflicts with system packages.

#### Error:
```
error: externally-managed-environment
```

#### Solution:
- ✅ Use `pipx` for isolated Python package installation
- ✅ Install yt-dlp via `pipx install yt-dlp`
- ✅ Ensure PATH includes pipx binaries (`pipx ensurepath`)

#### Status: **RESOLVED**

---

### 3. **Next.js Standalone Mode Static Files** 🟡 **RESOLVED**

#### Problem:
In standalone mode, Next.js doesn't automatically copy static files to `.next/standalone/.next/static/`, causing 404 errors for CSS/JS assets.

#### Error:
```
Failed to load resource: the server responded with a status of 404 (Not Found)
Refused to apply style... MIME type ('text/plain') is not a supported stylesheet MIME type
```

#### Solution:
- ✅ Manual copy after build: `cp -r .next/static/* .next/standalone/.next/static/`
- ✅ Create directory structure: `mkdir -p .next/standalone/.next/static/chunks`
- ✅ Added to deployment workflow

#### Status: **RESOLVED**

---

### 4. **PM2 Startup Configuration** 🟡 **RESOLVED**

#### Problem:
Using `pm2 start npm --name "freereelsdownload" -- start` doesn't work with Next.js standalone mode.

#### Error:
```
EADDRINUSE: address already in use :::3000
```

#### Solution:
- ✅ Use direct server.js path: `pm2 start .next/standalone/server.js --name "freereelsdownload"`
- ✅ Configure PM2 startup: `pm2 startup` → follow instructions
- ✅ Save PM2 config: `pm2 save`

#### Status: **RESOLVED**

---

### 5. **Nginx Cache Headers** 🟡 **RESOLVED**

#### Problem:
Server returning `304 Not Modified` causing stale content issues.

#### Solution:
- ✅ Added cache-busting headers to Nginx config
- ✅ `add_header Cache-Control "no-cache, no-store, must-revalidate" always;`
- ✅ Proper cache headers for static files vs dynamic content

#### Status: **RESOLVED**

---

### 6. **DNS Propagation** 🟡 **RESOLVED**

#### Problem:
Domain initially pointing to wrong IP address (84.32.84.32 instead of 72.60.220.145).

#### Error:
```
Certbot failed to authenticate... Invalid response from http://freereelsdownload.com/.well-known/acme-challenge/...
```

#### Solution:
- ✅ Updated A records in Hostinger DNS settings
- ✅ Waited for DNS propagation (5-30 minutes)
- ✅ Verified with `nslookup freereelsdownload.com`

#### Status: **RESOLVED**

---

### 7. **yt-dlp JavaScript Runtime Configuration** 🟡 **PARTIALLY RESOLVED**

#### Problem:
yt-dlp needs Node.js JavaScript runtime to solve YouTube's JavaScript challenges.

#### Solution:
- ✅ Created `~/.config/yt-dlp/config` file
- ✅ Added `--js-runtimes node:/usr/bin/node` to config
- ✅ Dynamic Node.js path detection in API route
- ✅ Fallback to `which node` if standard paths fail

#### Status: **CONFIGURED** (but YouTube still blocks many videos)

---

### 8. **Environment Variables in Standalone Mode** 🟢 **RESOLVED**

#### Problem:
Environment variables not loading correctly in standalone mode.

#### Solution:
- ✅ Created `.env.production` file with `NEXT_PUBLIC_SITE_URL`
- ✅ Next.js automatically loads `.env.production` in production builds
- ✅ PM2 loads environment from project directory

#### Status: **RESOLVED**

---

## 🔧 Deployment Process

### Initial Deployment:
1. Run `deploy.sh` script (installs all system dependencies)
2. Clone repository to `/var/www/freereelsdownload`
3. Create `.env.production` file
4. Run `npm install`
5. Run `npm run build`
6. Copy static files: `cp -r .next/static/* .next/standalone/.next/static/`
7. Start with PM2: `pm2 start .next/standalone/server.js --name "freereelsdownload"`
8. Configure Nginx
9. Setup SSL with Certbot
10. Configure firewall (UFW)

### Update Deployment:
```bash
cd /var/www/freereelsdownload
git pull origin main
npm install  # If package.json changed
npm run build
mkdir -p .next/standalone/.next/static/chunks
cp -r .next/static/* .next/standalone/.next/static/
pm2 restart freereelsdownload
```

---

## 📊 Monitoring & Maintenance

### PM2 Commands:
```bash
pm2 status                    # Check app status
pm2 logs freereelsdownload     # View logs
pm2 monit                     # Monitor resources
pm2 restart freereelsdownload # Restart app
pm2 save                      # Save PM2 config
```

### Nginx Commands:
```bash
sudo nginx -t                 # Test configuration
sudo systemctl reload nginx   # Reload Nginx
sudo systemctl status nginx   # Check status
sudo tail -f /var/log/nginx/error.log  # View error logs
```

### System Monitoring:
```bash
htop                          # CPU/Memory monitoring
df -h                         # Disk usage
free -h                       # Memory usage
netstat -tulpn | grep :3000   # Check port 3000
```

### yt-dlp Updates:
```bash
pipx upgrade yt-dlp           # Update yt-dlp
yt-dlp --version              # Check version
```

---

## 🎯 Future Improvements

### High Priority:
1. **YouTube Extraction Reliability**
   - Research alternative extraction methods
   - Consider proxy rotation
   - Implement rate limiting/backoff strategies
   - Monitor yt-dlp updates for YouTube fixes

2. **Error Handling**
   - Better user-facing error messages
   - Retry mechanisms with exponential backoff
   - Fallback to alternative extraction methods

3. **Performance Optimization**
   - CDN for static assets
   - Caching strategies
   - Compression optimization

### Medium Priority:
1. **Analytics Integration**
   - Google Analytics 4
   - Download tracking
   - Error tracking (Sentry)

2. **User Features**
   - Download history
   - Batch downloads
   - Quality selection UI improvements

3. **SEO Enhancements**
   - Dynamic meta tags per platform
   - Structured data improvements
   - Sitemap updates

### Low Priority:
1. **Additional Platforms**
   - TikTok support
   - Twitter/X video support
   - Other social media platforms

2. **Mobile App**
   - PWA improvements
   - Native mobile app (React Native)

---

## 📝 Notes

### Cookie-Free Approach:
The user explicitly requested **no cookie-based solutions** for YouTube downloads. All current implementations focus on:
- Header manipulation
- Player client rotation
- JavaScript runtime
- Format selector optimization

### Platform-Specific Behavior:
- **Instagram:** Works well with server-side scraping + client-side FFmpeg
- **Facebook:** Works well with yt-dlp
- **YouTube:** Inconsistent (30-60% success rate due to bot detection)

### Build Configuration:
- **Output Mode:** Standalone (for optimized production builds)
- **Static Export:** Disabled (using server-side rendering)
- **Image Optimization:** Enabled (Next.js Image component)

---

## 🔗 Useful Links

- **Production Site:** https://freereelsdownload.com
- **GitHub Repository:** https://github.com/KartikVerma96/reelsaudio.in
- **Hostinger VPS:** Hostinger hPanel
- **PM2 Documentation:** https://pm2.keymetrics.io/
- **yt-dlp Documentation:** https://github.com/yt-dlp/yt-dlp
- **Next.js Documentation:** https://nextjs.org/docs

---

**Last Updated:** January 2025
**Document Version:** 1.0
**Maintained By:** Development Team
