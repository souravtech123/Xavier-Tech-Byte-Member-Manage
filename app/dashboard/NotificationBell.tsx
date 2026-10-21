'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Calendar,
  FolderGit2,
  Sparkles,
  Info,
  X,
  ExternalLink,
} from 'lucide-react';
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/actions';

export interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string | Date;
  isRead: boolean;
}

interface NotificationBellProps {
  initialNotifications?: NotificationItem[];
  xts_id: string;
}

export default function NotificationBell({
  initialNotifications = [],
  xts_id,
}: NotificationBellProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state if server data refreshes
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    try {
      await markNotificationAsRead(id, xts_id);
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || loading) return;
    setLoading(true);
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsAsRead(xts_id);
    } catch (e) {
      console.error('Error marking all as read:', e);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    if (type.startsWith('event')) {
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6D4AFF]/10 text-[#6D4AFF]">
          <Calendar className="h-4 w-4" />
        </div>
      );
    }
    if (type.startsWith('project')) {
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E]">
          <FolderGit2 className="h-4 w-4" />
        </div>
      );
    }
    if (type === 'welcome') {
      return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFB627]/20 text-[#D97706]">
          <Sparkles className="h-4 w-4" />
        </div>
      );
    }
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3347F2]/10 text-[#3347F2]">
        <Info className="h-4 w-4" />
      </div>
    );
  };

  const formatTimestamp = (dateInput: string | Date) => {
    try {
      const d = new Date(dateInput);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 2) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Notifications, ${unreadCount} unread`}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDE0F0] bg-white text-[#0F1226] transition-all hover:bg-[#F4F5FA] hover:border-[#3347F2]/30 focus:outline-none focus:ring-2 focus:ring-[#3347F2]/30 active:scale-95"
      >
        <Bell className="h-4 w-4 text-[#0F1226]/80" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#E11D48] px-1 text-[11px] font-extrabold text-white shadow-sm ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[340px] sm:w-[400px] origin-top-right rounded-2xl border border-[#DDE0F0] bg-white shadow-2xl ring-1 ring-black/5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#DDE0F0] bg-[#FAFAFD] px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-[#0F1226]">
                Notifications
              </h3>
              {unreadCount > 0 ? (
                <span className="rounded-full bg-[#3347F2]/10 px-2 py-0.5 text-[11px] font-bold text-[#3347F2]">
                  {unreadCount} new
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-[#777D98]">
                  Caught up
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#3347F2] transition hover:bg-[#3347F2]/10 disabled:opacity-50"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-[#777D98] transition hover:bg-gray-100 hover:text-[#0F1226]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#F1F3F9]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-[#777D98]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-[#777D98] mb-3">
                  <Bell className="h-6 w-6 opacity-60" />
                </div>
                <p className="text-sm font-semibold text-[#0F1226]">
                  No notifications yet
                </p>
                <p className="mt-1 text-xs text-[#777D98]">
                  Updates on events, projects, and announcements will appear here.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => !item.isRead && handleMarkAsRead(item._id)}
                  className={`group relative flex items-start gap-3 p-3.5 transition cursor-pointer hover:bg-[#F8F9FE] ${
                    !item.isRead ? 'bg-[#EEF1FF]/30' : 'bg-white'
                  }`}
                >
                  {getIcon(item.type)}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-bold leading-snug line-clamp-1 ${
                          !item.isRead ? 'text-[#0F1226]' : 'text-[#4A5068]'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="shrink-0 text-[10px] font-medium text-[#777D98]">
                        {formatTimestamp(item.createdAt)}
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-[#6B7086] line-clamp-2">
                      {item.message}
                    </p>
                  </div>

                  {!item.isRead && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#3347F2]" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
