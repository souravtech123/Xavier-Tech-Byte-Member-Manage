'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let vid = localStorage.getItem('xts_vid');
  if (!vid) {
    vid = 'v_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem('xts_vid', vid);
  }
  return vid;
}

export async function trackAppInstall(platform?: string) {
  try {
    const visitorId = getOrCreateVisitorId();
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        action: 'install',
        platform: platform || (window.matchMedia('(pointer: coarse)').matches ? 'mobile' : 'desktop'),
      }),
    });
  } catch (err) {
    console.error('Failed to track install:', err);
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const vid = getOrCreateVisitorId();
    const isMobile = window.matchMedia('(pointer: coarse)').matches || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

    const sendTrack = (action: 'visit' | 'heartbeat' = 'visit') => {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId: vid,
          path: pathname || '/',
          device: isMobile ? 'mobile' : 'desktop',
          isStandalone,
          action,
        }),
      }).catch(() => {});
    };

    // 1. Initial page view
    sendTrack('visit');

    // 2. Periodic heartbeat every 40s if page is visible
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        sendTrack('heartbeat');
      }
    }, 40000);

    // 3. Listen for native browser PWA install event
    const handleAppInstalled = () => {
      trackAppInstall(isMobile ? 'mobile_pwa' : 'desktop_pwa');
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearInterval(interval);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [pathname]);

  return null;
}
