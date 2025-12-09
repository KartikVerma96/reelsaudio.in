export const metadata = {
  title: 'Privacy Policy - ReelsAudio.in',
  description: 'Privacy Policy for ReelsAudio.in - Free Instagram Reels Audio Downloader. Learn how we protect your privacy and data.',
  // Note: 'keywords' is not supported in Next.js 15 metadata API
  openGraph: {
    title: 'Privacy Policy - ReelsAudio.in',
    description: 'Privacy Policy for ReelsAudio.in - Free Instagram Reels Audio Downloader.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://reelsaudio.in'}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-6 md:py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <article className="glass-card dark:glass-card-dark rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Introduction
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                At ReelsAudio.in, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we handle your information when you use our Instagram Reels audio downloader service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Data We Collect
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                ReelsAudio.in is designed with privacy in mind. We collect minimal data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li><strong>No Personal Information:</strong> We don't require registration or login, so we don't collect personal information like names or emails.</li>
                <li><strong>No Stored Data:</strong> All audio extraction happens in your browser. We don't store downloaded files or URLs on our servers.</li>
                <li><strong>Analytics:</strong> We use Google Analytics to understand how visitors use our site (anonymized data only).</li>
                <li><strong>Cookies:</strong> We use essential cookies for site functionality only.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                How We Use Your Data
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We use collected data only to improve our service and understand user behavior. We never sell your data to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Third-Party Services
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We use Google Analytics for website analytics (anonymized data only). These services have their own privacy policies.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-2 text-sm italic">
                Note: We currently do not display advertisements. If we add advertisements in the future, we will update this privacy policy accordingly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Your Rights
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                You have the right to access, modify, or delete any personal data we might have. Since we collect minimal data, there's usually nothing to delete.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                If you have questions about this privacy policy, please contact us through our website.
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}

