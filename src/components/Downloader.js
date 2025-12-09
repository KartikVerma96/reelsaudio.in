'use client';

import { useState, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { isValidInstagramReelUrl } from '../lib/ig-scraper';
import { getAllTranslations } from '../lib/translations';
import ShareButtons from './ShareButtons';
import AdSlot from './AdSlot';

export default function Downloader({ lang = 'en' }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [ffmpeg, setFfmpeg] = useState(null);
  const [progress, setProgress] = useState(0);
  const t = getAllTranslations(lang);

  useEffect(() => {
    loadFFmpeg();
    
    // Check if there's a pre-filled URL from trending page
    if (typeof window !== 'undefined') {
      const prefillUrl = sessionStorage.getItem('prefillReelUrl');
      if (prefillUrl) {
        setUrl(prefillUrl);
        sessionStorage.removeItem('prefillReelUrl');
        // Auto-scroll to input after a short delay
        setTimeout(() => {
          const input = document.querySelector('input[type="text"]');
          if (input) {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            input.focus();
          }
        }, 300);
      }
    }
  }, []);

  const loadFFmpeg = async () => {
    try {
      const ffmpegInstance = new FFmpeg();
      
      // Use the version that matches our package.json (@ffmpeg/core@0.12.10)
      // Try different CDN paths and formats
      const cdnSources = [
        // Standard unpkg path
        {
          coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js',
          wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm',
          name: 'unpkg standard'
        },
        // Alternative unpkg path
        {
          coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd/ffmpeg-core.js',
          wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd/ffmpeg-core.wasm',
          name: 'unpkg umd'
        },
        // jsdelivr standard
        {
          coreURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js',
          wasmURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm',
          name: 'jsdelivr standard'
        },
        // Fallback to 0.12.6
        {
          coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js',
          wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm',
          name: 'unpkg 0.12.6'
        }
      ];

      let loaded = false;
      let lastError = null;

      for (const source of cdnSources) {
        try {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Attempting to load FFmpeg from ${source.name}...`);
          }
          
          // Convert URLs to blob URLs for CORS compatibility
          const coreBlobURL = await toBlobURL(source.coreURL, 'text/javascript');
          const wasmBlobURL = await toBlobURL(source.wasmURL, 'application/wasm');
          
          await ffmpegInstance.load({
            coreURL: coreBlobURL,
            wasmURL: wasmBlobURL,
          });

          loaded = true;
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Successfully loaded FFmpeg from ${source.name}`);
          }
          break;
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`❌ Failed to load from ${source.name}:`, err.message || err);
          }
          lastError = err;
          // Continue to next source
        }
      }

      if (!loaded) {
        throw lastError || new Error('Failed to load FFmpeg from all CDN sources. Please check your internet connection and browser console for details.');
      }

      ffmpegInstance.on('log', ({ message }) => {
        if (process.env.NODE_ENV === 'development') {
        console.log('[FFmpeg]', message);
      }
      });

      ffmpegInstance.on('progress', ({ progress: p }) => {
        setProgress(Math.round(p * 100));
      });

      setFfmpeg(ffmpegInstance);
      setFfmpegLoaded(true);
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ FFmpeg initialized successfully');
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Failed to load FFmpeg:', err);
      }
      const errorMessage = err.message || 'Unknown error';
      const detailedError = err.stack || errorMessage;
      if (process.env.NODE_ENV === 'development') {
        console.error('Full error details:', detailedError);
      }
      
      // Check if WebAssembly is supported
      const wasmSupported = typeof WebAssembly !== 'undefined';
      let errorMsg = `Failed to initialize audio processor: ${errorMessage}.`;
      
      if (!wasmSupported) {
        errorMsg += ' Your browser does not support WebAssembly. Please use a modern browser like Chrome, Firefox, or Edge.';
      } else {
        errorMsg += ' Please check your internet connection, browser console (F12) for details, and try refreshing the page. If the issue persists, try a different browser or check FFMPEG_TROUBLESHOOTING.md for help.';
      }
      
      setError(errorMsg);
    }
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      setError(t.invalidUrl);
      return;
    }

    if (!isValidInstagramReelUrl(url)) {
      setError(t.invalidUrl);
      return;
    }

    if (!ffmpegLoaded || !ffmpeg) {
      setError('Audio processor is still loading. Please wait...');
      return;
    }

    setLoading(true);
    setError('');
    setAudioUrl(null);
    setAudioBlob(null);
    setProgress(0);

    try {
      // Step 1: Extract video URL using API route (server-side to avoid CORS)
      // Try multiple methods with retries
      let videoUrl;
      let lastError = null;
      
      // Try primary extraction method
      try {
        const extractResponse = await fetch('/api/extract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        if (!extractResponse.ok) {
          const errorData = await extractResponse.json().catch(() => ({ error: 'Failed to extract video URL' }));
          const errorMsg = errorData.error || `Server error: ${extractResponse.status}`;
          
          // Provide helpful suggestions based on error
          if (errorMsg.includes('private') || errorMsg.includes('Could not extract') || errorMsg.includes('Instagram')) {
            throw new Error(`${errorMsg}\n\n⚠️ Instagram frequently blocks scraping attempts.\n\nPossible Solutions:\n1. Ensure the reel is PUBLIC (not private)\n2. Copy the URL directly from Instagram\n3. Try a different reel\n4. Wait a few minutes and try again\n5. For production, consider using yt-dlp or a third-party API\n\nSee INSTAGRAM_SCRAPING_NOTE.md for alternative solutions.`);
          }
          
          throw new Error(errorMsg);
        }

        const data = await extractResponse.json();
        videoUrl = data.videoUrl;
        
        if (!videoUrl) {
          throw new Error('Could not extract video URL from Instagram');
        }
      } catch (fetchError) {
        lastError = fetchError;
        
        // If primary method fails, try yt-dlp fallback
        if (fetchError.message.includes('Could not extract') || fetchError.message.includes('404')) {
          try {
            console.log('Trying yt-dlp fallback...');
            const ytDlpResponse = await fetch('/api/extract-ytdlp', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ url }),
            });

            if (ytDlpResponse.ok) {
              const ytDlpData = await ytDlpResponse.json();
              if (ytDlpData.videoUrl) {
                videoUrl = ytDlpData.videoUrl;
                if (process.env.NODE_ENV === 'development') {
                  console.log('Successfully extracted via yt-dlp!');
                }
              } else {
                throw fetchError; // Use original error
              }
            } else {
              throw fetchError; // Use original error
            }
          } catch (ytDlpError) {
            // If yt-dlp also fails, throw original error
            throw fetchError;
          }
        } else {
          if (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('NetworkError')) {
            throw new Error('Network error: Unable to connect to Instagram. Please check your internet connection and try again.');
          }
          throw fetchError;
        }
      }

      // Step 2: Download video (try multiple methods)
      let videoData;
      let downloadSuccess = false;
      
      // Method 1: Try direct download
      try {
        videoData = await fetchFile(videoUrl);
        downloadSuccess = true;
        if (process.env.NODE_ENV === 'development') {
          console.log('Video downloaded directly');
        }
      } catch (directError) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Direct download failed, trying proxy...', directError.message);
        }
        
        // Method 2: Try proxy through API route (avoids CORS)
        try {
          if (process.env.NODE_ENV === 'development') {
            console.log('Attempting proxy download...');
          }
          const proxyResponse = await fetch('/api/proxy-video', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoUrl }),
          });

          if (!proxyResponse.ok) {
            const errorData = await proxyResponse.json().catch(() => ({ error: `Proxy failed with status ${proxyResponse.status}` }));
            if (process.env.NODE_ENV === 'development') {
              console.error('Proxy error:', errorData);
            }
            throw new Error(errorData.error || `Failed to download via proxy: ${proxyResponse.status}`);
          }

          // Check content type
          const contentType = proxyResponse.headers.get('content-type');
          if (process.env.NODE_ENV === 'development') {
            console.log('Proxy response content-type:', contentType);
          }

          // Convert response to blob then to Uint8Array for FFmpeg
          const blob = await proxyResponse.blob();
          if (process.env.NODE_ENV === 'development') {
            console.log('Blob size:', blob.size, 'bytes');
          }
          
          if (blob.size === 0) {
            throw new Error('Downloaded video file is empty');
          }

          const arrayBuffer = await blob.arrayBuffer();
          videoData = new Uint8Array(arrayBuffer);
          downloadSuccess = true;
          if (process.env.NODE_ENV === 'development') {
            console.log('Video downloaded via proxy, size:', videoData.length, 'bytes');
          }
        } catch (proxyError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Proxy download failed:', proxyError);
          }
          
          // Method 3: Try with CORS proxy (last resort)
          try {
            if (process.env.NODE_ENV === 'development') {
              console.log('Trying CORS proxy...');
            }
            const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(videoUrl)}`;
            videoData = await fetchFile(corsProxyUrl);
            downloadSuccess = true;
            if (process.env.NODE_ENV === 'development') {
              console.log('Video downloaded via CORS proxy');
            }
          } catch (corsError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('CORS proxy failed:', corsError);
            }
            throw new Error(`Failed to download video after trying all methods.\n\nPossible reasons:\n1. Video URL expired (Instagram URLs expire quickly)\n2. Video is private or requires authentication\n3. Instagram CDN is blocking requests\n4. Network/CORS restrictions\n\nTry:\n- Using a fresh reel URL\n- Ensuring the reel is PUBLIC\n- Installing yt-dlp for better reliability\n\nError details: ${corsError.message}`);
          }
        }
      }

      if (!downloadSuccess || !videoData) {
        throw new Error('Failed to download video. The video might be private, expired, or unavailable.');
      }
      
      // Step 3: Validate video data
      if (!videoData || (videoData instanceof Uint8Array && videoData.length === 0)) {
        throw new Error('Downloaded video file is empty. The video URL might be expired or invalid.');
      }

      // Step 4: Write video to FFmpeg filesystem
      try {
        await ffmpeg.writeFile('input.mp4', videoData);
        if (process.env.NODE_ENV === 'development') {
          console.log('Video written to FFmpeg filesystem');
        }
      } catch (writeError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('FFmpeg write error:', writeError);
        }
        throw new Error(`Failed to process video file: ${writeError.message}. The video format might not be supported.`);
      }

      // Step 5: Extract audio using FFmpeg
      try {
        await ffmpeg.exec([
          '-i', 'input.mp4',
          '-vn',
          '-acodec', 'libmp3lame',
          '-ab', '192k',
          '-ar', '44100',
          '-y',
          'output.mp3'
        ]);
        if (process.env.NODE_ENV === 'development') {
          console.log('Audio extraction completed');
        }
      } catch (ffmpegError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('FFmpeg extraction error:', ffmpegError);
        }
        throw new Error(`Failed to extract audio: ${ffmpegError.message}. The video might be corrupted or in an unsupported format.`);
      }

      // Step 5: Read audio file
      const audioData = await ffmpeg.readFile('output.mp3');
      
      // Step 6: Create blob and URL
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      setAudioBlob(audioBlob);
      setAudioUrl(audioUrl);

      // Cleanup
      await ffmpeg.deleteFile('input.mp4');
      await ffmpeg.deleteFile('output.mp3');

    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Download error:', err);
      }
      setError(err.message || 'Failed to download audio. Please try again.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleDownloadMp3 = () => {
    if (audioBlob) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `reels-audio-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenInCapCut = () => {
    if (audioBlob) {
      // CapCut deep link (may need adjustment based on actual CapCut URL scheme)
      window.open(`capcut://import?audio=${encodeURIComponent(audioUrl)}`, '_blank');
    }
  };

  const handleOpenInInShot = () => {
    if (audioBlob) {
      // InShot deep link (may need adjustment based on actual InShot URL scheme)
      window.open(`inshot://import?audio=${encodeURIComponent(audioUrl)}`, '_blank');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-slideUp">
      <div className="glass-card dark:glass-card-dark rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl hover-lift border-2 border-white/40 dark:border-gray-700/30 relative overflow-hidden">
        {/* Decorative gradient overlay - Instagram colors */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/15 to-pink-500/15 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/15 to-pink-500/15 rounded-full blur-3xl -z-0"></div>
        
        <div className="relative z-10 space-y-5 md:space-y-6">
          {/* Input Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-2xl blur-xl animate-pulse-slow"></div>
            <div className="relative flex items-center">
              <div className="absolute left-4 z-10">
                <svg className="w-6 h-6 text-orange-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t.inputPlaceholder}
                className="relative w-full pl-14 pr-6 py-5 rounded-2xl bg-white/95 dark:bg-gray-800/95 border-2 border-orange-300/50 dark:border-purple-700/50 focus:border-pink-500 dark:focus:border-pink-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base md:text-lg transition-all shadow-lg focus:shadow-xl focus:scale-[1.01]"
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleDownload()}
              />
            </div>
          </div>

          {/* FFmpeg Loading Indicator */}
          {!ffmpegLoaded && !error && (
            <div className="p-4 bg-blue-100/90 dark:bg-blue-900/40 border-2 border-blue-400 dark:border-blue-700 text-blue-800 dark:text-blue-200 rounded-2xl shadow-lg animate-fadeIn">
              <div className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="font-semibold">Initializing audio processor...</p>
              </div>
            </div>
          )}

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={loading || !ffmpegLoaded}
            className="relative w-full py-5 px-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
          >
            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{progress > 0 ? `${t.processing} ${progress}%` : t.downloading}</span>
                </>
              ) : !ffmpegLoaded ? (
                <>
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {t.downloadButton}
                </>
              )}
            </span>
          </button>

          {/* Progress Bar */}
          {loading && progress > 0 && (
            <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 h-3 rounded-full transition-all duration-300 shadow-lg relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 shimmer"></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-5 bg-red-100/90 dark:bg-red-900/40 border-2 border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-2xl shadow-lg animate-fadeIn backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="font-bold mb-2">{t.error}: {error}</p>
                  {error.includes('initialize') && (
                    <button
                      onClick={() => {
                        setError('');
                        setFfmpegLoaded(false);
                        loadFFmpeg();
                      }}
                      className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Retry Loading
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Success Section */}
          {audioUrl && audioBlob && (
            <div className="space-y-6 animate-fadeIn">
              {/* Success Banner */}
              <div className="relative p-5 bg-gradient-to-r from-green-100 via-emerald-100 to-green-100 dark:from-green-900/40 dark:via-emerald-900/40 dark:to-green-900/40 border-2 border-green-400 dark:border-green-600 text-green-800 dark:text-green-200 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse"></div>
                <div className="relative flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-7 h-7 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-lg md:text-xl">{t.success}</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Audio extracted successfully!</p>
                  </div>
                </div>
              </div>

              {/* Audio Player */}
              <div className="glass-card dark:glass-card-dark rounded-2xl p-5 md:p-6 shadow-xl border border-white/10 dark:border-gray-700/30">
                <div className="mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preview Audio</span>
                </div>
                <audio controls className="w-full rounded-xl" src={audioUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <button
                  onClick={handleDownloadMp3}
                  className="group py-4 px-4 md:px-5 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 relative overflow-hidden"
                >
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center justify-center gap-2 text-sm md:text-base">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {t.downloadMp3}
                  </span>
                </button>
                <button
                  onClick={handleOpenInCapCut}
                  className="group py-4 px-4 md:px-5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 relative overflow-hidden"
                >
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative text-sm md:text-base">{t.openInCapCut}</span>
                </button>
                <button
                  onClick={handleOpenInInShot}
                  className="group py-4 px-4 md:px-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 relative overflow-hidden"
                >
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative text-sm md:text-base">{t.openInInShot}</span>
                </button>
              </div>

              {/* Share Buttons */}
              <ShareButtons audioUrl={audioUrl} lang={lang} />
            </div>
          )}

          {/* Ad After Download Result - Only show if download was successful */}
          {audioUrl && audioBlob && (
            <div className="mt-6">
              <AdSlot position="bottom" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

