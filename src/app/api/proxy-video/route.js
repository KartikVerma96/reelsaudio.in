import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    if (!videoUrl.startsWith('http')) {
      return NextResponse.json(
        { error: 'Invalid video URL' },
        { status: 400 }
      );
    }

    try {
      // Fetching video from URL
      
      // Create AbortController for timeout
      // Vercel serverless functions have a max duration of 60s (or configured limit)
      const maxDuration = parseInt(process.env.VERCEL_FUNCTION_MAX_DURATION || '60') * 1000;
      const timeout = Math.min(maxDuration - 5000, 55000); // Leave 5s buffer
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Fetch video with proper headers
      const videoResponse = await fetch(videoUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.instagram.com/',
          'Origin': 'https://www.instagram.com',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'identity', // Don't compress, we need raw bytes
          'Sec-Fetch-Dest': 'video',
          'Sec-Fetch-Mode': 'no-cors',
          'Sec-Fetch-Site': 'cross-site',
        },
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      if (!videoResponse.ok) {
        const statusText = videoResponse.statusText || 'Unknown error';
        // Video fetch failed
        
        // Provide specific error messages
        if (videoResponse.status === 403) {
          return NextResponse.json(
            { error: 'Access forbidden. The video URL may have expired or Instagram is blocking the request. Try extracting a fresh URL.' },
            { status: 403 }
          );
        } else if (videoResponse.status === 404) {
          return NextResponse.json(
            { error: 'Video not found. The URL may have expired. Instagram video URLs expire quickly - try extracting a fresh URL.' },
            { status: 404 }
          );
        } else if (videoResponse.status === 429) {
          return NextResponse.json(
            { error: 'Too many requests. Instagram is rate-limiting. Please wait a few minutes and try again.' },
            { status: 429 }
          );
        }
        
        return NextResponse.json(
          { error: `Failed to download video: ${videoResponse.status} ${statusText}` },
          { status: videoResponse.status }
        );
      }

      // Check content type
      const contentType = videoResponse.headers.get('content-type');
      // Video content-type validated
      
      if (contentType && !contentType.includes('video') && !contentType.includes('octet-stream')) {
        // Might be an error page or redirect
        const text = await videoResponse.text();
        if (text.includes('error') || text.includes('Error') || text.length < 1000) {
          return NextResponse.json(
            { error: 'Received non-video content. The video URL may be invalid or expired.' },
            { status: 400 }
          );
        }
      }

      // Get video as array buffer
      const videoBuffer = await videoResponse.arrayBuffer();
      
      if (videoBuffer.byteLength === 0) {
        return NextResponse.json(
          { error: 'Downloaded video file is empty. The URL may be invalid.' },
          { status: 400 }
        );
      }

      // Video downloaded successfully
      
      // Return video buffer
      return new NextResponse(videoBuffer, {
        headers: {
          'Content-Type': contentType || 'video/mp4',
          'Content-Length': videoBuffer.byteLength.toString(),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    } catch (fetchError) {
      // Video fetch error
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout. The video file might be too large or the connection is slow.' },
          { status: 408 }
        );
      }
      
      return NextResponse.json(
        { error: `Failed to fetch video: ${fetchError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    // Proxy video error
    return NextResponse.json(
      { error: error.message || 'Failed to proxy video' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request) {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

