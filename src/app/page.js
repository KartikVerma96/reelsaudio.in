'use client';

import { useState, useEffect } from 'react';
import Downloader from '../components/Downloader';
import { detectLanguage, getAllTranslations } from '../lib/translations';

export default function Home() {
  const [lang, setLang] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const detectedLang = detectLanguage();
    setLang(detectedLang);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen py-6 md:py-8 px-4 md:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* SEO: Main Content Section */}
        <section aria-label="Instagram Reels Audio Downloader Tool">
          <h2 className="sr-only">Download Instagram Reels Audio as MP3 - Free Online Tool</h2>
          
          {/* Main Downloader */}
          <Downloader lang={lang} />
        </section>

        {/* PWA Install Prompt */}
        <PWAInstallPrompt lang={lang} />
      </div>
    </main>
  );
}

function PWAInstallPrompt({ lang }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const t = getAllTranslations(lang);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Listen for beforeinstallprompt event
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="mt-8 glass-card dark:glass-card-dark rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn shadow-2xl hover-lift">
      <div>
        <p className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1">
          {t.addToHomeScreen}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Install ReelsAudio.in for faster access
        </p>
      </div>
       <button
         onClick={handleInstall}
         className="px-6 py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 dark:from-purple-600 dark:via-pink-600 dark:to-red-600 text-white font-bold rounded-xl hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 dark:hover:from-purple-700 dark:hover:via-pink-700 dark:hover:to-red-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
       >
         Install Now
       </button>
    </div>
  );
}

