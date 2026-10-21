
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getAllDataForAdmin } from '@/lib/actions';
import {
  LogOut,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import AdminClient from './AdminClient';

const C = {
  ink: '#0F1226',
  paper: '#F6F7FB',
  white: '#FFFFFF',
  blue: '#3347F2',
  blueLight: '#EEF0FF',
  border: '#DDE0F0',
  muted: '#777D98',
  green: '#16845B',
  greenBg: '#EAF7F0',
};

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/admin-login');

  const payload = verifyToken(token) as any;

  if (!payload || payload.role !== 'admin') {
    redirect('/admin-login');
  }

  const data = await getAllDataForAdmin();

  return (
    <div
      className="xts-dashboard"
      style={{
        minHeight: '100vh',
        background: C.paper,
        color: C.ink,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        .xts-dashboard,
        .xts-dashboard * {
          box-sizing: border-box;
        }

        .xts-dashboard button {
          font: inherit;
          -webkit-tap-highlight-color: transparent;
        }

        .xts-dashboard .topbar-link {
          transition: background .2s ease, border-color .2s ease,
            color .2s ease, transform .2s ease;
        }

        .xts-dashboard .topbar-link:hover {
          background: #FFF0F1 !important;
          border-color: #F5CDD1 !important;
          color: #C43D4B !important;
        }

        .xts-dashboard .topbar-link:active {
          transform: translateY(1px);
        }

        .xts-dashboard .brand-mark {
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .xts-dashboard .brand-mark:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(51,71,242,.18);
        }

        .xts-dashboard .welcome-panel {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background: linear-gradient(
            115deg,
            #FFFFFF 0%,
            #F5F6FF 58%,
            #EBEEFF 100%
          );
          border: 1px solid #DDE0F0;
          border-radius: 24px;
          box-shadow: 0 10px 35px rgba(24,34,75,.035);
        }

        .xts-dashboard .welcome-panel::before {
          content: "";
          position: absolute;
          z-index: -1;
          width: 270px;
          height: 270px;
          right: -70px;
          top: -125px;
          border: 1px solid rgba(51,71,242,.12);
          border-radius: 50%;
          pointer-events: none;
        }

        .xts-dashboard .welcome-panel::after {
          content: "";
          position: absolute;
          z-index: -1;
          width: 190px;
          height: 190px;
          right: -30px;
          top: -85px;
          border: 1px solid rgba(51,71,242,.10);
          border-radius: 50%;
          pointer-events: none;
        }

        .xts-dashboard .welcome-icon {
          background: linear-gradient(135deg, #3347F2, #6675FF);
          box-shadow: 0 8px 20px rgba(51,71,242,.17);
        }

        .xts-dashboard .eyebrow {
          color: #3347F2;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .xts-dashboard .dashboard-title {
          color: #0F1226;
          font-size: clamp(25px, 3vw, 34px);
          font-weight: 850;
          letter-spacing: -.055em;
          line-height: 1.13;
        }

        .xts-dashboard .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid #C9EAD9;
          background: #EAF7F0;
          color: #16845B;
          border-radius: 9px;
          padding: 8px 11px;
          font-size: 11px;
          font-weight: 750;
          white-space: nowrap;
        }

        .xts-dashboard :focus-visible {
          outline: 3px solid rgba(51,71,242,.25);
          outline-offset: 3px;
        }

        @media (max-width: 600px) {
          .xts-dashboard .topbar-inner {
            padding: 13px 16px !important;
          }

          .xts-dashboard .page-container {
            padding: 22px 12px !important;
          }

          .xts-dashboard .welcome-panel {
            padding: 23px 19px !important;
            border-radius: 18px;
          }

          .xts-dashboard .brand-name {
            font-size: 14px !important;
          }

          .xts-dashboard .logout-label {
            display: none;
          }

          .xts-dashboard .topbar-link {
            padding: 9px !important;
          }

          .xts-dashboard .welcome-header {
            align-items: flex-start !important;
            gap: 13px !important;
          }

          .xts-dashboard .welcome-icon {
            width: 45px !important;
            height: 45px !important;
            border-radius: 13px !important;
          }

          .xts-dashboard .welcome-icon svg {
            width: 23px;
            height: 23px;
          }

          .xts-dashboard .welcome-description {
            font-size: 12px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .xts-dashboard *,
          .xts-dashboard *::before,
          .xts-dashboard *::after {
            transition-duration: .01ms !important;
            animation-duration: .01ms !important;
          }
        }
      `}</style>

      {/* Top navigation */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255,255,255,.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <nav
          className="topbar-inner"
          aria-label="Admin navigation"
          style={{
            maxWidth: 1600,
            margin: '0 auto',
            padding: '15px clamp(16px, 3vw, 38px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              minWidth: 0,
            }}
          >
            <div
              className="brand-mark"
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                background: C.ink,
                display: 'grid',
                placeItems: 'center',
                color: C.white,
                flexShrink: 0,
              }}
            >
              <Zap size={21} fill="#FFFFFF" />
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                className="brand-name"
                style={{
                  fontSize: 16,
                  fontWeight: 850,
                  color: C.ink,
                  letterSpacing: '-.045em',
                  whiteSpace: 'nowrap',
                }}
              >
                Xavier
                <span style={{ color: C.blue }}>Tech</span>
                Byte
              </div>

              <div
                style={{
                  marginTop: 3,
                  fontSize: 10,
                  color: C.muted,
                  fontWeight: 650,
                  letterSpacing: '.025em',
                }}
              >
                Society Management
              </div>
            </div>

            <div
              className="status-pill"
              style={{ marginLeft: 5 }}
            >
              <ShieldCheck size={13} />
              <span className="desktop-admin-label">Admin Panel</span>
            </div>
          </div>

          {/* Logout */}
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="topbar-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 14px',
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                background: C.white,
                color: C.muted,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 750,
              }}
              aria-label="Log out of admin account"
            >
              <LogOut size={15} />
              <span className="logout-label">Logout</span>
            </button>
          </form>
        </nav>
      </header>

      {/* Main dashboard */}
      <main
        className="page-container"
        style={{
          width: '100%',
          maxWidth: 1600,
          margin: '0 auto',
          padding: '24px clamp(16px, 3vw, 38px) 48px',
        }}
      >
        <AdminClient initialData={data} />

        {/* Footer */}
        <footer
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
            padding: '22px 3px 0',
            marginTop: 12,
            borderTop: `1px solid ${C.border}`,
            color: C.muted,
            fontSize: 11,
          }}
        >
          <span>
            <strong style={{ color: C.ink }}>Xavier Tech Byte Society</strong>
            {' '}· Administrative Workspace
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <ShieldCheck size={13} color={C.green} />
            Authorized access only
          </span>
        </footer>
      </main>
    </div>
  );
}
