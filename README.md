# ReelsAudio.in - Instagram Reels Audio Downloader

The unbeatable Instagram Reels audio downloader built with Next.js 15, featuring a stunning mobile-first gradient UI and zero backend requirements.

## Features

- 🎨 **Stunning Mobile-First UI** - Beautiful purple → pink → red gradient design
- 🚀 **Lightning Fast** - Audio extraction in 3-8 seconds using FFmpeg.wasm
- 🌍 **Multi-Language Support** - Hindi (default), English, Tamil, Telugu, Bengali, Kannada, Malayalam
- 📱 **PWA Ready** - Add to home screen functionality
- 🌙 **Dark Mode** - Beautiful dark theme support
- 📊 **Social Proof** - Live download counter
- 🔗 **Deep Links** - Open directly in CapCut and InShot
- 📢 **Ad Ready** - 3 Google AdSense placeholder slots
- 🔍 **SEO Optimized** - Perfect meta tags, Open Graph, JSON-LD
- 🎯 **Zero Backend** - Everything runs in the browser

## Tech Stack

- Next.js 15 (App Router)
- React 18
- Tailwind CSS
- FFmpeg.wasm (@ffmpeg/ffmpeg)
- Plain JavaScript (JSX)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This project is Vercel-ready. Simply push to GitHub and connect to Vercel for automatic deployments.

## Project Structure

```
src/
├── app/
│   ├── page.js (home page)
│   ├── layout.js
│   └── globals.css
├── components/
│   ├── Downloader.js
│   ├── AdSlot.js
│   ├── LanguageSwitcher.js
│   └── ShareButtons.js
├── lib/
│   ├── ig-scraper.js
│   └── translations.js
├── translations/
│   └── (language JSON files)
└── public/
    └── manifest.json
```

## Configuration

### Google AdSense

Replace the placeholder AdSense code in `src/components/AdSlot.js` with your actual AdSense publisher ID and ad unit slots.

### Instagram Scraping

The app uses multiple methods to extract Instagram Reels:

1. **Primary Method**: Server-side API route (`/api/extract`) that tries:
   - Instagram API endpoints
   - HTML scraping with multiple patterns
   - Embed endpoint extraction
   - Deep JSON parsing

2. **Fallback Method**: yt-dlp (recommended for production)
   - Install: `pip install yt-dlp`
   - See `YT_DLP_SETUP.md` for detailed instructions
   - Automatically used if primary method fails

**Note**: Instagram frequently changes their structure and blocks scraping. For best results:
- Install yt-dlp (see `YT_DLP_SETUP.md`)
- Ensure reels are PUBLIC (not private)
- Consider using a third-party API service for production

## License

MIT License - feel free to use this project for your own purposes.

## Disclaimer

This tool is for educational purposes. Ensure you comply with Instagram's Terms of Service and respect copyright when downloading audio content.

