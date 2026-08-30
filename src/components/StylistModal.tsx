import React, { useState } from 'react';
import { X, Sparkles, Calendar, Clock, CheckCircle, Video, MapPin } from 'lucide-react';
import { Logo } from './Logo';

interface StylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StylistModal: React.FC<StylistModalProps> = ({ isOpen, onClose }) => {
  const [sessionType, setSessionType] = useState<'virtual' | 'salon'>('virtual');
  const [occasion, setOccasion] = useState('Bridal & Wedding Trousseau');
  const [date, setDate] = useState('2026-09-05');
  const [time, setTime] = useState('15:00');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fcf9f8] w-full max-w-lg rounded-2xl shadow-2xl border border-[#debfc2]/40 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#574144] hover:bg-[#fed9e2]/30 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmed ? (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="mb-4">
              <Logo size="sm" withTagline={true} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#891738]" />
              <span className="text-xs font-semibold text-[#891738] uppercase tracking-widest font-body">
                Private Consultation
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold text-[#6d0026] mb-2">
              Book a Bespoke Stylist
            </h3>
            <p className="text-xs text-[#574144] mb-6">
              Experience one-on-one drape consultations, fabric swatches, and custom blouse sizing with our senior atelier couturiers.
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-[#1c1b1b] uppercase tracking-wider block mb-2">
                  Session Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSessionType('virtual')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 ${
                      sessionType === 'virtual'
                        ? 'border-[#6d0026] bg-[#ffd9dd]/30 font-semibold text-[#6d0026]'
                        : 'border-[#debfc2]/40 text-[#574144]'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Virtual Video Drape</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionType('salon')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 ${
                      sessionType === 'salon'
                        ? 'border-[#6d0026] bg-[#ffd9dd]/30 font-semibold text-[#6d0026]'
                        : 'border-[#debfc2]/40 text-[#574144]'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Mumbai / Delhi Salon</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1c1b1b] uppercase tracking-wider block mb-1">
                  Occasion Focus
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#f6f3f2] rounded-lg border border-[#debfc2]/40 focus:outline-none focus:border-[#6d0026]"
                >
                  <option>Bridal & Wedding Trousseau</option>
                  <option>Heritage Pure Silk Sarees</option>
                  <option>Cocktail & Evening Organza</option>
                  <option>Festive Chikankari & Kurtis</option>
                  <option>Custom Blouse Master Tailoring</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#1c1b1b] uppercase tracking-wider block mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#f6f3f2] rounded-lg border border-[#debfc2]/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1c1b1b] uppercase tracking-wider block mb-1">
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#f6f3f2] rounded-lg border border-[#debfc2]/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1c1b1b] uppercase tracking-wider block mb-1">
                  Styling Notes / Color Palettes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Looking for a Rose Gold Banarasi saree for my sister's reception..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#f6f3f2] rounded-lg border border-[#debfc2]/40 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#6d0026] text-white py-3.5 rounded-full font-body text-xs font-semibold tracking-widest uppercase hover:bg-[#8e1b3b] shadow-md mt-2"
              >
                REQUEST COMPLIMENTARY SESSION
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#6d0026] mb-2">
              Appointment Reserved
            </h3>
            <p className="text-xs text-[#574144] max-w-sm mb-6 leading-relaxed">
              Your session for <span className="font-semibold text-[#1c1b1b]">{occasion}</span> on <span className="font-semibold text-[#1c1b1b]">{date} at {time}</span> has been scheduled. A private concierge invitation link has been sent to your email.
            </p>
            <button
              onClick={() => {
                setConfirmed(false);
                onClose();
              }}
              className="bg-[#6d0026] text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
