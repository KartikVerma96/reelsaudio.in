'use client';

import { useEffect } from 'react';

export default function AdSlot({ position = 'top' }) {
  useEffect(() => {
    // Initialize AdSense (if available)
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.log('AdSense not initialized');
        }
      }
    }
  }, []);

  // Determine ad size based on position
  const getAdDimensions = () => {
    switch (position) {
      case 'top':
        return {
          width: '100%',
          maxWidth: '728px',
          height: '90px',
          mdHeight: '250px',
          format: 'horizontal'
        };
      case 'middle':
        return {
          width: '100%',
          maxWidth: '728px',
          height: '90px',
          mdHeight: '250px',
          format: 'horizontal'
        };
      case 'bottom':
        return {
          width: '100%',
          maxWidth: '728px',
          height: '90px',
          mdHeight: '250px',
          format: 'horizontal'
        };
      default:
        return {
          width: '100%',
          maxWidth: '728px',
          height: '90px',
          mdHeight: '250px',
          format: 'horizontal'
        };
    }
  };

  const adDimensions = getAdDimensions();

  return (
    <div className={`w-full flex justify-center items-center ${position === 'top' ? 'mb-8' : position === 'middle' ? 'my-8' : 'mt-8'} animate-fadeIn`}>
      <div className="w-full max-w-[728px]">
        {/* Ad Label */}
        <div className="flex items-center justify-center mb-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/10 dark:bg-gray-800/30 rounded-full backdrop-blur-sm">
            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">Advertisement</span>
          </div>
        </div>

        {/* Ad Container */}
        <div 
          className="glass-card dark:glass-card-dark rounded-2xl p-3 md:p-4 flex items-center justify-center overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
          style={{
            minHeight: adDimensions.height,
            height: adDimensions.mdHeight,
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            {/* Google AdSense Code - Replace with your actual ad unit */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <div className="text-center p-4">
                <div className="mb-3">
                  <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Ad Space</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">728 × 250</p>
                
                {/* Replace this div with your AdSense ad unit */}
                <div className="mt-3 opacity-0 pointer-events-none">
                  <ins
                    className="adsbygoogle"
                    style={{ 
                      display: 'block',
                      width: '100%',
                      height: '100%'
                    }}
                    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                    data-ad-slot="XXXXXXXXXX"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                  ></ins>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

