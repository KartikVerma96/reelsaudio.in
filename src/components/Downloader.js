'use client';

import { useState, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { detectPlatform, isValidUrl, normalizeUrl, getPlatformName, PLATFORMS } from '../lib/platform-detector';
import { getAllTranslations } from '../lib/translations';
import ShareButtons from './ShareButtons';
import toast from 'react-hot-toast';
import { SuccessIcon, DownloadIcon, AudioIcon } from './ToastIcons';
import AdSlot from './AdSlot';

export default function Downloader({ lang = 'en' }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState('mp3'); // 'mp3' or 'mp4'
  const [videoQuality, setVideoQuality] = useState('best'); // 'best', 'high', 'medium', 'low'
  const [detectedPlatform, setDetectedPlatform] = useState(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [ffmpeg, setFfmpeg] = useState(null);
  const [progress, setProgress] = useState(0);
  const t = getAllTranslations(lang);

  useEffect(() => {
    // Load FFmpeg lazily in the background - don't block UI
    const loadFFmpegLazy = () => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => loadFFmpeg(), { timeout: 2000 });
      } else {
        setTimeout(() => loadFFmpeg(), 100);
      }
    };
    
    loadFFmpegLazy();
    
    // Check if there's a pre-filled URL
    if (typeof window !== 'undefined') {
      const prefillUrl = sessionStorage.getItem('prefillReelUrl');
      if (prefillUrl) {
        setUrl(prefillUrl);
        sessionStorage.removeItem('prefillReelUrl');
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

  // Detect platform when URL changes
  useEffect(() => {
    if (url.trim()) {
      const normalizedUrl = normalizeUrl(url);
      const platform = detectPlatform(normalizedUrl);
      setDetectedPlatform(platform);
    } else {
      setDetectedPlatform(null);
    }
  }, [url]);

  const loadFFmpeg = async () => {
    try {
      const ffmpegInstance = new FFmpeg();
      
      const cdnSources = [
        {
          coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js',
          wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm',
          name: 'unpkg standard'
        },
        {
          coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd/ffmpeg-core.js',
          wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd/ffmpeg-core.wasm',
          name: 'unpkg umd'
        },
        {
          coreURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js',
          wasmURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm',
          name: 'jsdelivr standard'
        },
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
        }
      }

      if (!loaded) {
        throw lastError || new Error('Failed to load FFmpeg from all CDN sources.');
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
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Failed to load FFmpeg:', err);
      }
      const errorMessage = err.message || 'Unknown error';
      const wasmSupported = typeof WebAssembly !== 'undefined';
      let errorMsg = `Failed to initialize audio processor: ${errorMessage}.`;
      
      if (!wasmSupported) {
        errorMsg += ' Your browser does not support WebAssembly. Please use a modern browser.';
      }
      
      toast.error(errorMsg, { duration: 8000 });
      setError('');
    }
  };

  const handleDownload = async () => {
    const normalizedUrl = normalizeUrl(url);
    
    if (!normalizedUrl.trim()) {
      toast.error(t.invalidUrl || 'Please enter a valid link');
      return;
    }

    const platform = detectPlatform(normalizedUrl);
    if (!isValidUrl(normalizedUrl, platform) || platform === PLATFORMS.UNKNOWN) {
      toast.error(t.invalidUrl || 'Invalid URL. Please enter Instagram Reels, Facebook Reels, or YouTube Shorts link.');
      return;
    }

    // Show immediate feedback
    const initialToast = toast.loading('Preparing download...', { duration: Infinity });
    
    try {
      // For video downloads, we can use the unified API
      if (downloadFormat === 'mp4') {
        toast.dismiss(initialToast);
        await handleVideoDownload(normalizedUrl, platform);
        return;
      }

      // For audio downloads, use FFmpeg (only needed for Instagram, others can use API)
      if (platform === PLATFORMS.INSTAGRAM) {
        toast.dismiss(initialToast);
        await handleAudioDownloadInstagram(normalizedUrl);
      } else {
        // For Facebook and YouTube, use the unified API
        toast.dismiss(initialToast);
        await handleAudioDownloadAPI(normalizedUrl);
      }
    } catch (error) {
      toast.dismiss(initialToast);
      throw error;
    }
  };

  const handleVideoDownload = async (normalizedUrl, platform) => {
    const processingToast = toast.loading('Extracting video URL...', { duration: Infinity });
    setLoading(true);
    setError('');
    setVideoUrl(null);
    setVideoBlob(null);
    setProgress(0);
    
    // Update message after 3 seconds if still loading
    let progressUpdate = setTimeout(() => {
      toast.loading('Still extracting...', { id: processingToast });
    }, 3000);
    
    // Update again after 6 seconds if still loading
    let progressUpdate2 = setTimeout(() => {
      toast.loading('This may take a moment...', { id: processingToast });
    }, 6000);

    let response;
    let timeoutId;
    
    try {
      // Add timeout to prevent hanging (100 seconds for video)
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 100000);
      
      response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: normalizedUrl,
          format: 'mp4',
          quality: videoQuality,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      clearTimeout(progressUpdate);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to download video' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      // Check if response is a file (video/mp4) or JSON
      const contentType = response.headers.get('content-type');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Video download response contentType:', contentType);
      }
      
      if (contentType && contentType.includes('video/mp4')) {
        // Direct file download - yt-dlp downloaded and converted it server-side
        toast.loading('Receiving video file...', { id: processingToast });
        
        // Track download progress
        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        const reader = response.body.getReader();
        const chunks = [];
        let received = 0;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          chunks.push(value);
          received += value.length;
          
          // Update progress
          if (total > 0) {
            const percent = Math.round((received / total) * 100);
            setProgress(percent);
            toast.loading(`Receiving video file... ${percent}%`, { id: processingToast });
          } else {
            // Show indeterminate progress
            toast.loading('Receiving video file...', { id: processingToast });
          }
        }
        
        const videoBlobData = new Blob(chunks, { type: 'video/mp4' });
        const videoBlobUrl = URL.createObjectURL(videoBlobData);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Video blob created:', {
            size: videoBlobData.size,
            type: videoBlobData.type,
            url: videoBlobUrl
          });
        }
        
        setVideoBlob(videoBlobData);
        setVideoUrl(videoBlobUrl);
        
        toast.dismiss(processingToast);
        toast.success('Video ready for download!', {
          duration: 5000,
          icon: <SuccessIcon />,
        });
      } else {
        // JSON response with URL - need to download separately
        const data = await response.json();
        
        if (!data.videoUrl) {
          throw new Error('Video URL not found in response');
        }

        // Check if it's HLS - if so, we can't download it directly
        if (data.isHLS) {
          throw new Error('HLS playlists require server-side download. Please try again or use a different quality setting.');
        }

        // Update toast message
        toast.loading('Downloading video...', { id: processingToast });
        
        // Download the video
        const videoResponse = await fetch('/api/proxy-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoUrl: data.videoUrl }),
        });

        if (!videoResponse.ok) {
          throw new Error('Failed to download video file');
        }

        const videoBlobData = await videoResponse.blob();
        const videoBlobUrl = URL.createObjectURL(videoBlobData);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Video blob from proxy:', {
            size: videoBlobData.size,
            type: videoBlobData.type,
            url: videoBlobUrl
          });
        }

        setVideoBlob(videoBlobData);
        setVideoUrl(videoBlobUrl);

        toast.dismiss(processingToast);
        toast.success('Video ready for download!', {
          duration: 5000,
          icon: <SuccessIcon />,
        });
      }
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(progressUpdate);
      clearTimeout(progressUpdate2);
      toast.dismiss(processingToast);
      
      if (err.name === 'AbortError') {
        toast.error('Request timeout. The download is taking too long. Please try a shorter video or check your connection.', { duration: 8000 });
      } else {
        const errorMessage = err.message || 'Failed to download video. Please try again.';
        toast.error(errorMessage, { duration: 6000 });
      }
      setError('');
    } finally {
      clearTimeout(progressUpdate);
      clearTimeout(progressUpdate2);
      setLoading(false);
      setProgress(0);
    }
  };

  const handleAudioDownloadAPI = async (normalizedUrl) => {
    const processingToast = toast.loading('Extracting audio URL...', { duration: Infinity });
    setLoading(true);
    setError('');
    setAudioUrl(null);
    setAudioBlob(null);
    setProgress(0);
    
    // Update message after 3 seconds if still loading
    let progressUpdate = setTimeout(() => {
      toast.loading('Still extracting...', { id: processingToast });
    }, 3000);
    
    // Update again after 6 seconds if still loading
    let progressUpdate2 = setTimeout(() => {
      toast.loading('This may take a moment...', { id: processingToast });
    }, 6000);

    let response;
    let timeoutId;
    
    try {
      // Add timeout to prevent hanging (70 seconds)
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 70000);
      
      response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: normalizedUrl,
          format: 'mp3',
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      clearTimeout(progressUpdate);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to download audio' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      // Check if response is a file (audio/mpeg) or JSON
      const contentType = response.headers.get('content-type');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Audio download response contentType:', contentType);
      }
      
      if (contentType && contentType.includes('audio/mpeg')) {
        // Direct file download - yt-dlp downloaded and converted it
        // Track download progress
        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        const reader = response.body.getReader();
        const chunks = [];
        let received = 0;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          chunks.push(value);
          received += value.length;
          
          // Update progress
          if (total > 0) {
            const percent = Math.round((received / total) * 100);
            setProgress(percent);
            toast.loading(`Downloading audio... ${percent}%`, { id: processingToast });
          }
        }
        
        const audioBlobData = new Blob(chunks, { type: 'audio/mpeg' });
        const audioBlobUrl = URL.createObjectURL(audioBlobData);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Audio blob created:', {
            size: audioBlobData.size,
            type: audioBlobData.type,
            url: audioBlobUrl
          });
        }
        
        setAudioBlob(audioBlobData);
        setAudioUrl(audioBlobUrl);
        
        toast.dismiss(processingToast);
        toast.success('Audio ready for download!', {
          duration: 5000,
          icon: <AudioIcon />,
        });
      } else {
        // JSON response with URL - need to download separately
        const data = await response.json();
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Audio API response:', data);
        }
        
        if (!data.audioUrl) {
          throw new Error('Audio URL not found in response');
        }

        // Check if URL is valid
        if (!data.audioUrl.startsWith('http')) {
          throw new Error(`Invalid audio URL: ${data.audioUrl}`);
        }

        // Check if it's HLS - HLS playlists need special handling
        if (data.isHLS || data.audioUrl.includes('.m3u8')) {
          throw new Error('This video uses HLS streaming which requires server-side processing. Please try downloading as MP4 video instead, or the video may not be available for audio-only download.');
        }

        // Update toast message
        toast.loading('Downloading audio file...', { id: processingToast });
        
        // Download the audio
        const audioResponse = await fetch('/api/proxy-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoUrl: data.audioUrl }),
        });

        if (!audioResponse.ok) {
          const errorText = await audioResponse.text().catch(() => 'Unknown error');
          if (process.env.NODE_ENV === 'development') {
            console.error('Proxy audio error:', errorText);
          }
          throw new Error(`Failed to download audio file: ${audioResponse.status} ${errorText}`);
        }

        const audioBlobData = await audioResponse.blob();
        
        // Check if blob is empty
        if (audioBlobData.size === 0) {
          throw new Error('Downloaded audio file is empty. The URL may have expired.');
        }
        
        // Ensure correct MIME type for audio
        const audioType = audioBlobData.type || 'audio/mp4';
        const finalBlob = new Blob([audioBlobData], { type: audioType });
        const audioBlobUrl = URL.createObjectURL(finalBlob);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Audio blob from proxy:', {
            size: finalBlob.size,
            type: finalBlob.type,
            originalType: audioBlobData.type,
            url: audioBlobUrl
          });
        }

        setAudioBlob(finalBlob);
        setAudioUrl(audioBlobUrl);

        toast.dismiss(processingToast);
        toast.success('Audio ready for download!', {
          duration: 5000,
          icon: <AudioIcon />,
        });
      }
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(progressUpdate);
      clearTimeout(progressUpdate2);
      toast.dismiss(processingToast);
      
      if (err.name === 'AbortError') {
        toast.error('Request timeout. The download is taking too long. Please try a shorter video or check your connection.', { duration: 8000 });
      } else {
        const errorMessage = err.message || 'Failed to download audio. Please try again.';
        toast.error(errorMessage, { duration: 6000 });
      }
      setError('');
    } finally {
      clearTimeout(progressUpdate);
      clearTimeout(progressUpdate2);
      setLoading(false);
      setProgress(0);
    }
  };

  const handleAudioDownloadInstagram = async (normalizedUrl) => {
    // If FFmpeg is not loaded yet, wait for it
    if (!ffmpegLoaded || !ffmpeg) {
      const loadingToast = toast.loading('Initializing audio processor...');
      setLoading(true);
      let attempts = 0;
      const maxAttempts = 20;
      while (!ffmpegLoaded && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
      if (!ffmpegLoaded || !ffmpeg) {
        setLoading(false);
        toast.dismiss(loadingToast);
        toast.error('Audio processor failed to load. Please refresh the page.');
        return;
      }
      toast.dismiss(loadingToast);
      toast.success('Audio processor ready!', { icon: <SuccessIcon /> });
    }

    const processingToast = toast.loading('Processing your request...', { duration: Infinity });
    setLoading(true);
    setError('');
    setAudioUrl(null);
    setAudioBlob(null);
    setProgress(0);

    try {
      // Extract video URL using API route
      let videoUrl;
      try {
        const extractResponse = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: normalizedUrl }),
        });

        if (!extractResponse.ok) {
          const errorData = await extractResponse.json().catch(() => ({ error: 'Failed to extract video URL' }));
          throw new Error(errorData.error || `Server error: ${extractResponse.status}`);
        }

        const data = await extractResponse.json();
        videoUrl = data.videoUrl;
        
        if (!videoUrl) {
          throw new Error('Could not extract video URL');
        }
      } catch (fetchError) {
        // Try yt-dlp fallback
        try {
          const ytDlpResponse = await fetch('/api/extract-ytdlp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: normalizedUrl }),
          });

          if (ytDlpResponse.ok) {
            const ytDlpData = await ytDlpResponse.json();
            if (ytDlpData.videoUrl) {
              videoUrl = ytDlpData.videoUrl;
            } else {
              throw fetchError;
            }
          } else {
            throw fetchError;
          }
        } catch (ytDlpError) {
          throw fetchError;
        }
      }

      // Download video
      let videoData;
      try {
        videoData = await fetchFile(videoUrl);
      } catch (directError) {
        try {
          const proxyResponse = await fetch('/api/proxy-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoUrl }),
          });

          if (!proxyResponse.ok) {
            throw new Error('Failed to download video');
          }

          const blob = await proxyResponse.blob();
          if (blob.size === 0) {
            throw new Error('Downloaded video file is empty');
          }

          const arrayBuffer = await blob.arrayBuffer();
          videoData = new Uint8Array(arrayBuffer);
        } catch (proxyError) {
          throw new Error('Failed to download video after trying all methods.');
        }
      }

      // Write video to FFmpeg filesystem
      await ffmpeg.writeFile('input.mp4', videoData);

      // Extract audio using FFmpeg
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-vn',
        '-acodec', 'libmp3lame',
        '-ab', '192k',
        '-ar', '44100',
        '-y',
        'output.mp3'
      ]);

      // Read audio file
      const audioData = await ffmpeg.readFile('output.mp3');
      
      // Create blob and URL
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      setAudioBlob(audioBlob);
      setAudioUrl(audioUrl);

      // Cleanup
      await ffmpeg.deleteFile('input.mp4');
      await ffmpeg.deleteFile('output.mp3');

      toast.dismiss(processingToast);
      toast.success('Audio extracted successfully!', {
        duration: 5000,
        icon: <AudioIcon />,
      });
    } catch (err) {
      toast.dismiss(processingToast);
      const errorMessage = err.message || 'Failed to download audio. Please try again.';
      toast.error(errorMessage, { duration: 6000 });
      setError('');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleDownloadMp3 = () => {
    if (!audioBlob || !audioUrl) {
      toast.error('Audio not ready. Please wait for processing to complete.');
      if (process.env.NODE_ENV === 'development') {
        console.error('Download MP3 failed:', { 
          audioBlob: !!audioBlob, 
          audioUrl: !!audioUrl,
          audioBlobSize: audioBlob?.size,
          audioBlobType: audioBlob?.type
        });
      }
      return;
    }
    
    // Validate blob
    if (audioBlob.size === 0) {
      toast.error('Audio file is empty. Please try downloading again.');
      return;
    }
    
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Starting MP3 download:', { 
          blobSize: audioBlob.size, 
          blobType: audioBlob.type,
          url: audioUrl 
        });
      }
      
      // Create blob URL if not already created
      let downloadUrl = audioUrl;
      if (!audioUrl.startsWith('blob:')) {
        downloadUrl = URL.createObjectURL(audioBlob);
      }
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `audio-${Date.now()}.mp3`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        // Revoke blob URL if we created a new one
        if (downloadUrl !== audioUrl && downloadUrl.startsWith('blob:')) {
          URL.revokeObjectURL(downloadUrl);
        }
      }, 100);
      
      toast.success('Download started!', {
        duration: 3000,
        icon: <DownloadIcon />,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed to start download: ${error.message}`);
    }
  };

  const handleDownloadMp4 = () => {
    if (!videoBlob || !videoUrl) {
      toast.error('Video not ready. Please wait for processing to complete.');
      if (process.env.NODE_ENV === 'development') {
        console.error('Download MP4 failed:', { videoBlob: !!videoBlob, videoUrl: !!videoUrl });
      }
      return;
    }
    
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Starting MP4 download:', { blobSize: videoBlob.size, url: videoUrl });
      }
      
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `video-${Date.now()}.mp4`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 100);
      
      toast.success('Download started!', {
        duration: 3000,
        icon: <DownloadIcon />,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed to start download: ${error.message}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-slideUp">
      <div className="glass-card dark:glass-card-dark rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl hover-lift border-2 border-white/40 dark:border-gray-700/30 relative overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/15 to-pink-500/15 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/15 to-pink-500/15 rounded-full blur-3xl -z-0"></div>
        
        <div className="relative z-10 space-y-5 md:space-y-6">
          {/* Platform Detection Badge */}
          {detectedPlatform && detectedPlatform !== PLATFORMS.UNKNOWN && (
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              <span>{t.detectedPlatform || 'Detected Platform'}:</span>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                {getPlatformName(detectedPlatform)}
              </span>
            </div>
          )}

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

          {/* Format Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.selectFormat || 'Format'}
              </label>
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-pink-500 dark:focus:border-pink-500 focus:outline-none transition-all"
                disabled={loading}
              >
                <option value="mp3">{t.formatAudio || 'Audio (MP3)'}</option>
                <option value="mp4">{t.formatVideo || 'Video (MP4)'}</option>
              </select>
            </div>

            {/* Quality Selection (only for video) */}
            {downloadFormat === 'mp4' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.selectQuality || 'Quality'}
                </label>
                <select
                  value={videoQuality}
                  onChange={(e) => setVideoQuality(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-pink-500 dark:focus:border-pink-500 focus:outline-none transition-all"
                  disabled={loading}
                >
                  <option value="best">{t.qualityBest || 'Best Quality'}</option>
                  <option value="high">{t.qualityHigh || 'High (1080p)'}</option>
                  <option value="medium">{t.qualityMedium || 'Medium (720p)'}</option>
                  <option value="low">{t.qualityLow || 'Low (480p)'}</option>
                </select>
              </div>
            )}
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={loading}
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

          {/* Audio Success Section */}
          {audioUrl && audioBlob && (
            <div className="space-y-6 animate-fadeIn">
              <div className="glass-card dark:glass-card-dark rounded-2xl p-5 md:p-6 shadow-xl border border-white/10 dark:border-gray-700/30">
                <div className="mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preview Audio</span>
                </div>
                <div className="flex justify-center">
                  <audio controls className="w-full max-w-md rounded-xl" src={audioUrl}>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>

              <button
                onClick={handleDownloadMp3}
                className="group w-full py-4 px-4 md:px-5 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 relative overflow-hidden"
              >
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center justify-center gap-2 text-sm md:text-base">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {t.downloadMp3}
                </span>
              </button>

              <ShareButtons audioUrl={audioUrl} lang={lang} />
            </div>
          )}

          {/* Video Success Section */}
          {videoUrl && videoBlob && (
            <div className="space-y-6 animate-fadeIn">
              {/* Download Button - Above Preview */}
              <button
                onClick={handleDownloadMp4}
                className="group w-full py-4 px-4 md:px-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 relative overflow-hidden"
              >
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center justify-center gap-2 text-sm md:text-base">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {t.downloadMp4 || 'Download MP4'}
                </span>
              </button>

              {/* Preview Video - Below Button */}
              <div className="glass-card dark:glass-card-dark rounded-2xl p-5 md:p-6 shadow-xl border border-white/10 dark:border-gray-700/30">
                <div className="mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preview Video</span>
                </div>
                <div className="flex justify-center">
                  <video controls className="w-full max-w-sm rounded-xl" src={videoUrl}>
                    Your browser does not support the video element.
                  </video>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
