
export const metadata = {
  title: 'About ReelsAudio.in - Built by Indian Developer | Free Instagram Reels Audio Downloader',
  description: 'Learn about ReelsAudio.in - built by an Indian developer to help creators save trending audio easily. Used by 1,234,567+ people. Free Instagram Reels audio downloader.',
  // Note: 'keywords' is not supported in Next.js 15 metadata API
  openGraph: {
    title: 'About ReelsAudio.in - Built by Indian Developer',
    description: 'Learn about ReelsAudio.in - built by an Indian developer to help creators save trending audio easily.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://reelsaudio.in'}/about`,
  },
};

export default function AboutPage() {
  const userCount = 1234567;

  return (
    <main className="min-h-screen py-6 md:py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card dark:glass-card-dark rounded-3xl p-6 md:p-8 mb-8 shadow-2xl text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            About ReelsAudio.in
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
            Built by an Indian Developer to Help Creators Save Trending Audio Easily
          </p>
        </div>

        {/* Social Proof Counter */}
        <div className="glass-card dark:glass-card-dark rounded-3xl p-6 md:p-8 mb-8 shadow-2xl text-center">
          <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Used by
          </p>
          <p className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            {userCount.toLocaleString('en-IN')}+
          </p>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
            People Worldwide
          </p>
        </div>

        <article className="glass-card dark:glass-card-dark rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl mb-8">
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Our Story
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                ReelsAudio.in was built by an Indian developer who noticed a common problem: content creators 
                and music lovers wanted to save trending audio from Instagram Reels, but there was no simple, 
                free solution available. Most tools required registration, had hidden costs, or didn't work well 
                on mobile devices.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                As a developer passionate about helping creators, I decided to build a solution that would be:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-4">
                <li>100% free forever - no hidden costs</li>
                <li>No login or registration required</li>
                <li>Works perfectly on mobile and desktop</li>
                <li>Fast and reliable</li>
                <li>Privacy-first - no data storage</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Today, ReelsAudio.in is used by over {userCount.toLocaleString('en-IN')} people worldwide, 
                helping creators save trending audio easily and quickly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Our Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Our mission is simple: to provide the best free Instagram Reels audio downloader experience 
                for creators, music lovers, and anyone who wants to save trending audio. We believe that 
                great tools should be accessible to everyone, regardless of their technical skills or budget.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We're committed to keeping ReelsAudio.in free forever, maintaining user privacy, and 
                continuously improving the service based on user feedback.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                What is ReelsAudio.in?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                ReelsAudio.in is a free, fast, and easy-to-use tool that allows you to download audio from 
                Instagram Reels as MP3 files. Whether you're a content creator, music producer, or just 
                someone who loves a particular audio from an Instagram Reel, ReelsAudio.in makes it simple 
                to extract and download that audio in high quality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Why Choose ReelsAudio.in?
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li><strong>100% Free:</strong> No hidden costs, no premium plans, completely free forever</li>
                <li><strong>No Login Required:</strong> Start downloading immediately without creating an account</li>
                <li><strong>Fast & Reliable:</strong> Extract audio in 3-8 seconds with our optimized technology</li>
                <li><strong>High Quality:</strong> Download audio in MP3 format with original quality</li>
                <li><strong>Works Everywhere:</strong> Compatible with all devices - mobile, tablet, and desktop</li>
                <li><strong>Privacy First:</strong> All processing happens in your browser - we don't store your data</li>
                <li><strong>No Ads Interruption:</strong> Clean, user-friendly interface</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                How It Works
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                ReelsAudio.in uses advanced browser-based technology to extract audio from Instagram Reels videos. The entire process happens in your browser, ensuring your privacy and security. Simply paste the Instagram Reels URL, and our tool handles the rest.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Copy the Instagram Reels URL</li>
                <li>Paste it into ReelsAudio.in</li>
                <li>Click "Download Audio Now"</li>
                <li>Wait 3-8 seconds for processing</li>
                <li>Download your MP3 file</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Our Commitment
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                At ReelsAudio.in, we're committed to providing the best free Instagram Reels audio downloader experience. We continuously improve our technology to ensure fast, reliable, and high-quality audio extraction. Your privacy and satisfaction are our top priorities.
              </p>
            </section>

            <section className="text-center mt-12">
              <a
                href="/"
                className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-bold rounded-xl hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
              >
                Start Downloading Now →
              </a>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}

