import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 md:mt-20 pt-8 pb-6 border-t border-white/20 dark:border-gray-700/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 mb-6">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <svg className="w-6 h-6 text-orange-500 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                ReelsAudio.in
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Download audio & video from Instagram Reels, Facebook Reels, and YouTube Shorts.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">Pages</h3>
              <ul className="space-y-2 text-center md:text-right">
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
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-purple-400 transition-colors text-sm">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">Legal</h3>
              <ul className="space-y-2 text-center md:text-right">
                <li>
                  <Link href="/privacy-policy" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-purple-400 transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-purple-400 transition-colors text-sm">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-white/10 dark:border-gray-700/20 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} ReelsAudio.in. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

