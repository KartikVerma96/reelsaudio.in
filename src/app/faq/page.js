import Script from 'next/script';

export const metadata = {
  title: 'FAQ - Instagram Reels Audio Downloader | ReelsAudio.in',
  description: 'Frequently asked questions about downloading Instagram Reels audio in Hindi and English. Get answers to common questions about ReelsAudio.in audio downloader.',
  // Note: 'keywords' is not supported in Next.js 15 metadata API
  openGraph: {
    title: 'FAQ - Instagram Reels Audio Downloader',
    description: 'Frequently asked questions about downloading Instagram Reels audio in Hindi and English.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://reelsaudio.in'}/faq`,
  },
};

const faqs = [
  {
    question: 'Kya ye safe hai? / Is ReelsAudio.in safe?',
    questionEn: 'Is ReelsAudio.in safe?',
    answer: 'हाँ, बिल्कुल safe है! ReelsAudio.in पूरी तरह से safe और secure है। सभी processing आपके browser में होती है, हमारे servers पर कोई data store नहीं होता। हम आपकी privacy को बहुत महत्व देते हैं।',
    answerEn: 'Yes, ReelsAudio.in is completely safe and secure. All processing happens in your browser, and we don\'t store any data on our servers. Your privacy is our top priority.',
  },
  {
    question: 'Private Reels download ho sakti hai? / Can I download private Reels audio?',
    questionEn: 'Can I download audio from private Instagram Reels?',
    answer: 'नहीं, आप केवल public Instagram Reels का audio download कर सकते हैं। Private Reels accessible नहीं हैं क्योंकि वे Instagram के privacy settings के अंतर्गत protected हैं।',
    answerEn: 'No, you can only download audio from public Instagram Reels. Private Reels are not accessible as they are protected by Instagram\'s privacy settings.',
  },
  {
    question: 'Reels audio kaise download kare? / How to download Instagram Reels audio?',
    questionEn: 'How to download Instagram Reels audio?',
    answer: 'बहुत आसान! Instagram Reels का URL copy करें, ReelsAudio.in पर paste करें, और "Download Audio Now" button दबाएं। 3-8 seconds में audio MP3 format में download हो जाएगा। कोई login या registration की जरूरत नहीं।',
    answerEn: 'Very easy! Copy the Instagram Reels URL, paste it on ReelsAudio.in, and click "Download Audio Now". The audio will be downloaded as MP3 in 3-8 seconds. No login or registration required.',
  },
  {
    question: 'Kya ye free hai? / Is ReelsAudio.in free?',
    questionEn: 'Is ReelsAudio.in free to use?',
    answer: 'हाँ, ReelsAudio.in पूरी तरह से free है! आप unlimited Instagram Reels audio download कर सकते हैं बिना किसी cost, login, या registration के। हमेशा free रहेगा!',
    answerEn: 'Yes, ReelsAudio.in is completely free! You can download unlimited Instagram Reels audio without any cost, login, or registration. It will always be free!',
  },
  {
    question: 'Login ki zarurat hai? / Do I need to login?',
    questionEn: 'Do I need to login to download Instagram Reels audio?',
    answer: 'नहीं, बिल्कुल login की जरूरत नहीं है। बिना account बनाए, बिना registration के, सीधे Reels URL paste करके audio download करें।',
    answerEn: 'No, you don\'t need to login or create an account. Just paste the Reels URL and download the audio instantly without any registration.',
  },
  {
    question: 'Mobile par kaam karega? / Will it work on mobile?',
    questionEn: 'Does ReelsAudio.in work on mobile devices?',
    answer: 'हाँ, perfectly काम करता है! ReelsAudio.in mobile phones, tablets, और desktop computers सभी पर perfectly काम करता है। कोई app download करने की जरूरत नहीं, browser में directly use करें।',
    answerEn: 'Yes, it works perfectly! ReelsAudio.in works perfectly on mobile phones, tablets, and desktop computers. No app installation needed, use it directly in your browser.',
  },
  {
    question: 'Kitne time mein download hoga? / How long does it take?',
    questionEn: 'How long does it take to download audio?',
    answer: 'Audio extraction process usually 3-8 seconds में complete हो जाता है। यह video की length और आपकी internet connection speed पर depend करता है।',
    answerEn: 'The audio extraction process usually takes 3-8 seconds. It depends on the video length and your internet connection speed.',
  },
  {
    question: 'Kitne Reels download kar sakte hain? / How many Reels can I download?',
    questionEn: 'Is there a limit on how many Reels I can download?',
    answer: 'Unlimited! कोई limit नहीं है। आप जितने चाहें उतने Instagram Reels का audio free में download कर सकते हैं।',
    answerEn: 'Unlimited! There is no limit. You can download as many Instagram Reels audio as you want for free.',
  },
  {
    question: 'Audio quality kaisi hogi? / What is the audio quality?',
    questionEn: 'What is the quality of the downloaded audio?',
    answer: 'Downloaded audio original quality में होगी। हम video से directly audio extract करते हैं बिना किसी quality loss के।',
    answerEn: 'The downloaded audio maintains the original quality from the Instagram Reel. We extract the audio directly from the video without any quality loss.',
  },
  {
    question: 'Kya commercial use kar sakte hain? / Can I use for commercial purposes?',
    questionEn: 'Can I use the downloaded audio for commercial purposes?',
    answer: 'Downloaded audio Instagram के terms of service और copyright laws के अंतर्गत है। कृपया ensure करें कि आपके पास audio use करने का right है।',
    answerEn: 'The downloaded audio is subject to Instagram\'s terms of service and copyright laws. Please ensure you have the right to use the audio for your intended purpose.',
  },
  {
    question: 'Download nahi ho raha, kya kare? / Why is download not working?',
    questionEn: 'Why is the download not working?',
    answer: 'Ensure करें कि Instagram Reel public है और URL सही है। अगर problem persist कर रही है, तो page refresh करें या different browser try करें।',
    answerEn: 'Make sure the Instagram Reel is public and the URL is correct. If the issue persists, try refreshing the page or using a different browser.',
  },
  {
    question: 'Mera data safe hai? / Is my data safe?',
    questionEn: 'Is my data safe with ReelsAudio.in?',
    answer: 'हाँ, बिल्कुल safe है! सभी processing आपके browser में होती है। हम आपका data या downloaded files अपने servers पर store नहीं करते। आपकी privacy हमारी priority है।',
    answerEn: 'Yes, completely safe! All processing happens in your browser. We don\'t store your data or downloaded files on our servers. Your privacy is our priority.',
  },
  {
    question: 'Stories se download ho sakta hai? / Can I download from Stories?',
    questionEn: 'Can I download audio from Instagram Stories?',
    answer: 'Currently, ReelsAudio.in केवल Instagram Reels support करता है। Stories support future में add किया जा सकता है।',
    answerEn: 'Currently, ReelsAudio.in only supports Instagram Reels. Stories support may be added in the future.',
  },
  {
    question: 'Offline kaam karega? / Does it work offline?',
    questionEn: 'Does ReelsAudio.in work offline?',
    answer: 'नहीं, आपको internet connection की जरूरत है। Instagram Reels audio download करने के लिए पहले video को Instagram के servers से fetch करना होता है।',
    answerEn: 'No, you need an internet connection to download Instagram Reels audio. The video needs to be fetched from Instagram\'s servers first.',
  },
  {
    question: 'Regular posts se download ho sakta hai? / Can I download from regular posts?',
    questionEn: 'Can I download audio from Instagram posts?',
    answer: 'ReelsAudio.in specifically Instagram Reels के लिए designed है। Regular Instagram posts के videos के लिए आपको different tool की जरूरत हो सकती है।',
    answerEn: 'ReelsAudio.in is specifically designed for Instagram Reels. For regular Instagram posts with videos, you may need a different tool.',
  },
];

export default function FAQPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reelsaudio.in';
  
  // Generate FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.questionEn,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answerEn,
      },
    })),
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
        name: 'FAQ',
        item: `${baseUrl}/faq`,
      },
    ],
  };

  return (
    <>
      {/* FAQ Schema */}
      <Script
        id="json-ld-faq-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      
      {/* Breadcrumb Schema */}
      <Script
        id="json-ld-breadcrumb-faq"
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
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
            अक्सर पूछे जाने वाले सवाल / Common Questions
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-card dark:glass-card-dark rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                {faq.question}
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10 dark:border-gray-700/20">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">English:</p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    <strong>{faq.questionEn}</strong> - {faq.answerEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="glass-card dark:glass-card-dark rounded-3xl p-6 md:p-8 shadow-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Still have questions? / अभी भी सवाल हैं?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            If you couldn't find the answer you're looking for, feel free to contact us or check out our how-to guide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/how-to-use"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-bold rounded-xl hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
            >
              View How-To Guide
            </a>
            <a
              href="/contact"
              className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-bold rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-orange-500 dark:hover:border-orange-500 transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}

