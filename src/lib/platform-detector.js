/**
 * Platform detection and URL validation utilities
 * Supports: Instagram Reels, Facebook Reels, YouTube Shorts
 */

export const PLATFORMS = {
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  YOUTUBE: 'youtube',
  UNKNOWN: 'unknown'
};

/**
 * Detect platform from URL
 */
export function detectPlatform(url) {
  if (!url || typeof url !== 'string') {
    return PLATFORMS.UNKNOWN;
  }

  const normalizedUrl = url.trim().toLowerCase();

  // Instagram Reels
  if (normalizedUrl.includes('instagram.com/reel/') || 
      normalizedUrl.includes('instagram.com/p/') ||
      normalizedUrl.includes('instagr.am/reel/') ||
      normalizedUrl.includes('instagr.am/p/')) {
    return PLATFORMS.INSTAGRAM;
  }

  // Facebook Reels
  if (normalizedUrl.includes('facebook.com/reel/') ||
      normalizedUrl.includes('facebook.com/watch/') ||
      normalizedUrl.includes('fb.com/reel/') ||
      normalizedUrl.includes('fb.com/watch/') ||
      normalizedUrl.includes('m.facebook.com/reel/') ||
      normalizedUrl.includes('m.facebook.com/watch/')) {
    return PLATFORMS.FACEBOOK;
  }

  // YouTube Shorts
  if (normalizedUrl.includes('youtube.com/shorts/') ||
      normalizedUrl.includes('youtu.be/') ||
      normalizedUrl.includes('youtube.com/watch?v=') ||
      normalizedUrl.includes('m.youtube.com/shorts/') ||
      normalizedUrl.includes('m.youtube.com/watch?v=')) {
    // Check if it's specifically a Shorts URL
    if (normalizedUrl.includes('/shorts/')) {
      return PLATFORMS.YOUTUBE;
    }
    // For regular YouTube videos, we can still support them
    if (normalizedUrl.includes('youtube.com/watch') || normalizedUrl.includes('youtu.be/')) {
      return PLATFORMS.YOUTUBE;
    }
  }

  return PLATFORMS.UNKNOWN;
}

/**
 * Validate URL for a specific platform
 */
export function isValidUrl(url, platform = null) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const detectedPlatform = platform || detectPlatform(url);

  switch (detectedPlatform) {
    case PLATFORMS.INSTAGRAM:
      return /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/(reel|p)\/[A-Za-z0-9_-]+\/?/.test(url.trim());
    
    case PLATFORMS.FACEBOOK:
      return /^https?:\/\/(www\.|m\.)?(facebook\.com|fb\.com)\/(reel|watch)\/[A-Za-z0-9_-]+\/?/.test(url.trim());
    
    case PLATFORMS.YOUTUBE:
      return /^https?:\/\/(www\.|m\.)?(youtube\.com\/shorts\/|youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]+/.test(url.trim());
    
    default:
      return false;
  }
}

/**
 * Get platform display name
 */
export function getPlatformName(platform) {
  switch (platform) {
    case PLATFORMS.INSTAGRAM:
      return 'Instagram';
    case PLATFORMS.FACEBOOK:
      return 'Facebook';
    case PLATFORMS.YOUTUBE:
      return 'YouTube';
    default:
      return 'Unknown';
  }
}

/**
 * Normalize URL (remove tracking params, etc.)
 */
export function normalizeUrl(url) {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url.trim());
    // Remove common tracking parameters
    const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid', 'ref'];
    paramsToRemove.forEach(param => urlObj.searchParams.delete(param));
    
    return urlObj.toString();
  } catch (e) {
    return url.trim();
  }
}

