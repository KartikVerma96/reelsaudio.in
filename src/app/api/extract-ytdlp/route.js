import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Check if yt-dlp is available
    // Note: yt-dlp will NOT work on Vercel serverless functions
    // It requires Python and system binaries which aren't available in serverless
    // This route will gracefully fail and the app will use primary scraping methods
    try {
      await execAsync('yt-dlp --version');
    } catch (error) {
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
      const { stdout } = await execAsync(`yt-dlp -g -f "best[ext=mp4]/best" "${url}"`);
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

