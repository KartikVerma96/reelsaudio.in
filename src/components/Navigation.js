'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, startTransition } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { detectLanguage, getAllTranslations, setLanguage } from '../lib/translations';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [mounted, setMounted] = useState(false);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    setMounted(true);
    const detectedLang = detectLanguage();
    setLang(detectedLang);
    
    // Listen for language changes from other components
    const handleLanguageChange = (event) => {
      setLang(event.detail.lang);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/how-to-use', label: 'How to Use' },
    { href: '/faq', label: 'FAQ' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  const handleLinkClick = (href, e) => {
    // Close mobile menu immediately for instant feedback
    setMobileMenuOpen(false);
    
    // Use startTransition for smoother navigation (React 18)
    if (pathname !== href) {
      startTransition(() => {
        setNavigating(true);
        // Reset quickly - Next.js handles the actual navigation
        setTimeout(() => setNavigating(false), 20);
      });
    }
  };

  return (
    <nav className="w-full mt-4 md:mt-6 mb-6 md:mb-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card dark:glass-card-dark rounded-2xl p-4 shadow-xl relative">
          {/* Navigation Loading Indicator */}
          {navigating && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 animate-pulse" />
          )}
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <svg className="w-6 h-6 text-orange-500 dark:text-purple-400 group-hover:scale-110 transition-transform duration-75" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                ReelsAudio.in
              </span>
            </Link>

            <div className="flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={(e) => handleLinkClick(link.href, e)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-75 ${
                    isActive(link.href)
                      ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30 active:scale-95'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Theme Toggle & Language Switcher */}
              {mounted && (
                <>
                  <DarkModeToggle lang={lang} />
                  <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <svg className="w-6 h-6 text-orange-500 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
                <span className="text-lg font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  ReelsAudio.in
                </span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30 transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {mobileMenuOpen && (
              <div className="mt-4 pt-4 border-t border-white/20 dark:border-gray-700/30 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={true}
                    onClick={(e) => handleLinkClick(link.href, e)}
                    className={`block px-4 py-3 rounded-xl font-medium transition-all duration-75 ${
                      isActive(link.href)
                        ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30 active:scale-95'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Theme Toggle & Language Switcher for Mobile */}
                {mounted && (
                  <div className="flex items-center gap-2 pt-2">
                    <DarkModeToggle lang={lang} />
                    <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function DarkModeToggle({ lang }) {
  const [darkMode, setDarkMode] = useState(false);
  const t = getAllTranslations(lang);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center justify-center w-10 h-10 glass-effect dark:glass-dark rounded-xl hover:bg-white/25 dark:hover:bg-gray-700/40 transition-all duration-300 hover-lift shadow-lg"
      aria-label={darkMode ? t.lightMode : t.darkMode}
      title={darkMode ? t.lightMode : t.darkMode}
    >
      {darkMode ? (
        <svg className="w-5 h-5 text-yellow-400 transition-transform duration-300 hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 transition-transform duration-300 hover:rotate-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}

