
export const metadata = {
  title: 'Privacy Policy - ReelsAudio.in | We Don\'t Store Your Data',
  description: 'Privacy Policy for ReelsAudio.in. We don\'t store files, no login required, no data collection. Your privacy is our priority. Learn how we protect your data.',
  // Note: 'keywords' is not supported in Next.js 15 metadata API
  openGraph: {
    title: 'Privacy Policy - ReelsAudio.in',
    description: 'Privacy Policy for ReelsAudio.in. We don\'t store files, no login required, no data collection.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://reelsaudio.in'}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen py-6 md:py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card dark:glass-card-dark rounded-3xl p-6 md:p-8 mb-8 shadow-2xl text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Main Content */}
        <article className="glass-card dark:glass-card-dark rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl mb-8">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Introduction
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              At ReelsAudio.in, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we handle your information when you use our Instagram Reels 
              audio downloader service. We believe in transparency and want you to understand exactly how 
              your data is handled.
            </p>
          </section>

          {/* Key Privacy Points */}
          <section className="mb-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 rounded-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Our Privacy Commitment
            </h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 dark:text-green-400 font-bold">✓</span>
                <span><strong>No File Storage:</strong> We don't store any downloaded files on our servers. All processing happens in your browser.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 dark:text-green-400 font-bold">✓</span>
                <span><strong>No Login Required:</strong> We don't require registration or login, so we don't collect personal information like names or emails.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 dark:text-green-400 font-bold">✓</span>
                <span><strong>No Data Collection:</strong> We don't collect or store your Reels URLs, download history, or any personal data.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 dark:text-green-400 font-bold">✓</span>
                <span><strong>Browser-Based Processing:</strong> All audio extraction happens in your browser, ensuring maximum privacy.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 dark:text-green-400 font-bold">✓</span>
                <span><strong>No Tracking:</strong> We don't track your browsing behavior or create user profiles.</span>
              </li>
            </ul>
          </section>

          {/* Data We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Data We Collect
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              ReelsAudio.in is designed with privacy in mind. We collect minimal data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>No Personal Information:</strong> We don't require registration or login, so we don't collect personal information like names, emails, or phone numbers.</li>
              <li><strong>No Stored Data:</strong> All audio extraction happens in your browser. We don't store downloaded files or URLs on our servers.</li>
              <li><strong>Analytics:</strong> We use Google Analytics to understand how visitors use our site. This data is anonymized and doesn't identify individual users.</li>
              <li><strong>Cookies:</strong> We use essential cookies for site functionality only. We don't use tracking cookies or third-party advertising cookies.</li>
              <li><strong>Server Logs:</strong> Our servers automatically log basic information like IP addresses and access times for security purposes. These logs are deleted after 30 days.</li>
            </ul>
          </section>

          {/* How We Use Data */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              How We Use Your Data
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              The minimal data we collect is used only for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Improving our service and user experience</li>
              <li>Understanding website usage patterns (anonymized analytics)</li>
              <li>Ensuring website security and preventing abuse</li>
              <li>Complying with legal obligations</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
              We never sell, rent, or share your data with third parties for marketing purposes.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Data Security
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>HTTPS encryption for all data transmission</li>
              <li>Secure server infrastructure</li>
              <li>Regular security updates and patches</li>
              <li>No database storage of user data</li>
              <li>Browser-based processing (data never leaves your device)</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Third-Party Services
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Google Analytics:</strong> For website analytics (anonymized data only)</li>
              <li><strong>Hosting Provider:</strong> For website hosting (no access to user data)</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-2 text-sm italic">
              Note: We currently do not display advertisements. If we add advertisements in the future, we will update this privacy policy accordingly.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
              These services have their own privacy policies. We recommend reviewing them.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Your Rights
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Access any personal data we hold about you</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of analytics tracking</li>
              <li>Disable cookies in your browser settings</li>
              <li>Contact us with privacy concerns</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Children's Privacy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              ReelsAudio.in is not intended for children under 13 years of age. We don't knowingly collect 
              personal information from children. If you believe we have collected information from a child, 
              please contact us immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Changes to This Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by 
              posting the new policy on this page and updating the "Last updated" date. We encourage you 
              to review this policy periodically.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              If you have any questions about this privacy policy or our data practices, please contact us:
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Email: <a href="mailto:hello@reelsaudio.in" className="text-orange-500 dark:text-purple-400 hover:underline">hello@reelsaudio.in</a>
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}

