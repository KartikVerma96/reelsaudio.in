import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import os from 'os';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Check if cookies file exists and return cookie flag
 * In standalone mode, process.cwd() is .next/standalone, so we need to go up to project root
 */
function getCookiesFlag() {
  // Try multiple possible locations (check absolute path first for reliability)
  const possiblePaths = [
    '/var/www/freereelsdownload/cookies.txt', // Absolute path (most reliable)
    path.join(process.cwd(), '..', '..', 'cookies.txt'), // Two levels up from standalone
    path.join(process.cwd(), '..', 'cookies.txt'), // One level up from standalone
    path.join(process.cwd(), 'cookies.txt'), // Current directory
  ];
  
  for (const cookiesPath of possiblePaths) {
    try {
      const resolvedPath = path.resolve(cookiesPath);
      if (fs.existsSync(resolvedPath)) {
        return `--cookies "${resolvedPath}"`;
      }
    } catch (error) {
      // Continue to next path
      continue;
    }
  }
  
  return '';
}

/**
 * Get Node.js path for JS runtime
 * Tries multiple common locations
 */
async function getNodePath() {
  const possiblePaths = ['/usr/bin/node', '/usr/local/bin/node', '/bin/node'];
  
  for (const nodePath of possiblePaths) {
    try {
      await execAsync(`${nodePath} --version`, { timeout: 2000 });
      return nodePath;
    } catch (error) {
      continue;
    }
  }
  
  // Fallback: try which command
  try {
    const { stdout } = await execAsync('which node', { timeout: 2000 });
    const path = stdout.trim();
    if (path) {
      await execAsync(`${path} --version`, { timeout: 2000 });
      return path;
    }
  } catch (error) {
    // Ignore
  }
  
  return null;
}

/**
 * Build yt-dlp command with JS runtime and anti-bot headers
 */
