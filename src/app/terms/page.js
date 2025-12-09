export const metadata = {
  title: 'Terms of Service - ReelsAudio.in',
  description: 'Terms of Service for ReelsAudio.in - Free Instagram Reels Audio Downloader. Read our terms and conditions.',
  // Note: 'keywords' is not supported in Next.js 15 metadata API
  openGraph: {
    title: 'Terms of Service - ReelsAudio.in',
    description: 'Terms of Service for ReelsAudio.in - Free Instagram Reels Audio Downloader.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://reelsaudio.in'}/terms`,
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen py-6 md:py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <article className="glass-card dark:glass-card-dark rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Acceptance of Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                By using ReelsAudio.in, you agree to these Terms of Service. If you don't agree, please don't use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Service Description
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                ReelsAudio.in provides a free tool to download audio from Instagram Reels. The service is provided "as is" without warranties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                User Responsibilities
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>You must only download audio from Reels you have permission to use</li>
                <li>You must respect copyright and intellectual property rights</li>
                <li>You must not use the service for illegal purposes</li>
                <li>You must not abuse or overload our servers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Copyright Notice
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Downloaded audio is subject to Instagram's terms of service and copyright laws. You are responsible for ensuring you have the right to use downloaded audio for your intended purpose.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Limitation of Liability
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                ReelsAudio.in is not liable for any damages resulting from use of our service. Use at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Changes to Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use constitutes acceptance of changes.
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}

