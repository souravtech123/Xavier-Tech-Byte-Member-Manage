'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Loader2, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default function MemberLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const xts_id = formData.get('xts_id');
    const email = formData.get('email');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xts_id, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push(data.redirect);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#060b14' }}
    >
      {/* Background glows */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(59,130,246,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Xavier<span className="text-blue-400">Tech</span>Byte
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </nav>

      {/* Form */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Card header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-5"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(99,102,241,0.2) 100%)',
                border: '1px solid rgba(59,130,246,0.25)',
                boxShadow: '0 0 30px rgba(59,130,246,0.15)',
              }}
            >
              <User className="h-7 w-7 text-blue-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Member Sign In</h1>
            <p className="mt-2 text-slate-400 text-sm">
              Enter your XTS-ID and Email to access your profile
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl text-center">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={e => (e.currentTarget.style.border = '1px solid rgba(59,130,246,0.6)')}
                  onBlur={e => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)')}
                  placeholder="member@example.com"
                />
              </div>

              <div>
                <label htmlFor="xts_id" className="block text-sm font-medium text-slate-300 mb-1.5">
                  XTS-ID
                </label>
                <input
                  id="xts_id"
                  name="xts_id"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={e => (e.currentTarget.style.border = '1px solid rgba(59,130,246,0.6)')}
                  onBlur={e => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)')}
                  placeholder="e.g. XTS-1029"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-white text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  boxShadow: '0 0 24px rgba(59,130,246,0.3)',
                }}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm text-slate-500">
            Are you an admin?{' '}
            <Link href="/admin-login" className="text-blue-400 hover:text-blue-300 transition-colors">
              Go to Admin Panel →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