async function buildYtDlpCommand(ytDlpPath, baseArgs, url) {
  const nodePath = await getNodePath();
  // Always try to use JS runtime if Node.js is available
  const jsRuntimeFlag = nodePath ? `--js-runtimes node:${nodePath}` : '';
  
  // Get cookies flag if cookies.txt exists
  const cookiesFlag = getCookiesFlag();
  
  // Use consistent mobile user agent (iOS works best with YouTube)
  const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
  
  const command = `"${ytDlpPath}" ${jsRuntimeFlag} ${cookiesFlag} ${baseArgs} --user-agent "${userAgent}" --referer "https://www.youtube.com/" --add-header "Accept-Language:en-US,en;q=0.9" --add-header "Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" --add-header "Accept-Encoding:gzip, deflate, br" --add-header "DNT:1" --add-header "Connection:keep-alive" --add-header "Upgrade-Insecure-Requests:1" "${url}"`;
  
  // Log command in development (without sensitive info)
  if (process.env.NODE_ENV === 'development') {
    console.log('yt-dlp command:', command.replace(/--js-runtimes[^"]+/, '--js-runtimes [HIDDEN]').replace(/--cookies[^"]+/, '--cookies [HIDDEN]'));
  }
  
  return command;
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
        // Strategy: Try simple approach first (works best with cookies), then player clients
        // 1. Try simple extraction without player client args (what worked in direct test)
        // 2. Try different player clients if simple approach fails
        // 3. Fallback to video URL extraction for client-side audio extraction
        
        let audioUrl = null;
        let lastError = null;
        
        // FIRST: Try simple approach without player client args (this worked in direct test)
        try {
          // Remove --quiet flag to see what yt-dlp outputs
          const baseArgs = `-g --skip-download --no-playlist --no-warnings --no-check-certificate --prefer-insecure --no-cache-dir -f "bestaudio/best"`;
          const command = await buildYtDlpCommand(ytDlpPath, baseArgs, url);

          // Log the exact command being executed
          console.log('Executing simple extraction command:', command);

          const simpleResult = await Promise.race([
            execAsync(command, { timeout: 30000, maxBuffer: 2048 * 1024 }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Simple extraction timeout')), 30000)
            )
          ]).catch((error) => {
            const errorMsg = error.message || error.toString();
            const stderr = error.stderr || '';
            const stdout = error.stdout || '';

            // Log the actual error for debugging
            console.error('Simple extraction failed:', errorMsg);
            if (stderr) console.error('stderr:', stderr.substring(0, 1000));
            if (stdout) console.error('stdout:', stdout.substring(0, 1000));

            lastError = errorMsg;
            return { stdout: stdout || '', stderr: stderr || errorMsg };
          });

          audioUrl = simpleResult.stdout.trim().split('\n')[0];

          // Log what we got
          console.log('Simple extraction stdout length:', simpleResult.stdout?.length || 0);
          if (audioUrl) {
            console.log('Simple extraction result starts with:', audioUrl.substring(0, 50));
          } else {
            console.log('No audio URL returned. Full stdout:', simpleResult.stdout);
            console.log('Full stderr:', simpleResult.stderr);
          }

          // If we got a valid URL (including HLS), return it immediately
          if (audioUrl && audioUrl.startsWith('http')) {
            const isHLS = audioUrl.includes('.m3u8');
            console.log('SUCCESS: Returning audio URL, isHLS:', isHLS);
            return NextResponse.json({
              success: true,
              audioUrl: isHLS ? null : audioUrl,
              videoUrl: isHLS ? audioUrl : null,
              format: 'mp3',
              title: 'Audio',
              duration: null,
              thumbnail: null,
              extractAudioFromVideo: isHLS,
              isHLS: isHLS,
            });
          } else {
            console.log('Simple extraction did not return valid URL. Trying fallback...');
          }
        } catch (simpleError) {
          console.error('Simple extraction exception:', simpleError.message);
          lastError = simpleError.message || simpleError.toString();
        }
        
        // SECOND: If simple approach failed, try player clients
        if (!audioUrl || !audioUrl.startsWith('http')) {
          const playerClients = ['ios', 'android', 'web'];
          
          for (let i = 0; i < playerClients.length; i++) {
            const client = playerClients[i];
            
            if (i > 0) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            try {
              const baseArgs = `-g --skip-download --no-playlist --no-warnings --no-check-certificate --prefer-insecure --no-cache-dir --no-mtime --no-write-thumbnail --no-write-info-json --no-write-description --no-write-annotations --no-write-sub --no-write-auto-sub --extractor-args "youtube:player_client=${client}" -f "bestaudio/best"`;
              const command = await buildYtDlpCommand(ytDlpPath, baseArgs, url);
              
              const audioResult = await Promise.race([
                execAsync(command, { timeout: 15000, maxBuffer: 512 * 1024 }),
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Extraction timeout')), 15000)
                )
              ]).catch((error) => {
                lastError = error.message || error.toString();
                return { stdout: '', stderr: error.message || '' };
              });
              
              audioUrl = audioResult.stdout.trim().split('\n')[0];
              
              if (audioUrl && audioUrl.startsWith('http')) {
                const isHLS = audioUrl.includes('.m3u8');
                return NextResponse.json({
                  success: true,
                  audioUrl: isHLS ? null : audioUrl,
                  videoUrl: isHLS ? audioUrl : null,
                  format: 'mp3',
                  title: 'Audio',
                  duration: null,
                  thumbnail: null,
                  extractAudioFromVideo: isHLS,
                  isHLS: isHLS,
                });
              }
            } catch (clientError) {
              lastError = clientError.message || clientError.toString();
              continue;
            }
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
              // Try with different player clients to bypass restrictions
              const baseArgs = `-g --skip-download --no-playlist --no-warnings --no-check-certificate --prefer-insecure --no-cache-dir --extractor-args "youtube:player_client=${client}" -f "${formatSelector}"`;
              const command = await buildYtDlpCommand(ytDlpPath, baseArgs, url);
              
              const videoUrlResult = await Promise.race([
                execAsync(command, { timeout: 15000, maxBuffer: 512 * 1024 }),
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Video URL extraction timeout')), 15000)
                )
              ]).catch((error) => {
                // Capture both stdout and stderr from error
                const errorMsg = error.message || error.toString();
                const stderr = error.stderr || '';
                const stdout = error.stdout || '';
                
                // Log error in development
                if (process.env.NODE_ENV === 'development') {
                  console.error(`yt-dlp video URL error for client ${client}, format ${formatSelector}:`, errorMsg);
                  if (stderr) console.error('stderr:', stderr.substring(0, 500));
                  if (stdout) console.error('stdout:', stdout.substring(0, 500));
                }
                
                lastError = errorMsg;
                
                // Check if it's a bot detection error
                if (errorMsg.includes('Sign in to confirm') || errorMsg.includes('LOGIN_REQUIRED') || 
                    stderr.includes('Sign in to confirm') || stderr.includes('LOGIN_REQUIRED')) {
                  lastError = 'YouTube is requiring authentication for this video';
                }
                
                return { stdout: stdout || '', stderr: stderr || errorMsg };
              });
              
              const extractedUrl = videoUrlResult.stdout.trim().split('\n')[0];
              
              // Check stderr for bot detection errors
              if (videoUrlResult.stderr && (videoUrlResult.stderr.includes('Sign in to confirm') || videoUrlResult.stderr.includes('LOGIN_REQUIRED'))) {
                lastError = 'YouTube is requiring authentication for this video';
                continue; // Try next format/client
              }
              
              // Log success in development
              if (process.env.NODE_ENV === 'development' && extractedUrl && extractedUrl.startsWith('http')) {
                console.log(`Successfully extracted video URL using client ${client}, format ${formatSelector}`);
              }
              
              // Accept HLS URLs too - client can extract audio from them
              if (extractedUrl && extractedUrl.startsWith('http')) {
                videoUrl = extractedUrl;
                break; // Found a valid URL
              }
            } catch (formatError) {
              lastError = formatError.message || formatError.toString();
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
        
        // If all extraction methods fail, return detailed error
        // Log last error for debugging
        if (process.env.NODE_ENV === 'development') {
          console.error('All extraction methods failed. Last error:', lastError);
        }
        
        const errorMessage = lastError && (lastError.includes('Sign in to confirm') || lastError.includes('LOGIN_REQUIRED'))
          ? 'This video requires authentication or is age-restricted. YouTube is blocking automated access. Please try a different public video or use cookies for authentication.'
          : lastError || 'Could not extract audio URL. The video may be unavailable, private, age-restricted, or region-restricted. Please try a different video or check if the URL is correct.';
        
        throw new Error(errorMessage);
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
          const baseArgs = `-g --skip-download --no-playlist --no-warnings --no-check-certificate --prefer-insecure --no-cache-dir --no-mtime --no-write-thumbnail --no-write-info-json --no-write-description --no-write-annotations --no-write-sub --no-write-auto-sub -f "${formatSelector}"`;
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

