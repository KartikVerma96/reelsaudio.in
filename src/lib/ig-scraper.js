/**
 * Instagram Reels URL extraction
 * Primary: Instagram API endpoint
 * Fallback: Meta tag scraping
 */

export async function extractReelUrl(reelUrl) {
  try {
    // Extract reel ID from URL
    const reelIdMatch = reelUrl.match(/\/reel\/([A-Za-z0-9_-]+)/);
    if (!reelIdMatch) {
      throw new Error('Invalid Instagram Reels URL');
    }
    
    const reelId = reelIdMatch[1];
    
    // Try primary method: Instagram API endpoint
    try {
      const apiUrl = `https://www.instagram.com/reel/${reelId}/?__a=1&__d=dis`;
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Navigate through Instagram's JSON structure
        if (data?.items?.[0]?.video_versions?.[0]?.url) {
          return data.items[0].video_versions[0].url;
        }
        
        // Alternative structure
        if (data?.graphql?.shortcode_media?.video_url) {
          return data.graphql.shortcode_media.video_url;
        }
      }
    } catch (apiError) {
      // API method failed, trying fallback
    }
    
    // Fallback: Scrape HTML for og:video meta tag
    const htmlResponse = await fetch(reelUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (htmlResponse.ok) {
      const html = await htmlResponse.text();
      
      // Try og:video meta tag
      const ogVideoMatch = html.match(/<meta\s+property="og:video"\s+content="([^"]+)"/i);
      if (ogVideoMatch && ogVideoMatch[1]) {
        return ogVideoMatch[1];
      }
      
      // Try og:video:secure_url
      const ogVideoSecureMatch = html.match(/<meta\s+property="og:video:secure_url"\s+content="([^"]+)"/i);
      if (ogVideoSecureMatch && ogVideoSecureMatch[1]) {
        return ogVideoSecureMatch[1];
      }
      
      // Try to find video URL in JSON-LD or script tags
      const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
      if (jsonLdMatch) {
        try {
          const jsonData = JSON.parse(jsonLdMatch[1]);
          if (jsonData?.video?.contentUrl) {
            return jsonData.video.contentUrl;
          }
        } catch (e) {
          // Ignore JSON parse errors
        }
      }
      
      // Try to extract from window._sharedData or similar
      const sharedDataMatch = html.match(/window\._sharedData\s*=\s*({[\s\S]*?});/);
      if (sharedDataMatch) {
        try {
          const sharedData = JSON.parse(sharedDataMatch[1]);
          const videoUrl = sharedData?.entry_data?.PostPage?.[0]?.graphql?.shortcode_media?.video_url;
          if (videoUrl) {
            return videoUrl;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
    
    throw new Error('Could not extract video URL');
  } catch (error) {
    // Error extracting reel URL
    throw error;
  }
}

export function isValidInstagramReelUrl(url) {
  const patterns = [
    /^https?:\/\/(www\.)?instagram\.com\/reel\/[A-Za-z0-9_-]+\/?/,
    /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?/,
  ];
  
  return patterns.some(pattern => pattern.test(url));
}

