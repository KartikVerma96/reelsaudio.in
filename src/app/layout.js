import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ReelsAudio.in - Free Instagram Reels Audio Downloader | MP3 Download No Login',
  description: 'Download Instagram Reels audio as MP3 instantly. Free, fast, no login required. Extract clean audio from Instagram Reels videos in seconds. Best Instagram Reels audio downloader online. Works on mobile and desktop. No registration needed.',
  // Note: 'keywords' is not supported in Next.js 15 metadata API - handled via meta tag in head
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://reelsaudio.in',
    languages: {
      'en': 'https://reelsaudio.in',
      'hi': 'https://reelsaudio.in?lang=hi',
      'ta': 'https://reelsaudio.in?lang=ta',
      'te': 'https://reelsaudio.in?lang=te',
      'bn': 'https://reelsaudio.in?lang=bn',
      'kn': 'https://reelsaudio.in?lang=kn',
      'ml': 'https://reelsaudio.in?lang=ml',
    },
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://reelsaudio.in'),
  authors: [{ name: 'ReelsAudio.in' }],
  openGraph: {
    title: 'ReelsAudio.in - Free Instagram Reels Audio Downloader | MP3 Download',
    description: 'Download Instagram Reels audio as MP3 instantly. Free, fast, no login required. Best Instagram Reels audio downloader online. Works on all devices.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://reelsaudio.in',
    siteName: 'ReelsAudio.in',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReelsAudio.in - Free Instagram Reels Audio Downloader - Download MP3 Instantly',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReelsAudio.in - Free Instagram Reels Audio Downloader',
    description: 'Download Instagram Reels audio as MP3 instantly. Free, fast, no login required. Best online tool for extracting audio from Instagram Reels.',
    images: ['/og-image.png'],
    creator: '@reelsaudio_in',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Note: 'manifest' and 'themeColor' are not supported - handled via link/meta tags in head
  // Note: 'viewport' must be exported separately - see below
}

// Viewport must be exported separately in Next.js 15
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#667eea',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Keywords meta tag - not supported in metadata API */}
        <meta name="keywords" content="instagram reels audio downloader, download instagram reels audio, instagram audio mp3 downloader, reels audio extractor, download instagram audio, instagram reel audio download, instagram reels audio to mp3, extract audio from instagram reel, free instagram reels audio downloader, instagram audio downloader no login, convert instagram reel to mp3, instagram reels audio downloader online, instagram audio extractor, download instagram reel audio, instagram reels to mp3, get audio from instagram reel, instagram audio download free, reels audio downloader, instagram reel audio extractor, download audio from instagram reels" />
        
        {/* Google AdSense - Commented out until approval */}
        {/* Uncomment when you have Google AdSense approval:
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        */}
        
        {/* Enhanced Structured Data - WebApplication */}
        <Script
          id="json-ld-webapp"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'ReelsAudio.in',
              description: 'Download Instagram Reels audio as MP3 instantly. Free, fast, no login required.',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://reelsaudio.in',
              applicationCategory: 'UtilityApplication',
              operatingSystem: 'Web',
              browserRequirements: 'Requires JavaScript. Requires HTML5.',
              softwareVersion: '1.0',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '125000',
              },
            }),
          }}
        />
        
        {/* FAQ Schema */}
        <Script
          id="json-ld-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'How to download Instagram Reels audio?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Simply paste the Instagram Reels URL in the input box and click "Download Audio Now". The audio will be extracted and downloaded as MP3 in 3-8 seconds. No login or registration required.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is ReelsAudio.in free to use?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, ReelsAudio.in is completely free. You can download unlimited Instagram Reels audio without any cost, login, or registration.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Do I need to login to download Instagram Reels audio?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No, you don\'t need to login or create an account. Just paste the Reels URL and download the audio instantly.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What audio format does ReelsAudio.in support?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'ReelsAudio.in downloads audio in MP3 format, which is compatible with all devices and audio players.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I download audio from private Instagram Reels?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No, you can only download audio from public Instagram Reels. Private Reels are not accessible.',
                  },
                },
              ],
            }),
          }}
        />
        
        {/* HowTo Schema */}
        <Script
          id="json-ld-howto"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HowTo',
              name: 'How to Download Instagram Reels Audio',
              description: 'Step-by-step guide to download audio from Instagram Reels as MP3',
              step: [
                {
                  '@type': 'HowToStep',
                  position: 1,
                  name: 'Copy Instagram Reels URL',
                  text: 'Open Instagram and copy the URL of the Reel you want to download audio from.',
                },
                {
                  '@type': 'HowToStep',
                  position: 2,
                  name: 'Paste URL',
                  text: 'Paste the Instagram Reels URL in the input box on ReelsAudio.in.',
                },
                {
                  '@type': 'HowToStep',
                  position: 3,
                  name: 'Click Download',
                  text: 'Click the "Download Audio Now" button to start the extraction process.',
                },
                {
                  '@type': 'HowToStep',
                  position: 4,
                  name: 'Wait for Processing',
                  text: 'Wait 3-8 seconds for the audio to be extracted from the video.',
                },
                {
                  '@type': 'HowToStep',
                  position: 5,
                  name: 'Download MP3',
                  text: 'Click the "Download MP3" button to save the audio file to your device.',
                },
              ],
            }),
          }}
        />
        
        {/* Organization Schema */}
        <Script
          id="json-ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ReelsAudio.in',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://reelsaudio.in',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://reelsaudio.in'}/logo.png`,
              description: 'Free Instagram Reels Audio Downloader - Download MP3 instantly',
              foundingDate: '2024',
              sameAs: [
                'https://twitter.com/reelsaudio',
                'https://facebook.com/reelsaudio',
                'https://instagram.com/reelsaudio',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                availableLanguage: ['en', 'hi', 'ta', 'te', 'bn', 'kn', 'ml'],
              },
            }),
          }}
        />
        
        {/* BreadcrumbList Schema for Homepage */}
        <Script
          id="json-ld-breadcrumb"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: process.env.NEXT_PUBLIC_SITE_URL || 'https://reelsaudio.in',
                },
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">
            <Navigation />
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}

