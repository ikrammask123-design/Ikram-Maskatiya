import React from 'react';
import { Bell, CheckCheck, Sparkles, Package, Gift, ArrowRight } from 'lucide-react';
import { NotificationItem, CategoryId } from '../types';

interface AlertsViewProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectCategory: (category: CategoryId) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  notifications,
  onMarkAllRead,
  onSelectCategory,
}) => {
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-[#891738]" />;
      case 'drop':
        return <Sparkles className="w-4 h-4 text-[#d97706]" />;
      case 'offer':
        return <Gift className="w-4 h-4 text-[#16a34a]" />;
      case 'invitation':
      default:
        return <Bell className="w-4 h-4 text-[#6d0026]" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#debfc2]/40 mb-6">
        <div>
          <span className="text-[10px] tracking-widest uppercase font-bold text-[#891738]">
            Exclusive Dispatch & Updates
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#6d0026]">
            Notifications & Alerts
          </h1>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#6d0026] hover:text-[#891738] bg-[#fed9e2]/40 hover:bg-[#fed9e2] px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                item.read
                  ? 'bg-white/80 border-[#debfc2]/30 text-[#574144]'
                  : 'bg-white border-[#fed9e2] shadow-xs ring-1 ring-[#fed9e2]/50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#fed9e2]/30 border border-[#debfc2]/40 flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-sm text-[#1c1b1b]">
                    {item.title}
                  </h3>
                  <span className="text-[11px] text-[#8a7174] shrink-0">{item.time}</span>
                </div>
                <p className="text-xs text-[#574144] mt-1 leading-relaxed">
                  {item.message}
                </p>
              </div>

              {!item.read && (
                <span className="w-2 h-2 rounded-full bg-[#6d0026] shrink-0 mt-2" />
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#debfc2]/30">
            <Bell className="w-8 h-8 text-[#debfc2] mx-auto mb-3" />
            <p className="text-sm font-medium text-[#8a7174]">No notifications yet</p>
          </div>
        )}
      </div>

      {/* Curated Recommendations Footer */}
      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-[#fed9e2]/30 via-white to-[#fdf8f9] border border-[#debfc2]/40 text-center">
        <h4 className="font-display text-base font-bold text-[#6d0026]">
          Discover Our Latest Collections
        </h4>
        <p className="text-xs text-[#574144] mt-1 max-w-md mx-auto">
          Explore pure handloom silk sarees, wedding lehengas, and artisanal ensembles.
        </p>
        <div className="mt-4 flex justify-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => onSelectCategory('sarees')}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#6d0026] text-white hover:bg-[#891738] transition-all cursor-pointer flex items-center gap-1"
          >
            <span>Silk Sarees</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => onSelectCategory('kurtis')}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#debfc2] text-[#6d0026] hover:bg-[#fed9e2]/30 transition-all cursor-pointer"
          >
            <span>Kurtis & Suits</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectCategory('lehenga-choli')}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#debfc2] text-[#6d0026] hover:bg-[#fed9e2]/30 transition-all cursor-pointer"
          >
            <span>Lehengas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
