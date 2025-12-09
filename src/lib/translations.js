import translations from '../translations';

/**
 * Detect user language based on browser settings
 * Defaults to English
 */
export function detectLanguage() {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Supported languages
  const supportedLangs = ['hi', 'en', 'ta', 'te', 'bn', 'kn', 'ml'];
  
  // Use browser language if supported, else default to English
  return supportedLangs.includes(langCode) ? langCode : 'en';
}

export function getTranslation(lang, key, fallback = '') {
  const langData = translations[lang] || translations['en'];
  return langData[key] || fallback || key;
}

export function getAllTranslations(lang) {
  return translations[lang] || translations['en'];
}

