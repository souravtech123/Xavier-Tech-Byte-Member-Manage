import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getAllDataForAdmin } from '@/lib/actions';
import { LogOut, ShieldCheck, Zap } from 'lucide-react';
import AdminClient from './AdminClient';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/admin-login');

  const payload = verifyToken(token) as any;
  if (!payload || payload.role !== 'admin') redirect('/admin-login');

  const data = await getAllDataForAdmin();

  return (
    <div className="min-h-screen text-slate-200" style={{ background: '#060b14' }}>
      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 40% at 50% -5%, rgba(16,185,129,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10">
        {/* Top Navbar */}
        <nav
          className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 z-20"
          style={{ background: 'rgba(6,11,20,0.9)', backdropFilter: 'blur(12px)' }}
        >
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">
              Xavier<span className="text-blue-400">Tech</span>Byte
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Panel
            </span>
          </div>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </nav>

        {/* Page Header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div
            className="rounded-2xl p-6 sm:p-8 mb-8"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(5,150,105,0.25) 100%)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  boxShadow: '0 0 24px rgba(16,185,129,0.15)',
                }}
              >
                <ShieldCheck className="h-7 w-7 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-400 text-sm mt-0.5">
                  Manage XTS Members, Certificates, Events &amp; Projects
                </p>
              </div>
            </div>
          </div>

          <AdminClient initialData={data} />
        </div>
      </div>
    </div>
  );
}
