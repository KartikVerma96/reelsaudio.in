export const metadata = {
  title: 'Contact Us - ReelsAudio.in | Get in Touch via WhatsApp',
  description: 'Contact ReelsAudio.in team via WhatsApp. We\'re here to help with any questions or feedback. Get instant responses to your queries.',
  // Note: 'keywords' is not supported in Next.js 15 metadata API
  openGraph: {
    title: 'Contact Us - ReelsAudio.in',
    description: 'Contact ReelsAudio.in team via WhatsApp. Get instant responses to your questions.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://reelsaudio.in'}/contact`,
  },
};

export default function ContactLayout({ children }) {
  return children;
}

