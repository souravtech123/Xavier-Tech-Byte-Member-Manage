'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

// BeforeInstallPromptEvent is not in standard TS types yet
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    // Only show on mobile — check via pointer: coarse (touch screen)
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (!isMobile) return;

    // Don't show if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Check if user dismissed previously (within 7 days)
    const dismissed = localStorage.getItem('xts-pwa-dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
      try {
        const { trackAppInstall } = await import('./AnalyticsTracker');
        trackAppInstall('mobile_pwa_banner');
      } catch (e) {}
    }
    setInstalling(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('xts-pwa-dismissed', Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: '12px 16px',
        background: '#0F1226',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.25)',
        // Only visible on mobile via CSS — belt-and-suspenders with the JS check above
      }}
      className="sm:hidden"
    >
      {/* App icon */}
      <img
        src="/icon-192.png"
        alt="XTS App Icon"
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          objectFit: 'contain',
        }}
      />

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#F4F5FA', lineHeight: 1.2 }}>
          Install XTS Portal
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.3 }}>
          Add to home screen for quick access
        </p>
      </div>

      {/* Install button */}
      <button
        type="button"
        onClick={handleInstall}
        disabled={installing}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 14px',
          borderRadius: 20,
          background: '#FFB627',
          color: '#0F1226',
          fontWeight: 700,
          fontSize: 12,
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0,
          opacity: installing ? 0.7 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        <Download size={13} />
        {installing ? 'Installing…' : 'Install'}
      </button>

      {/* Dismiss */}
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss install banner"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.4)',
          flexShrink: 0,
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
