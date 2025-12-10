import translations from '../translations';

/**
 * Detect user language based on browser settings, URL params, or localStorage
 * Defaults to English
 */
export function detectLanguage() {
  if (typeof window === 'undefined') return 'en';
  
  // Check URL query parameter first
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang) {
    const supportedLangs = ['hi', 'en', 'ta', 'te', 'bn', 'kn', 'ml'];
    if (supportedLangs.includes(urlLang.toLowerCase())) {
      // Save to localStorage
      localStorage.setItem('preferredLang', urlLang.toLowerCase());
      return urlLang.toLowerCase();
    }
  }
  
  // Check localStorage for saved preference
  const savedLang = localStorage.getItem('preferredLang');
  if (savedLang) {
    const supportedLangs = ['hi', 'en', 'ta', 'te', 'bn', 'kn', 'ml'];
    if (supportedLangs.includes(savedLang)) {
      return savedLang;
    }
  }
  
  // Fallback to browser language
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Supported languages
  const supportedLangs = ['hi', 'en', 'ta', 'te', 'bn', 'kn', 'ml'];
  
  // Use browser language if supported, else default to English
  const detectedLang = supportedLangs.includes(langCode) ? langCode : 'en';
  
  // Save detected language to localStorage
  localStorage.setItem('preferredLang', detectedLang);
  
  return detectedLang;
}

/**
 * Set language preference
 */
export function setLanguage(lang) {
  if (typeof window === 'undefined') return;
  
  const supportedLangs = ['hi', 'en', 'ta', 'te', 'bn', 'kn', 'ml'];
  if (supportedLangs.includes(lang)) {
    localStorage.setItem('preferredLang', lang);
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }
}

export function getTranslation(lang, key, fallback = '') {
  const langData = translations[lang] || translations['en'];
  return langData[key] || fallback || key;
}

export function getAllTranslations(lang) {
  return translations[lang] || translations['en'];
}

