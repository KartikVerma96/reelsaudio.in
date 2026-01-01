'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { detectLanguage, getAllTranslations, setLanguage } from '../lib/translations';

const languages = [
  { code: 'hi', name: 'हिंदी', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ta', name: 'தமிழ்', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', nativeName: 'മലയാളം', flag: '🇮🇳' },
];

export default function LanguageSwitcher({ currentLang, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [portalContainer, setPortalContainer] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    setMounted(true);
    // Auto-detect language on mount
    if (!currentLang) {
      const detected = detectLanguage();
      onLanguageChange(detected);
    }
    // Set portal container
    if (typeof document !== 'undefined') {
      setPortalContainer(document.body);
    }
  }, []);

  // Calculate dropdown position when opening
  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 300; // max-w-[300px] from className
      const viewportWidth = window.innerWidth;
      const spacing = 12; // Gap between button and dropdown
      const margin = 16; // Minimum margin from viewport edge
      
      // Calculate right position to align dropdown's right edge with button's right edge
      let right = viewportWidth - rect.right;
      
      // Check if dropdown would overflow on the left side
      const leftPosition = rect.right - dropdownWidth;
      if (leftPosition < margin) {
        // If it would overflow, shift it right to stay within viewport
        right = viewportWidth - margin - dropdownWidth;
      }
      
      setDropdownPosition({
        top: rect.bottom + spacing,
        right: right
      });
    }
  };

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      updateDropdownPosition();
      
      // Update position on scroll/resize
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
      
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both button and dropdown
      const clickedButton = buttonRef.current && buttonRef.current.contains(event.target);
      const clickedDropdown = event.target.closest('.language-dropdown-container');
      
      if (!clickedButton && !clickedDropdown) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Use a small delay to avoid immediate closing
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  if (!mounted) return null;

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages.find(lang => lang.code === 'en') || languages[1];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 md:px-5 py-2.5 glass-effect dark:glass-dark rounded-xl hover:bg-gradient-to-r hover:from-purple-500/30 hover:via-pink-500/30 hover:to-red-500/30 dark:hover:from-purple-900/40 dark:hover:via-pink-900/40 dark:hover:to-red-900/40 transition-all duration-300 hover-lift shadow-lg hover:shadow-xl border border-white/20 dark:border-gray-700/40 overflow-hidden"
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-red-500/0 group-hover:from-purple-500/20 group-hover:via-pink-500/20 group-hover:to-red-500/20 transition-all duration-300"></div>
        
        <span className="relative text-2xl leading-none filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">{currentLanguage.flag}</span>
        <span className="relative font-bold text-white dark:text-gray-100 text-sm md:text-base hidden sm:inline-block bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent group-hover:from-yellow-200 group-hover:via-purple-200 group-hover:to-pink-200 transition-all duration-300">
          {currentLanguage.name}
        </span>
        <svg
          className={`relative w-4 h-4 text-white dark:text-gray-300 transition-all duration-300 ${isOpen ? 'rotate-180' : ''} group-hover:text-yellow-300`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && portalContainer && (
        <>
          {/* Backdrop - rendered via portal to prevent layout shifts */}
          {createPortal(
            <div
              className="fixed inset-0 bg-black/10 dark:bg-black/30 animate-fadeIn"
              onClick={() => setIsOpen(false)}
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0,
                margin: 0,
                padding: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'auto',
                zIndex: 40
              }}
            />,
            portalContainer
          )}
          
          {/* Dropdown Menu - fixed positioning via portal to prevent layout shifts */}
          {createPortal(
            <div 
              className="fixed z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden min-w-[260px] max-w-[300px] border-2 border-white/80 dark:border-purple-700/40 animate-slideDown language-dropdown-container"
              style={{
                position: 'fixed',
                top: `${dropdownPosition.top}px`,
                right: `${dropdownPosition.right}px`,
                zIndex: 50
              }}
            >
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-red-500/20 blur-xl -z-10"></div>
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/30 dark:border-purple-700/30 bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-500/20 dark:from-purple-900/40 dark:via-pink-900/40 dark:to-red-900/40 relative overflow-hidden z-10">
              <div className="relative flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <p className="text-xs font-extrabold text-gray-800 dark:text-purple-200 uppercase tracking-wider">
                  Select Language
                </p>
              </div>
            </div>

            {/* Language List */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-white/50 dark:bg-gray-800/50 relative z-10">
              {languages.map((lang, index) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      onLanguageChange(lang.code);
                      setIsOpen(false);
                    }}
                    className={`group/item w-full flex items-center justify-between gap-3 px-5 py-4 transition-all duration-300 relative overflow-hidden ${
                      isSelected 
                        ? 'bg-gradient-to-r from-orange-500/30 via-pink-500/30 to-purple-500/30 dark:from-purple-700/50 dark:via-pink-700/50 dark:to-red-700/50 shadow-md' 
                        : 'hover:bg-gradient-to-r hover:from-orange-500/15 hover:via-pink-500/15 hover:to-purple-500/15 dark:hover:from-purple-900/30 dark:hover:via-pink-900/30 dark:hover:to-red-900/30'
                    } ${index !== languages.length - 1 ? 'border-b border-white/20 dark:border-purple-700/20' : ''}`}
                  >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-pink-500/0 to-purple-500/0 group-hover/item:from-orange-500/10 group-hover/item:via-pink-500/10 group-hover/item:to-purple-500/10 transition-all duration-300"></div>
                    
                    <div className="relative flex items-center gap-4 flex-1 min-w-0">
                      {/* Flag with glow */}
                      <div className={`relative flex-shrink-0 ${isSelected ? 'animate-bounce-subtle' : ''}`}>
                        <span className="text-3xl leading-none filter drop-shadow-lg transform group-hover/item:scale-110 transition-transform duration-300">
                          {lang.flag}
                        </span>
                        {isSelected && (
                          <div className="absolute inset-0 bg-orange-400/30 rounded-full blur-md -z-10"></div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-start min-w-0 flex-1">
                        <span className={`font-bold text-sm md:text-base truncate w-full transition-all duration-300 ${
                          isSelected 
                            ? 'text-orange-600 dark:text-purple-100 drop-shadow-sm' 
                            : 'text-gray-800 dark:text-gray-200 group-hover/item:text-orange-600 dark:group-hover/item:text-purple-300'
                        }`}>
                          {lang.nativeName}
                        </span>
                        {lang.name !== lang.nativeName && (
                          <span className={`text-xs truncate w-full transition-colors duration-300 ${
                            isSelected 
                              ? 'text-orange-500 dark:text-purple-300' 
                              : 'text-gray-500 dark:text-gray-400 group-hover/item:text-orange-500 dark:group-hover/item:text-purple-400'
                          }`}>
                            {lang.name}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Checkmark for selected */}
                    {isSelected && (
                      <div className="relative flex-shrink-0">
                        <svg 
                          className="relative w-6 h-6 text-orange-600 dark:text-green-400 animate-scaleIn drop-shadow-lg" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                      </div>
                    )}
                    
                    {/* Arrow indicator for hover */}
                    {!isSelected && (
                      <div className="relative flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                        <svg className="w-5 h-5 text-orange-500 dark:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>,
          portalContainer
          )}
        </>
      )}
    </div>
  );
}

