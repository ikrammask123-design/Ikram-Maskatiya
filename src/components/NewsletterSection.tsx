import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section
      id="newsletter-section"
      className="py-14 sm:py-20 px-4 sm:px-8 bg-[#f6f3f2] border-t border-[#debfc2]/40"
    >
      <div className="max-w-[800px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fed9e2] text-[#6d0026] text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#891738]" />
          <span>Exclusive Salon Privileges</span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1c1b1b] mb-3 tracking-tight">
          Join the Zevioza Circle
        </h2>

        <p className="font-body text-sm sm:text-base text-[#574144] mb-8 max-w-lg mx-auto leading-relaxed">
          Get early access to new collections, exclusive deals, and 10% off your first order.
        </p>

        {!subscribed ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white text-[#1c1b1b] px-5 py-3.5 rounded-full border border-[#debfc2] focus:outline-none focus:border-[#6d0026] shadow-xs text-xs sm:text-sm font-body placeholder-[#8a7174]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#6d0026] hover:bg-[#8e1b3b] text-white px-8 py-3.5 rounded-full font-body text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 flex-shrink-0 active:scale-98 cursor-pointer"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-md inline-flex items-center gap-3 text-emerald-800 animate-fadeIn">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div className="text-left">
              <h4 className="font-bold text-sm">Welcome to the Salon!</h4>
              <p className="text-xs text-[#574144]">
                Check your inbox for your 10% privilege discount code.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
