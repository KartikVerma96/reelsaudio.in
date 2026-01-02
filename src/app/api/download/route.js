import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import os from 'os';
import path from 'path';

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

/**
 * Unified download API route
 * Supports: Instagram Reels, Facebook Reels, YouTube Shorts
 * Formats: MP3 (audio), MP4 (video with quality options)
 */
export async function POST(request) {
  try {
    const { url, format = 'mp3', quality = 'best' } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate format
    const validFormats = ['mp3', 'mp4', 'audio', 'video'];
    if (!validFormats.includes(format.toLowerCase())) {
      return NextResponse.json(
        { error: `Invalid format. Supported formats: ${validFormats.join(', ')}` },
        { status: 400 }
      );
    }

    // Find yt-dlp executable
    const ytDlpPath = await findYtDlp();
    
    if (!ytDlpPath) {
      return NextResponse.json(
        {
          error: 'yt-dlp is not available on this server. Video downloads require yt-dlp.',
          fallback: true,
          note: 'Please ensure yt-dlp is installed and accessible. Check: which yt-dlp'
        },
        { status: 503 }
      );
    }

    if (!ytDlpAvailable) {
      // For serverless environments (like Vercel), yt-dlp won't work
      // Return error with suggestion to use client-side extraction
      return NextResponse.json(
        {
          error: 'yt-dlp is not available on this server. Video downloads require yt-dlp.',
          fallback: true,
          note: 'For production, consider using a VPS or dedicated server with yt-dlp installed, or use client-side extraction for audio-only downloads.'
        },
        { status: 503 }
      );
    }

    try {
      let command;
      let videoUrl;
      let audioUrl;
      let videoInfo;

      if (format === 'mp3' || format === 'audio') {
        // First, try to get direct audio URL (faster)
        // Only use server-side download if it's HLS or direct URL fails
        try {
          // Ultra-fast extraction with minimal processing
          // Use --skip-download, --print, and --no-download to avoid any file operations
          // Reduce timeout to 8 seconds for faster failure
          const audioResult = await Promise.race([
            execAsync(
              `"${ytDlpPath}" -g --skip-download --no-playlist --no-warnings --quiet --no-check-certificate --prefer-insecure --no-cache-dir --no-mtime --no-write-thumbnail --no-write-info-json --no-write-description --no-write-annotations --no-write-sub --no-write-auto-sub --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" --referer "https://www.youtube.com/" --add-header "Accept-Language:en-US,en;q=0.9" -f "bestaudio[ext=m4a]/bestaudio/best" "${url}"`,
              { timeout: 8000, maxBuffer: 256 * 1024 } // 8 second timeout, 256KB buffer
            ),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Extraction timeout')), 8000)
            )
          ]).catch(() => ({ stdout: '' }));
          
          audioUrl = audioResult.stdout.trim().split('\n')[0];
          
          // Check if it's HLS - if so, we need server-side download
          const isHLS = audioUrl && audioUrl.includes('.m3u8');
          
          if (!isHLS && audioUrl && audioUrl.startsWith('http')) {
            // Return immediately - don't wait for anything else
            return NextResponse.json({
              success: true,
              audioUrl,
              videoUrl: null,
              format: 'mp3',
              title: 'Audio',
              duration: null,
              thumbnail: null,
            });
          }
        } catch (urlError) {
          // URL extraction failed, will try server-side download
        }
        
        // HLS or URL extraction failed - try alternative extraction methods
        // First, try to get the best available audio URL (even if it's HLS)
        try {
          // Try to get any audio URL available, including HLS
          const fallbackResult = await Promise.race([
            execAsync(
              `"${ytDlpPath}" -g --skip-download --no-playlist --no-warnings --quiet --no-check-certificate --prefer-insecure --no-cache-dir --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" --referer "https://www.youtube.com/" --add-header "Accept-Language:en-US,en;q=0.9" -f "bestaudio/best" "${url}"`,
              { timeout: 5000, maxBuffer: 256 * 1024 } // 5 second timeout
            ),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Fallback timeout')), 5000)
            )
          ]).catch(() => ({ stdout: '' }));
          
          const fallbackUrl = fallbackResult.stdout.trim().split('\n')[0];
          
          if (fallbackUrl && fallbackUrl.startsWith('http')) {
            // Return the URL even if it's HLS - let the client handle it
            return NextResponse.json({
              success: true,
              audioUrl: fallbackUrl,
              videoUrl: null,
              format: 'mp3',
              title: 'Audio',
              duration: null,
              thumbnail: null,
              isHLS: fallbackUrl.includes('.m3u8'),
            });
          }
        } catch (fallbackError) {
          // Fallback extraction failed
        }
        
        // If all URL extraction methods fail, return error instead of trying server-side download
        // Server-side download requires ffmpeg which may not be available
        throw new Error('Could not extract audio URL. The video may be unavailable, private, or region-restricted. Please try a different video or check if the URL is correct.');
      } else {
        // For video, first try to get direct URL (faster)
        // Only use server-side download if it's HLS or direct URL fails
        let formatSelector = 'best[ext=mp4]/best';
        
        if (quality === 'high') {
          formatSelector = 'best[height<=1080][ext=mp4]/best[height<=1080]/best';
        } else if (quality === 'medium') {
          formatSelector = 'best[height<=720][ext=mp4]/best[height<=720]/best';
        } else if (quality === 'low') {
          formatSelector = 'worst[ext=mp4]/worst';
        }
        
        try {
          // Ultra-fast extraction with minimal processing
          // Use --skip-download and other flags to avoid any file operations
          // Reduce timeout to 8 seconds for faster failure
          const videoResult = await Promise.race([
            execAsync(
              `"${ytDlpPath}" -g --skip-download --no-playlist --no-warnings --quiet --no-check-certificate --prefer-insecure --no-cache-dir --no-mtime --no-write-thumbnail --no-write-info-json --no-write-description --no-write-annotations --no-write-sub --no-write-auto-sub --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" --referer "https://www.youtube.com/" --add-header "Accept-Language:en-US,en;q=0.9" -f "${formatSelector}" "${url}"`,
              { timeout: 8000, maxBuffer: 256 * 1024 } // 8 second timeout, 256KB buffer
            ),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Extraction timeout')), 8000)
            )
          ]).catch(() => ({ stdout: '' }));
          
          videoUrl = videoResult.stdout.trim().split('\n')[0];
          
          // Check if it's HLS - if so, we need server-side download
          const isHLS = videoUrl && videoUrl.includes('.m3u8');
          
          if (!isHLS && videoUrl && videoUrl.startsWith('http')) {
            // Return immediately - don't wait for anything else
            return NextResponse.json({
              success: true,
              videoUrl,
              audioUrl: null,
              format: 'mp4',
              quality,
              isHLS: false,
              title: 'Video',
              duration: null,
              thumbnail: null,
              width: null,
              height: null,
            });
          }
        } catch (urlError) {
          // URL extraction failed, will try server-side download
        }
        
        // HLS or URL extraction failed - use server-side download
        const tempDir = os.tmpdir();
        const tempFile = path.join(tempDir, `video_${Date.now()}.mp4`);
        
        try {
          // Set timeout for yt-dlp (90 seconds max for video)
          const downloadPromise = execAsync(
            `"${ytDlpPath}" -f "${formatSelector}" --recode-video mp4 --no-progress --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" --referer "https://www.youtube.com/" --add-header "Accept-Language:en-US,en;q=0.9" -o "${tempFile}" "${url}"`,
            { timeout: 90000, maxBuffer: 10 * 1024 * 1024 } // 90 second timeout, 10MB buffer
          );
          
          // Download and convert to MP4
          await downloadPromise;
          
          // Check if file exists
          if (!fs.existsSync(tempFile)) {
            throw new Error('Downloaded file not found');
          }
          
          // Read the downloaded file
          const videoBuffer = fs.readFileSync(tempFile);
          
          if (videoBuffer.length === 0) {
            throw new Error('Downloaded file is empty');
          }
          
          // Clean up temp file
          fs.unlinkSync(tempFile);
          
          // Get video info (don't wait if it fails)
          let videoInfo = {};
          try {
            const { stdout: infoStdout } = await execAsync(
              `"${ytDlpPath}" -j --no-playlist --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" --referer "https://www.youtube.com/" --add-header "Accept-Language:en-US,en;q=0.9" "${url}"`,
              { timeout: 10000 } // 10 second timeout for info
            );
            videoInfo = JSON.parse(infoStdout);
          } catch (infoError) {
            // Info extraction failed, but we have the file
            console.warn('Failed to get video info:', infoError.message);
          }
          
          // Return the video file directly
          return new NextResponse(videoBuffer, {
            headers: {
              'Content-Type': 'video/mp4',
              'Content-Disposition': `attachment; filename="${(videoInfo?.title || 'video').replace(/[^a-z0-9]/gi, '_')}.mp4"`,
            },
          });
        } catch (downloadError) {
          // Clean up temp file if it exists
          try {
            if (fs.existsSync(tempFile)) {
              fs.unlinkSync(tempFile);
            }
          } catch (cleanupError) {
            // Ignore cleanup errors
          }
          
          const errorMsg = downloadError.message || 'Unknown error';
          if (errorMsg.includes('timeout') || errorMsg.includes('ETIMEDOUT')) {
            throw new Error('Download timeout. The video might be too long or the connection is slow. Please try a shorter video or check your internet connection.');
          }
          throw new Error(`Failed to download video: ${errorMsg}`);
        }
      }
    } catch (error) {
      return NextResponse.json(
        {
          error: `Failed to extract media: ${error.message}`,
          suggestion: 'The content might be private, age-restricted, or unavailable. Ensure the URL is correct and the content is publicly accessible.'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to process download request' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check available formats and qualities
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Find yt-dlp executable
    const ytDlpPath = await findYtDlp();
    
    if (!ytDlpPath) {
      return NextResponse.json(
        {
          error: 'yt-dlp is not available',
          available: false
        },
        { status: 503 }
      );
    }

    // Get available formats
    const { stdout } = await execAsync(
      `"${ytDlpPath}" -j --no-playlist --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" --referer "https://www.youtube.com/" --add-header "Accept-Language:en-US,en;q=0.9" "${url}"`
    );
    
    const info = JSON.parse(stdout);
    
    return NextResponse.json({
      success: true,
      title: info.title || 'Unknown',
      duration: info.duration || null,
      thumbnail: info.thumbnail || null,
      formats: info.formats || [],
      available: true
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to get video info: ${error.message}`,
        available: false
      },
      { status: 500 }
    );
  }
}

