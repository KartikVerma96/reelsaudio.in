import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Find yt-dlp executable path
 * Tries common locations where yt-dlp might be installed
 */
async function findYtDlp() {
  const possiblePaths = [
    'yt-dlp', // In PATH
    '/root/.local/bin/yt-dlp', // pipx default location
    '/usr/local/bin/yt-dlp',
    '/usr/bin/yt-dlp',
    '~/.local/bin/yt-dlp',
  ];

  for (const ytDlpPath of possiblePaths) {
    try {
      await execAsync(`${ytDlpPath} --version`, { timeout: 3000 });
      return ytDlpPath;
    } catch (error) {
      // Try next path
      continue;
    }
  }
  return null;
}

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Find yt-dlp executable
    const ytDlpPath = await findYtDlp();
    
    if (!ytDlpPath) {
      return NextResponse.json(
        { 
          error: 'yt-dlp is not available. On Vercel serverless, yt-dlp cannot be used. The app will use primary scraping methods instead.',
          fallback: true,
          note: 'yt-dlp requires a VPS or dedicated server with Python installed'
        },
        { status: 503 }
      );
    }

    try {
      // Use yt-dlp to get video URL (best quality)
      const { stdout } = await execAsync(`"${ytDlpPath}" -g --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" --referer "https://www.youtube.com/" --add-header "Accept-Language:en-US,en;q=0.9" -f "best[ext=mp4]/best" "${url}"`);
      const videoUrl = stdout.trim().split('\n')[0]; // Get first URL (video, not audio)
      
      if (!videoUrl || !videoUrl.startsWith('http')) {
        throw new Error('Invalid URL returned from yt-dlp');
      }

      return NextResponse.json({ videoUrl });
    } catch (error) {
      // yt-dlp error
      return NextResponse.json(
        { 
          error: `yt-dlp failed: ${error.message}`,
          suggestion: 'The reel might be private or yt-dlp needs to be updated'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    // Error in yt-dlp route
    return NextResponse.json(
      { error: error.message || 'Failed to extract video URL' },
      { status: 500 }
    );
  }
}

