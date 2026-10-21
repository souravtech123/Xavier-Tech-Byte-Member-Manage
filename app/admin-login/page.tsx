
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Loader2,
  ArrowRight,
  Zap,
  LockKeyhole,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

const COLORS = {
  ink: '#0F1226',
  paper: '#F4F5FA',
  blue: '#3347F2',
  gold: '#FFB627',
  mist: '#DDE0F0',
  muted: '#777D98',
};

export default function AdminLogin() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push(data.redirect);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please try again.'
      );
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 14px',
    borderRadius: 8,
    background: '#FFFFFF',
    border: `1px solid ${COLORS.mist}`,
    color: COLORS.ink,
    fontSize: 13,
    outlineColor: COLORS.blue,
    transition: 'border-color 150ms ease, box-shadow 150ms ease',
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: COLORS.paper,
        color: COLORS.ink,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Brand Accent */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${COLORS.blue} 0%, ${COLORS.blue} 72%, ${COLORS.gold} 72%, ${COLORS.gold} 100%)`,
        }}
      />

      {/* Subtle Background Decoration */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -170,
          right: '-10%',
          width: 520,
          height: 520,
          borderRadius: '50%',
          border: '1px solid rgba(51,71,242,0.07)',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -100,
          right: '-5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: '1px solid rgba(51,71,242,0.05)',
          pointerEvents: 'none',
        }}
      />

      {/* Navbar */}
      <nav
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '19px 5%',
          background: 'rgba(255,255,255,0.82)',
          borderBottom: `1px solid ${COLORS.mist}`,
          backdropFilter: 'blur(12px)',
        }}
      >
        <Link
          href="/"
          aria-label="Xavier Tech Byte home"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 11,
            textDecoration: 'none',
            color: COLORS.ink,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              background: COLORS.blue,
              color: '#FFFFFF',
              borderRadius: 10,
            }}
          >
            <Zap size={20} strokeWidth={2.5} />
          </div>

          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: '-0.6px',
                lineHeight: 1.2,
              }}
            >
              Xavier<span style={{ color: COLORS.blue }}>Tech</span>Byte
            </div>

            <div
              style={{
                marginTop: 4,
                fontSize: 9,
                color: COLORS.muted,
                letterSpacing: '1.4px',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Technology Society
            </div>
          </div>
        </Link>

        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            color: COLORS.muted,
            textDecoration: 'none',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <ArrowRight
            size={14}
            style={{ transform: 'rotate(180deg)' }}
          />
          Back to Home
        </Link>
      </nav>

      {/* Main Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 20px 56px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Page Heading */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '7px 10px',
                borderRadius: 6,
                background: '#E9ECFF',
                border: '1px solid #D9DEFF',
                color: COLORS.blue,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                marginBottom: 20,
              }}
            >
              <LockKeyhole size={13} />
              Restricted Access
            </div>

            <div
              style={{
                width: 58,
                height: 58,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#FFFFFF',
                border: `1px solid ${COLORS.mist}`,
                borderRadius: 14,
                color: COLORS.blue,
                boxShadow: '0 5px 18px rgba(15,18,38,0.04)',
                marginBottom: 20,
              }}
            >
              <ShieldCheck size={29} strokeWidth={1.8} />
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(30px, 5vw, 39px)',
                lineHeight: 1.12,
                letterSpacing: '-1.5px',
                fontWeight: 800,
                color: COLORS.ink,
              }}
            >
              Admin Secure
              <br />
              <span style={{ color: COLORS.blue }}>Login.</span>
            </h1>

            <p
              style={{
                margin: '13px 0 0',
                maxWidth: 360,
                fontSize: 13,
                lineHeight: 1.8,
                color: COLORS.muted,
              }}
            >
              Sign in to manage XTS operations, members, events, and
              the technology society platform.
            </p>
          </div>

          {/* Login Card */}
          <div
            style={{
              background: '#FFFFFF',
              border: `1px solid ${COLORS.mist}`,
              borderRadius: 14,
              padding: '28px',
              boxShadow: '0 12px 40px rgba(15,18,38,0.045)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                paddingBottom: 18,
                marginBottom: 22,
                borderBottom: `1px solid ${COLORS.mist}`,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: COLORS.ink,
                    fontSize: 16,
                    fontWeight: 800,
                    letterSpacing: '-0.3px',
                  }}
                >
                  Administrator Access
                </h2>

                <p
                  style={{
                    margin: '5px 0 0',
                    color: COLORS.muted,
                    fontSize: 11,
                  }}
                >
                  Enter your authorized credentials.
                </p>
              </div>

              <div
                style={{
                  width: 37,
                  height: 37,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 9,
                  background: '#F0F2FF',
                  color: COLORS.blue,
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={19} />
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 19,
              }}
            >
              {/* Error */}
              {error && (
                <div
                  role="alert"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 9,
                    padding: '12px',
                    borderRadius: 8,
                    background: '#FDECEE',
                    border: '1px solid #F5CDD2',
                    color: '#B42332',
                    fontSize: 12,
                    lineHeight: 1.6,
                  }}
                >
                  <AlertCircle
                    size={16}
                    style={{ flexShrink: 0, marginTop: 1 }}
                  />
                  <span>{error}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    marginBottom: 8,
                    color: COLORS.ink,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Admin Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  placeholder="admin@xts.com"
                  style={inputStyle}
                  onFocus={(event) => {
                    event.currentTarget.style.borderColor = COLORS.blue;
                    event.currentTarget.style.boxShadow =
                      '0 0 0 3px rgba(51,71,242,0.09)';
                  }}
                  onBlur={(event) => {
                    event.currentTarget.style.borderColor = COLORS.mist;
                    event.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  style={{
                    display: 'block',
                    marginBottom: 8,
                    color: COLORS.ink,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  style={inputStyle}
                  onFocus={(event) => {
                    event.currentTarget.style.borderColor = COLORS.blue;
                    event.currentTarget.style.boxShadow =
                      '0 0 0 3px rgba(51,71,242,0.09)';
                  }}
                  onBlur={(event) => {
                    event.currentTarget.style.borderColor = COLORS.mist;
                    event.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 9,
                  padding: '13px 16px',
                  marginTop: 3,
                  border: 'none',
                  borderRadius: 8,
                  background: loading ? '#7581E9' : COLORS.blue,
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.8 : 1,
                  transition: 'background 150ms ease',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In as Admin
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  paddingTop: 2,
                  color: COLORS.muted,
                  fontSize: 10,
                  lineHeight: 1.7,
                }}
              >
                <LockKeyhole
                  size={13}
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                This area is intended for authorized XTS administrators.
              </div>
            </form>
          </div>

          {/* Member Portal Link */}
          <div
            style={{
              marginTop: 23,
              padding: '17px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              background: 'rgba(255,255,255,0.7)',
              border: `1px solid ${COLORS.mist}`,
              borderRadius: 10,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: COLORS.ink,
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                Member of XTS?
              </p>

              <p
                style={{
                  margin: '4px 0 0',
                  color: COLORS.muted,
                  fontSize: 11,
                }}
              >
                Access your member dashboard.
              </p>
            </div>

            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                color: COLORS.blue,
                fontSize: 11,
                fontWeight: 800,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Member Login
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Footer */}
          <p
            style={{
              margin: '25px 0 0',
              color: COLORS.muted,
              fontSize: 10,
              textAlign: 'center',
              lineHeight: 1.8,
            }}
          >
            <span style={{ color: COLORS.ink, fontWeight: 800 }}>
              XTS
            </span>{' '}
            · Xavier Tech Byte Society
            <br />
            St. Xavier’s College, Ranchi
          </p>
        </div>
      </div>
    </main>
  );
}
