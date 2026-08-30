import React from 'react';
import { TESTIMONIALS } from '../data/products';
import { Star, Quote, CheckCircle } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section
      id="testimonials-section"
      className="py-14 sm:py-20 px-4 sm:px-8 bg-[#fdf9f7] border-t border-[#debfc2]/30"
    >
      <div className="max-w-[1360px] mx-auto">
        {/* Section Heading (Exact wording from video) */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="font-body text-xs sm:text-sm font-bold text-[#891738] tracking-[0.25em] uppercase mb-2 block">
            LOVED BY THOUSANDS
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1c1b1b] tracking-tight">
            What Our Customers Say
          </h2>
        </div>

        {/* 3 Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#debfc2]/40 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              {/* Top Quote Icon & 5 Stars */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#ffd9dd]/50 text-[#6d0026] flex items-center justify-center">
                    <Quote className="w-5 h-5 fill-current opacity-80" />
                  </div>
                  <div className="flex items-center gap-1 text-[#e5a93c]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="font-body text-sm sm:text-base text-[#574144] leading-relaxed mb-6 italic">
                  "{review.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-[#debfc2]/30">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#fed9e2]"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display text-sm font-bold text-[#1c1b1b]">
                      {review.author}
                    </h4>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#8a7174]">
                    <span>{review.city}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold text-[11px]">
                      {review.tag}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
