import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 md:mt-20 pt-8 pb-6 border-t border-white/20 dark:border-gray-700/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-orange-500 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                ReelsAudio.in
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Free Instagram Reels Audio Downloader. Download trending audio as MP3 instantly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/trending" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-purple-400 transition-colors text-sm">
                  Trending Audio
                </Link>
              </li>
              <li>
                <Link href="/how-to-use" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-purple-400 transition-colors text-sm">
                  How to Use
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-purple-400 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-purple-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-purple-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-purple-400 transition-colors text-sm">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-purple-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-purple-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-white/10 dark:border-gray-700/20 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} ReelsAudio.in. All rights reserved. | Built with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}

