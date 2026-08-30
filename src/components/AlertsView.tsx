import React, { useState } from 'react';
import { NotificationItem } from '../types';
import {
  Bell,
  Sparkles,
  PackageCheck,
  Calendar,
  Tag,
  CheckCheck,
  ChevronRight,
} from 'lucide-react';

interface AlertsViewProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectCategory: (cat: any) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  notifications,
  onMarkAllRead,
  onSelectCategory,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.read : true));

  return (
    <div id="alerts-view-page" className="py-8 md:py-12 px-5 md:px-16 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-semibold text-[#891738] uppercase tracking-[0.2em] block font-body">
            BOUTIQUE DISPATCH & SALON UPDATES
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[#6d0026]">
            Notifications & Alerts
          </h2>
        </div>

        <button
          onClick={onMarkAllRead}
          className="text-xs text-[#6d0026] hover:text-[#8e1b3b] font-semibold flex items-center gap-1.5 py-1 px-3 bg-[#ffd9dd]/50 hover:bg-[#ffd9dd] rounded-full transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark all read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-[#6d0026] text-white shadow-xs'
              : 'bg-[#f0eded] text-[#574144] hover:bg-[#fed9e2]/50'
          }`}
        >
          All Alerts ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === 'unread'
              ? 'bg-[#6d0026] text-white shadow-xs'
              : 'bg-[#f0eded] text-[#574144] hover:bg-[#fed9e2]/50'
          }`}
        >
          Unread ({notifications.filter((n) => !n.read).length})
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 sm:p-5 rounded-xl border transition-all ${
              !item.read
                ? 'bg-white border-[#debfc2] shadow-xs'
                : 'bg-[#fcf9f8] border-[#debfc2]/20 opacity-85'
            } flex items-start gap-4`}
          >
            <div
              className={`p-2.5 rounded-full shrink-0 ${
                item.type === 'drop'
                  ? 'bg-[#fed9e2] text-[#6d0026]'
                  : item.type === 'order'
                  ? 'bg-emerald-100 text-emerald-800'
                  : item.type === 'invitation'
                  ? 'bg-[#ffdea5] text-[#453000]'
                  : 'bg-[#ffd9dd] text-[#891738]'
              }`}
            >
              {item.type === 'drop' && <Sparkles className="w-4 h-4" />}
              {item.type === 'order' && <PackageCheck className="w-4 h-4" />}
              {item.type === 'invitation' && <Calendar className="w-4 h-4" />}
              {item.type === 'offer' && <Tag className="w-4 h-4" />}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-display text-sm sm:text-base font-semibold text-[#1c1b1b]">
                  {item.title}
                </h4>
                <span className="text-[11px] text-[#8a7174]">{item.time}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#574144] leading-relaxed">
                {item.message}
              </p>
            </div>

            {!item.read && (
              <span className="w-2 h-2 rounded-full bg-[#aa314e] mt-2 shrink-0"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
