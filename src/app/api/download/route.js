import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import os from 'os';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Get Node.js path for JS runtime
 */
async function getNodePath() {
  try {
    const { stdout } = await execAsync('which node', { timeout: 2000 });
    return stdout.trim();
  } catch (error) {
    return null;
  }
}

/**
 * Build yt-dlp command with JS runtime and anti-bot headers
 */
async function buildYtDlpCommand(ytDlpPath, baseArgs, url) {
  const nodePath = await getNodePath();
  const jsRuntimeFlag = nodePath ? `--js-runtimes node:${nodePath}` : '';
  
  // Rotating user agents to appear more human-like
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  ];
  const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  
  return `"${ytDlpPath}" ${jsRuntimeFlag} ${baseArgs} --user-agent "${userAgent}" --referer "https://www.youtube.com/" --add-header "Accept-Language:en-US,en;q=0.9" --add-header "Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" --add-header "Accept-Encoding:gzip, deflate, br" --add-header "DNT:1" --add-header "Connection:keep-alive" --add-header "Upgrade-Insecure-Requests:1" "${url}"`;
}

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

    try {
      let command;
      let videoUrl;
      let audioUrl;
      let videoInfo;

      if (format === 'mp3' || format === 'audio') {
        // Strategy: Try multiple approaches without cookies
        // 1. Try different player clients with JS runtime
        // 2. Try simpler format selectors
        // 3. Fallback to video URL extraction for client-side audio extraction
        
        const playerClients = ['ios', 'android', 'web', 'tv_embedded', 'mweb'];
        let audioUrl = null;
        
        // Try each player client with a small delay to avoid rate limiting
        for (let i = 0; i < playerClients.length; i++) {
          const client = playerClients[i];
          
          // Add delay between attempts (except first)
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          try {
            const baseArgs = `-g --skip-download --no-playlist --no-warnings --quiet --no-check-certificate --prefer-insecure --no-cache-dir --no-mtime --no-write-thumbnail --no-write-info-json --no-write-description --no-write-annotations --no-write-sub --no-write-auto-sub --extractor-args "youtube:player_client=${client}" -f "bestaudio/best"`;
            
            const command = await buildYtDlpCommand(ytDlpPath, baseArgs, url);
            
            const audioResult = await Promise.race([
              execAsync(command, { timeout: 15000, maxBuffer: 512 * 1024 }),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Extraction timeout')), 15000)
              )
            ]).catch((error) => {
              // Try next client
              return { stdout: '' };
            });
            
            audioUrl = audioResult.stdout.trim().split('\n')[0];
            
            // If we got a valid URL, break out of loop
            if (audioUrl && audioUrl.startsWith('http') && !audioUrl.includes('.m3u8')) {
              break;
            }
          } catch (clientError) {
            // Try next client
            continue;
          }
        }
          
        // If we got a valid URL from any client, return it
        if (audioUrl && audioUrl.startsWith('http')) {
          const isHLS = audioUrl.includes('.m3u8');
          
          if (!isHLS) {
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
          // If HLS, continue to fallback methods
        }
        
        // If all player clients failed, try simpler approach without player client args
        if (!audioUrl || !audioUrl.startsWith('http')) {
          try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay before fallback
            
            const baseArgs = `-g --skip-download --no-playlist --no-warnings --quiet --no-check-certificate --prefer-insecure --no-cache-dir -f "bestaudio/best"`;
            const command = await buildYtDlpCommand(ytDlpPath, baseArgs, url);
            
            const fallbackResult = await Promise.race([
              execAsync(command, { timeout: 12000, maxBuffer: 512 * 1024 }),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Fallback timeout')), 12000)
              )
            ]).catch((error) => {
              return { stdout: '' };
            });
            
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
            // Fallback extraction failed, continue to video URL extraction
          }
        }
        
        // If all audio URL extraction methods fail, try to get video URL for client-side extraction
        // This works even when audio formats are not directly available
        const videoFormatSelectors = ['best[height<=720]/best', 'best[height<=480]/best', 'worst'];
        const videoClients = ['ios', 'android', 'web', 'mweb'];
        let videoUrl = null;
        
        for (let i = 0; i < videoClients.length && !videoUrl; i++) {
          const client = videoClients[i];
          
          // Add delay between attempts
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          for (const formatSelector of videoFormatSelectors) {
            try {
              const baseArgs = `-g --skip-download --no-playlist --no-warnings --quiet --no-check-certificate --prefer-insecure --no-cache-dir --extractor-args "youtube:player_client=${client}" -f "${formatSelector}"`;
              const command = await buildYtDlpCommand(ytDlpPath, baseArgs, url);
              
              const videoUrlResult = await Promise.race([
                execAsync(command, { timeout: 15000, maxBuffer: 512 * 1024 }),
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Video URL extraction timeout')), 15000)
                )
              ]).catch(() => ({ stdout: '' }));
              
              const extractedUrl = videoUrlResult.stdout.trim().split('\n')[0];
              
              if (extractedUrl && extractedUrl.startsWith('http') && !extractedUrl.includes('.m3u8')) {
                videoUrl = extractedUrl;
                break; // Found a valid URL
              }
            } catch (formatError) {
              // Try next format selector
              continue;
            }
          }
        }
        
        if (videoUrl) {
          // Return video URL - client can extract audio using FFmpeg.wasm
          return NextResponse.json({
            success: true,
            audioUrl: null,
            videoUrl: videoUrl,
            format: 'mp3',
            title: 'Audio',
            duration: null,
            thumbnail: null,
            extractAudioFromVideo: true, // Flag to tell client to extract audio
          });
        }
        
        // If all extraction methods fail, return error
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
          const baseArgs = `-g --skip-download --no-playlist --no-warnings --quiet --no-check-certificate --prefer-insecure --no-cache-dir --no-mtime --no-write-thumbnail --no-write-info-json --no-write-description --no-write-annotations --no-write-sub --no-write-auto-sub -f "${formatSelector}"`;
          const command = await buildYtDlpCommand(ytDlpPath, baseArgs, url);
          
          const videoResult = await Promise.race([
            execAsync(command, { timeout: 10000, maxBuffer: 256 * 1024 }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Extraction timeout')), 10000)
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
          const baseArgs = `-f "${formatSelector}" --recode-video mp4 --no-progress -o "${tempFile}"`;
          const command = await buildYtDlpCommand(ytDlpPath, baseArgs, url);
          
          const downloadPromise = execAsync(
            command,
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
            const baseArgs = `-j --no-playlist`;
            const command = await buildYtDlpCommand(ytDlpPath, baseArgs, url);
            const { stdout: infoStdout } = await execAsync(command, { timeout: 10000 });
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
    const baseArgs = `-j --no-playlist`;
    const command = await buildYtDlpCommand(ytDlpPath, baseArgs, url);
    const { stdout } = await execAsync(command);
    
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

