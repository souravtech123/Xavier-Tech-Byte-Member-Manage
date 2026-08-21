import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getMemberData } from '@/lib/actions';
import { Zap } from 'lucide-react';
import DashboardClient from './DashboardClient';

export default async function MemberDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/login');

  const payload = verifyToken(token) as any;
  if (!payload || payload.role !== 'member') redirect('/login');

  const data = await getMemberData(payload.xts_id);
  if (!data) return <div style={{ color: '#fff', padding: 40 }}>Error loading profile</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#060b14', color: '#e2e8f0' }}>
      {/* Background glow */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 40% at 50% -5%, rgba(59,130,246,0.09) 0%, transparent 60%)',
        }}
      />

      {/* Top Navbar */}
      <nav
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 24px',
          background: 'rgba(6,11,20,0.9)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ height: 32, width: 32, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap style={{ width: 16, height: 16, color: '#fff' }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>
            Xavier<span style={{ color: '#60a5fa' }}>Tech</span>Byte
          </span>
        </div>
        <span style={{ fontSize: 12, color: '#64748b' }}>
          Member Portal
        </span>
      </nav>

      {/* Sidebar + Content layout */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <DashboardClient data={data} />
      </div>
    </div>
  );
}
