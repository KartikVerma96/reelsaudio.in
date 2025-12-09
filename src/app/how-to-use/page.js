import Link from 'next/link';
import Script from 'next/script';

export const metadata = {
  title: 'Reels Audio Kaise Download Kare – 100% Free & Fast Guide | ReelsAudio.in',
  description: 'Instagram Reels audio kaise download kare? Step-by-step guide in Hindi and English. Download Reels audio as MP3 in seconds. 100% free, no login required.',
  // Note: 'keywords' is not supported in Next.js 15 metadata API
  openGraph: {
    title: 'Reels Audio Kaise Download Kare – 100% Free & Fast Guide',
    description: 'Complete step-by-step guide to download Instagram Reels audio as MP3. Works on mobile and desktop. No login required.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://reelsaudio.in'}/how-to-use`,
  },
};

export default function HowToUsePage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reelsaudio.in';
  
  // Generate Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Reels Audio Kaise Download Kare – 100% Free & Fast Guide',
    description: 'Complete step-by-step guide to download Instagram Reels audio as MP3. Works on mobile and desktop. No login required.',
    author: {
      '@type': 'Organization',
      name: 'ReelsAudio.in',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ReelsAudio.in',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/how-to-use`,
    },
  };
  
  // Generate Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'How to Use',
        item: `${baseUrl}/how-to-use`,
      },
    ],
  };

  return (
    <>
      {/* Article Schema */}
      <Script
        id="json-ld-article-howto"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      
      {/* Breadcrumb Schema */}
      <Script
        id="json-ld-breadcrumb-howto"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      
      <main className="min-h-screen py-6 md:py-8 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card dark:glass-card-dark rounded-3xl p-6 md:p-8 mb-8 shadow-2xl text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Reels Audio Kaise Download Kare
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
            100% Free & Fast Guide - Step by Step Tutorial
          </p>
        </div>

        {/* Main Content */}
        <article className="glass-card dark:glass-card-dark rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl mb-8">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Instagram Reels Audio Download करने का Complete Guide
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              क्या आप Instagram Reels का audio download करना चाहते हैं? ReelsAudio.in आपकी मदद करता है! 
              यहाँ हम आपको step-by-step बताएंगे कि कैसे आप किसी भी Instagram Reel का audio MP3 format में 
              download कर सकते हैं - बिल्कुल free और बिना login के।
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <strong>ReelsAudio.in</strong> एक free online tool है जो आपको Instagram Reels से audio extract 
              करके MP3 format में download करने की सुविधा देता है। यह tool mobile और desktop दोनों पर 
              perfectly काम करता है और कोई registration या login की जरूरत नहीं है।
            </p>
          </section>

          {/* Step 1 */}
          <section className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                  Instagram Reels URL Copy करें / Copy Instagram Reels URL
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  सबसे पहले, आपको उस Instagram Reel का URL copy करना होगा जिसका audio आप download करना चाहते हैं।
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  <strong>Mobile पर कैसे करें:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                  <li>Instagram app खोलें</li>
                  <li>उस Reel पर जाएं जिसका audio चाहिए</li>
                  <li>Reel के नीचे तीन dots (⋯) पर tap करें</li>
                  <li>"Copy Link" option select करें</li>
                </ol>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
                  <strong>Desktop पर कैसे करें:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                  <li>Browser में instagram.com खोलें</li>
                  <li>Reel पर click करें</li>
                  <li>Browser address bar से URL copy करें</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Step 2 */}
          <section className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                  ReelsAudio.in पर जाएं / Visit ReelsAudio.in
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  अब अपने browser में <strong>reelsaudio.in</strong> खोलें। यह website mobile और desktop दोनों पर 
                  perfectly काम करती है। आपको कोई app download करने की जरूरत नहीं है।
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Website खुलने के बाद आपको एक input box दिखेगा जहाँ आप Reels URL paste कर सकते हैं।
                </p>
              </div>
            </div>
          </section>

          {/* Step 3 */}
          <section className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                  URL Paste करें और Download Button दबाएं / Paste URL and Click Download
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  Copy किया हुआ Instagram Reels URL को input box में paste करें। फिर "Download Audio Now" 
                  button पर click करें।
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  URL paste करने के बाद, system automatically Reel को verify करेगा और processing शुरू करेगा।
                </p>
              </div>
            </div>
          </section>

          {/* Step 4 */}
          <section className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                  Processing का Wait करें / Wait for Processing
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  Audio extraction process शुरू हो जाएगा। यह process usually 3-8 seconds में complete हो जाता है। 
                  Screen पर आपको progress bar दिखेगा जो बताएगा कि processing कितनी complete हो गई है।
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Processing के दौरान, system video से audio extract कर रहा होता है। यह सब आपके browser में 
                  होता है, इसलिए आपकी privacy safe रहती है।
                </p>
              </div>
            </div>
          </section>

          {/* Step 5 */}
          <section className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                  MP3 Download करें / Download MP3
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                  Processing complete होने के बाद, आपको "Download MP3" button दिखेगा। इस button पर click करें 
                  और audio file आपके device में download हो जाएगी।
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Downloaded file MP3 format में होगी जो सभी devices और audio players में play हो सकती है।
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-8 p-6 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-red-500/20 rounded-2xl">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              ReelsAudio.in की खासियतें / Key Features
            </h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 dark:text-purple-400 font-bold">✓</span>
                <span><strong>100% Free:</strong> कोई charge नहीं, unlimited downloads</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 dark:text-purple-400 font-bold">✓</span>
                <span><strong>No Login Required:</strong> बिना account बनाए use करें</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 dark:text-purple-400 font-bold">✓</span>
                <span><strong>Fast Processing:</strong> 3-8 seconds में audio ready</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 dark:text-purple-400 font-bold">✓</span>
                <span><strong>High Quality:</strong> Original quality में audio download</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 dark:text-purple-400 font-bold">✓</span>
                <span><strong>Mobile Friendly:</strong> Mobile और desktop दोनों पर perfect</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 dark:text-purple-400 font-bold">✓</span>
                <span><strong>Privacy Safe:</strong> सभी processing browser में होती है</span>
              </li>
            </ul>
          </section>

          {/* Tips Section */}
          <section className="mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Important Tips / महत्वपूर्ण सुझाव
            </h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <p>
                <strong>1. Public Reels Only:</strong> आप केवल public Instagram Reels का audio download कर सकते हैं। 
                Private Reels का audio download नहीं हो सकता।
              </p>
              <p>
                <strong>2. Internet Connection:</strong> अच्छी internet speed होने पर processing faster होगी।
              </p>
              <p>
                <strong>3. Browser Compatibility:</strong> Latest Chrome, Firefox, Safari, या Edge browser use करें।
              </p>
              <p>
                <strong>4. File Size:</strong> Longer videos का audio file size ज्यादा होगा, download time भी ज्यादा लगेगा।
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-bold rounded-xl hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
            >
              Start Downloading Now →
            </Link>
          </div>
        </article>

        {/* FAQ Section */}
        <section className="glass-card dark:glass-card-dark rounded-3xl p-6 md:p-8 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
            Frequently Asked Questions / अक्सर पूछे जाने वाले सवाल
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">
                Q: क्या ReelsAudio.in safe है? / Is ReelsAudio.in safe?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                A: हाँ, बिल्कुल safe है! सभी processing आपके browser में होती है, हमारे servers पर कोई data store नहीं होता।
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">
                Q: Private Reels का audio download हो सकता है? / Can I download private Reels audio?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                A: नहीं, केवल public Reels का audio download हो सकता है। Private Reels accessible नहीं हैं।
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">
                Q: कितने Reels download कर सकते हैं? / How many Reels can I download?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                A: Unlimited! कोई limit नहीं है, जितने चाहें उतने Reels का audio download कर सकते हैं।
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">
                Q: Mobile पर काम करेगा? / Will it work on mobile?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                A: हाँ, perfectly काम करता है! Mobile browser में reelsaudio.in खोलें और use करें।
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
    </>
  );
}

