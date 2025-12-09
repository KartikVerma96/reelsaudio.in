import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Extract reel ID from URL (support multiple formats)
    let reelId = null;
    const reelMatch = url.match(/\/reel\/([A-Za-z0-9_-]+)/);
    const postMatch = url.match(/\/p\/([A-Za-z0-9_-]+)/);
    
    if (reelMatch) {
      reelId = reelMatch[1];
    } else if (postMatch) {
      reelId = postMatch[1];
    }

    if (!reelId) {
      return NextResponse.json(
        { error: 'Invalid Instagram Reels URL. Please use a format like: https://www.instagram.com/reel/XXXXX/' },
        { status: 400 }
      );
    }

    let videoUrl = null;
    const cleanUrl = url.split('?')[0]; // Remove query params

    // Method 0: Try Instagram oEmbed API first
    try {
      const oEmbedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(cleanUrl)}`;
      const oEmbedResponse = await fetch(oEmbedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
      });

      if (oEmbedResponse.ok) {
        const oEmbedData = await oEmbedResponse.json();
        // oEmbed data received
      }
    } catch (oEmbedError) {
      // oEmbed failed, continuing with other methods
    }

    // Method 1: Try Instagram API endpoints with multiple variations
    const apiEndpoints = [
      `https://www.instagram.com/reel/${reelId}/?__a=1&__d=dis`,
      `https://www.instagram.com/p/${reelId}/?__a=1&__d=dis`,
      `https://www.instagram.com/api/v1/media/${reelId}/info/`,
      `https://www.instagram.com/graphql/query/?query_hash=2b0673e0dc4580674a88d4fe37ad0b7d&variables={"shortcode":"${reelId}"}`,
    ];

    for (const apiUrl of apiEndpoints) {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.instagram.com/',
            'X-Requested-With': 'XMLHttpRequest',
            'X-IG-App-ID': '936619743392459',
            'X-IG-WWW-Claim': '0',
          },
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            
            // Try multiple JSON structures
            videoUrl = 
              data?.items?.[0]?.video_versions?.[0]?.url ||
              data?.graphql?.shortcode_media?.video_url ||
              data?.graphql?.shortcode_media?.video_versions?.[0]?.url ||
              data?.items?.[0]?.carousel_media?.[0]?.video_versions?.[0]?.url ||
              data?.video_url ||
              data?.media?.video_versions?.[0]?.url ||
              data?.data?.shortcode_media?.video_url ||
              data?.data?.shortcode_media?.video_versions?.[0]?.url;

            if (videoUrl) {
              // Found video URL via API
              break;
            }
          }
        }
      } catch (apiError) {
        continue;
      }
    }

    // Method 2: Aggressive HTML scraping with multiple patterns
    if (!videoUrl) {
      try {
        const htmlResponse = await fetch(cleanUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.instagram.com/',
            'Origin': 'https://www.instagram.com',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0',
          },
        });

        if (htmlResponse.ok) {
          const html = await htmlResponse.text();
          // HTML received for parsing

          // Pattern 1: og:video meta tag
          const ogVideoMatch = html.match(/<meta\s+property=["']og:video["']\s+content=["']([^"']+)["']/i);
          if (ogVideoMatch && ogVideoMatch[1]) {
            videoUrl = ogVideoMatch[1];
            // Found via og:video
          }

          // Pattern 2: og:video:secure_url
          if (!videoUrl) {
            const ogVideoSecureMatch = html.match(/<meta\s+property=["']og:video:secure_url["']\s+content=["']([^"']+)["']/i);
            if (ogVideoSecureMatch && ogVideoSecureMatch[1]) {
              videoUrl = ogVideoSecureMatch[1];
              // Found via og:video:secure_url
            }
          }

          // Pattern 3: Extract from window._sharedData (multiple variations)
          if (!videoUrl) {
            const sharedDataPatterns = [
              /window\._sharedData\s*=\s*({[\s\S]*?});/,
              /window\.__additionalDataLoaded\s*\([^,]+,\s*({[\s\S]*?})\);/,
              /window\.__initialDataLoaded\s*\([^,]+,\s*({[\s\S]*?})\);/,
            ];

            for (const pattern of sharedDataPatterns) {
              const match = html.match(pattern);
              if (match) {
                try {
                  const data = JSON.parse(match[1]);
                  videoUrl = 
                    data?.entry_data?.PostPage?.[0]?.graphql?.shortcode_media?.video_url ||
                    data?.entry_data?.PostPage?.[0]?.graphql?.shortcode_media?.video_versions?.[0]?.url ||
                    data?.graphql?.shortcode_media?.video_url ||
                    data?.graphql?.shortcode_media?.video_versions?.[0]?.url ||
                    data?.items?.[0]?.video_versions?.[0]?.url;
                  
                  if (videoUrl) {
                    // Found via sharedData
                    break;
                  }
                } catch (e) {
                  continue;
                }
              }
            }
          }

          // Pattern 4: Extract from all script tags with JSON
          if (!videoUrl) {
            const scriptMatches = html.matchAll(/<script[^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/gi);
            for (const scriptMatch of scriptMatches) {
              try {
                const jsonContent = scriptMatch[1];
                if (jsonContent) {
                  const jsonData = JSON.parse(jsonContent);
                  
                  // Deep search in JSON structure
                  const findVideoUrl = (obj) => {
                    if (typeof obj !== 'object' || obj === null) return null;
                    if (typeof obj === 'string' && obj.includes('.mp4') && obj.includes('cdninstagram')) {
                      return obj;
                    }
                    if (obj.video_url) return obj.video_url;
                    if (obj.videoUrl) return obj.videoUrl;
                    if (obj.video_versions && Array.isArray(obj.video_versions) && obj.video_versions[0]?.url) {
                      return obj.video_versions[0].url;
                    }
                    for (const key in obj) {
                      const result = findVideoUrl(obj[key]);
                      if (result) return result;
                    }
                    return null;
                  };

                  videoUrl = findVideoUrl(jsonData);
                  if (videoUrl) {
                    // Found via JSON script tag
                    break;
                  }
                }
              } catch (e) {
                continue;
              }
            }
          }

          // Pattern 5: Aggressive regex search for video URLs
          if (!videoUrl) {
            const videoPatterns = [
              /"video_url"\s*:\s*"([^"]+)"/gi,
              /"videoUrl"\s*:\s*"([^"]+)"/gi,
              /"video_versions"\s*:\s*\[\s*\{\s*"url"\s*:\s*"([^"]+)"/gi,
              /https?:\/\/[^"'\s]+cdninstagram[^"'\s]+\.mp4[^"'\s]*/gi,
              /https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi,
            ];
            
            for (const pattern of videoPatterns) {
              const matches = html.matchAll(pattern);
              for (const match of matches) {
                const potentialUrl = match[1] || match[0];
                if (potentialUrl && 
                    potentialUrl.startsWith('http') && 
                    (potentialUrl.includes('.mp4') || potentialUrl.includes('cdninstagram') || potentialUrl.includes('video'))) {
                  videoUrl = potentialUrl.replace(/\\\//g, '/').replace(/\\u0026/g, '&');
                  // Found via aggressive regex
                  break;
                }
              }
              if (videoUrl) break;
            }
          }
        }
      } catch (htmlError) {
        // HTML scraping failed, trying other methods
      }
    }

    // Method 3: Try embed endpoint
    if (!videoUrl) {
      try {
        const embedUrl = `https://www.instagram.com/p/${reelId}/embed/`;
        const embedResponse = await fetch(embedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html',
          },
        });
        
        if (embedResponse.ok) {
          const embedHtml = await embedResponse.text();
          const embedVideoMatch = embedHtml.match(/<source[^>]*src=["']([^"']+)["']/i);
          if (embedVideoMatch && embedVideoMatch[1]) {
            videoUrl = embedVideoMatch[1];
            // Found via embed endpoint
          }
        }
      } catch (embedError) {
        // Ignore embed errors
      }
    }

    // Method 4: Try yt-dlp as fallback (only if available, won't work on Vercel serverless)
    if (!videoUrl) {
      try {
        // Use absolute URL for production
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                       process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                       request.nextUrl.origin;
        
        const ytDlpResponse = await fetch(`${baseUrl}/api/extract-ytdlp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: cleanUrl }),
        });

        if (ytDlpResponse.ok) {
          const ytDlpData = await ytDlpResponse.json();
          if (ytDlpData.videoUrl) {
            videoUrl = ytDlpData.videoUrl;
            // Found via yt-dlp fallback
          }
        }
      } catch (ytDlpError) {
        // yt-dlp fallback failed
      }
    }

    if (!videoUrl) {
      return NextResponse.json(
        { 
          error: 'Could not extract video URL after trying all methods. Instagram may be blocking requests or the reel is private.',
          debug: {
            reelId,
            url: cleanUrl,
            methodsTried: ['API endpoints', 'HTML scraping', 'Embed endpoint', 'yt-dlp fallback'],
            suggestion: '1. Ensure reel is PUBLIC\n2. Try installing yt-dlp: pip install yt-dlp\n3. Try a different reel\n4. Wait a few minutes and retry'
          }
        },
        { status: 404 }
      );
    }

    // Validate and clean video URL
    if (!videoUrl.startsWith('http')) {
      return NextResponse.json(
        { error: 'Invalid video URL extracted. Please try again.' },
        { status: 500 }
      );
    }

    // Clean up URL encoding
    videoUrl = videoUrl.replace(/\\\//g, '/').replace(/\\u0026/g, '&').replace(/\\u003D/g, '=');

    return NextResponse.json({ videoUrl });
  } catch (error) {
    // Error extracting reel URL
    return NextResponse.json(
      { error: error.message || 'Failed to extract video URL' },
      { status: 500 }
    );
  }
}
