'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Call server-side API to get WhatsApp URL (number hidden)
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          message: formData.message,
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.whatsappUrl) {
        // Open WhatsApp with the URL from server (number not exposed)
        window.open(data.whatsappUrl, '_blank');
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', message: '' });
        }, 3000);
      } else {
        // Fallback: use GET endpoint
        const nameParam = encodeURIComponent(formData.name || 'User');
        const messageParam = encodeURIComponent(formData.message || 'Hello ReelsAudio.in');
        window.location.href = `/api/whatsapp?name=${nameParam}&message=${messageParam}`;
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      // Fallback: use GET endpoint
      const nameParam = encodeURIComponent(formData.name || 'User');
      const messageParam = encodeURIComponent(formData.message || 'Hello ReelsAudio.in');
      window.location.href = `/api/whatsapp?name=${nameParam}&message=${messageParam}`;
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDirectWhatsAppClick = () => {
    // Use GET endpoint which redirects directly (number never exposed)
    window.location.href = '/api/whatsapp?name=User&message=Hello ReelsAudio.in';
  };

  const handleWhatsAppClick = async () => {
    // Open WhatsApp with the form data using the API
    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          message: formData.message,
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.whatsappUrl) {
        // Open WhatsApp with the URL from server (number not exposed)
        window.open(data.whatsappUrl, '_blank');
      } else {
        // Fallback: use GET endpoint
        const nameParam = encodeURIComponent(formData.name || 'User');
        const messageParam = encodeURIComponent(formData.message || 'Hello ReelsAudio.in');
        window.location.href = `/api/whatsapp?name=${nameParam}&message=${messageParam}`;
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      // Fallback: use GET endpoint
      const nameParam = encodeURIComponent(formData.name || 'User');
      const messageParam = encodeURIComponent(formData.message || 'Hello ReelsAudio.in');
      window.location.href = `/api/whatsapp?name=${nameParam}&message=${messageParam}`;
    }
  };

  return (
    <main className="min-h-screen py-6 md:py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card dark:glass-card-dark rounded-3xl p-6 md:p-8 mb-8 shadow-2xl text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
            We'd love to hear from you! Get in touch with any questions or feedback.
          </p>
        </div>

        {/* WhatsApp Contact Card */}
        <div className="glass-card dark:glass-card-dark rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all hover-lift mb-8 text-center">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2">Chat with Us on WhatsApp</h3>
              <p className="text-gray-600 dark:text-gray-400">Get instant responses to your questions</p>
            </div>
          </div>
          <button
            onClick={handleDirectWhatsAppClick}
            className="inline-block w-full md:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl text-center transition-all shadow-lg hover:shadow-xl"
          >
            Open WhatsApp Chat
          </button>
        </div>

        {/* Contact Form */}
        <div className="glass-card dark:glass-card-dark rounded-3xl p-6 md:p-8 shadow-2xl mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
            Send us a Message
          </h2>
          
          {submitted ? (
            <div className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30 rounded-2xl text-center">
              <svg className="w-16 h-16 mx-auto text-green-500 dark:text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-bold text-gray-800 dark:text-white mb-2">Ready to Send!</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Click the button below to open WhatsApp with your message.</p>
              <button
                onClick={handleWhatsAppClick}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Open WhatsApp
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border-2 border-white/30 dark:border-gray-700/30 focus:border-orange-500 dark:focus:border-purple-500 focus:outline-none transition-colors text-gray-800 dark:text-white"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border-2 border-white/30 dark:border-gray-700/30 focus:border-orange-500 dark:focus:border-purple-500 focus:outline-none transition-colors text-gray-800 dark:text-white resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Opening WhatsApp...' : 'Continue to WhatsApp'}
              </button>
            </form>
          )}
        </div>

        {/* Additional Info */}
        <div className="glass-card dark:glass-card-dark rounded-3xl p-6 md:p-8 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <div>
              <h3 className="font-bold mb-2 text-gray-800 dark:text-white">How quickly will you respond?</h3>
              <p>We typically respond within a few hours via WhatsApp. For urgent matters, we try to respond as quickly as possible.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-gray-800 dark:text-white">Do you offer technical support?</h3>
              <p>Yes! If you're having trouble using ReelsAudio.in, we're here to help. Just reach out via WhatsApp and we'll assist you.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-gray-800 dark:text-white">Can I suggest a feature?</h3>
              <p>Absolutely! We love hearing from our users. Send us your suggestions via WhatsApp and we'll consider them for future updates.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-gray-800 dark:text-white">What are your business hours?</h3>
              <p>We're available on WhatsApp throughout the day. We typically respond within a few hours, even outside regular business hours.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
