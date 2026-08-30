import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber = '918238023498',
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const defaultMessage = encodeURIComponent(
    'Namaste! 🙏 I am browsing Zevioza Haute Ethnic and would like personal assistance with designs & ordering.'
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div
      id="floating-whatsapp-container"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-end gap-2.5 select-none"
    >
      {/* Interactive Tooltip / Mini Prompt */}
      {showTooltip && (
        <div
          id="whatsapp-tooltip-card"
          className="hidden md:flex items-center gap-3 bg-white text-[#1c1b1b] p-3 rounded-2xl shadow-xl border border-[#debfc2]/50 max-w-xs animate-fadeIn"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
              ZV
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#1c1b1b]">Need styling help or custom sizing?</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 mt-0.5"
            >
              Chat on WhatsApp &rarr;
            </a>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-stone-400 hover:text-stone-700 p-1"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        id="btn-floating-whatsapp"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 ring-4 ring-white/80"
        title="Chat on WhatsApp (+91 8238023498)"
        aria-label="Direct WhatsApp Concierge"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white"></span>
        </span>

        {/* WhatsApp Icon SVG */}
        <svg
          className="w-7 h-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 14.39C16.31 14.26 15.09 13.66 14.86 13.58C14.63 13.5 14.47 13.46 14.31 13.7C14.15 13.94 13.68 14.5 13.54 14.66C13.4 14.82 13.26 14.84 13.01 14.72C12.76 14.6 11.96 14.34 11.01 13.49C10.27 12.83 9.77 12.01 9.63 11.77C9.49 11.53 9.61 11.4 9.74 11.27C9.85 11.16 9.99 10.98 10.12 10.83C10.25 10.68 10.29 10.57 10.37 10.41C10.45 10.25 10.41 10.11 10.35 9.99C10.29 9.87 9.81 8.69 9.61 8.21C9.41 7.73 9.21 7.8 9.06 7.79C8.92 7.78 8.76 7.78 8.6 7.78C8.44 7.78 8.18 7.84 7.96 8.08C7.74 8.32 7.12 8.9 7.12 10.08C7.12 11.26 7.98 12.4 8.1 12.56C8.22 12.72 9.8 15.15 12.22 16.19C12.8 16.44 13.25 16.59 13.6 16.7C14.18 16.89 14.71 16.86 15.13 16.8C15.6 16.73 16.56 16.22 16.76 15.65C16.96 15.08 16.96 14.6 16.9 14.5C16.84 14.4 16.71 14.34 16.56 14.21V14.39Z" />
        </svg>

        {/* Hover tag on desktop */}
        <span className="hidden group-hover:block absolute right-full mr-3 whitespace-nowrap bg-stone-900 text-white text-xs font-medium py-1.5 px-3 rounded-xl shadow-lg transition-all">
          Chat on WhatsApp (+91 8238023498)
        </span>
      </a>
    </div>
  );
};
