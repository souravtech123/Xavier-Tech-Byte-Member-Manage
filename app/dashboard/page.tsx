
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getMemberData } from '@/lib/actions';
import { Zap, AlertCircle } from 'lucide-react';
import DashboardClient from './DashboardClient';
import NotificationBell from './NotificationBell';

const COLORS = {
  ink: '#0F1226',
  paper: '#F4F5FA',
  blue: '#3347F2',
  gold: '#FFB627',
  mist: '#DDE0F0',
  muted: '#777D98',
};

export default async function MemberDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/login');

  const payload = verifyToken(token) as any;

  if (!payload || payload.role !== 'member') {
    redirect('/login');
  }

  const data = await getMemberData(payload.xts_id);

  if (!data) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: COLORS.paper,
          color: COLORS.ink,
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            padding: 32,
            background: '#FFFFFF',
            border: `1px solid ${COLORS.mist}`,
            borderRadius: 16,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              margin: '0 auto 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              background: '#FFF3E0',
              color: '#B45309',
            }}
          >
            <AlertCircle size={24} />
          </div>

          <h1
            style={{
              margin: '0 0 8px',
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '-0.6px',
            }}
          >
            Unable to load profile
          </h1>

          <p
            style={{
              margin: 0,
              color: COLORS.muted,
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            We couldn’t retrieve your member information. Please try again
            later or contact the XTS administration team.
          </p>

          <a
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 24,
              padding: '11px 20px',
              borderRadius: 8,
              background: COLORS.blue,
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Return to Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: COLORS.paper,
        color: COLORS.ink,
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Subtle brand accent */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          zIndex: 100,
          background: `linear-gradient(90deg, ${COLORS.blue} 0%, ${COLORS.blue} 72%, ${COLORS.gold} 72%, ${COLORS.gold} 100%)`,
        }}
      />

      {/* Top Navbar */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '16px 5%',
          background: 'rgba(255,255,255,0.94)',
          borderBottom: `1px solid ${COLORS.mist}`,
          backdropFilter: 'blur(14px)',
        }}
      >
        {/* XTS Brand */}
        <a
          href="/"
          aria-label="Xavier Tech Byte home"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 11,
            color: COLORS.ink,
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              background: COLORS.blue,
              color: '#FFFFFF',
            }}
          >
            <Zap size={19} strokeWidth={2.5} />
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
                marginTop: 3,
                color: COLORS.muted,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '1.6px',
                textTransform: 'uppercase',
              }}
            >
              Technology Society
            </div>
          </div>
        </a>

        {/* Portal Label */}
        {/* Right Nav Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <NotificationBell initialNotifications={data.notifications || []} xts_id={payload.xts_id} />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              border: `1px solid ${COLORS.mist}`,
              borderRadius: 8,
              background: '#FFFFFF',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#16A34A',
              }}
            />

            <span
              style={{
                color: COLORS.ink,
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              Member Portal
            </span>
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <DashboardClient data={data} />
      </div>

      {/* Minimal Footer */}
      <footer
        style={{
          padding: '20px 5%',
          borderTop: `1px solid ${COLORS.mist}`,
          background: '#FFFFFF',
          color: COLORS.muted,
          fontSize: 12,
          textAlign: 'center',
        }}
      >
        <span style={{ fontWeight: 700, color: COLORS.ink }}>
          XTS
        </span>{' '}
        · Xavier Tech Byte Society
      </footer>
    </main>
  );
}
