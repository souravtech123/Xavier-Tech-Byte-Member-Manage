import Link from "next/link";
import { ArrowRight, User, ShieldCheck, Award, BookOpen, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060b14] text-white overflow-hidden relative">

      {/* Animated background glow orbs */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(56,182,255,0.13) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(99,102,241,0.10) 0%, transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, rgba(56,182,255,0.09) 0%, transparent 70%)",
          filter: "blur(2px)",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Xavier<span className="text-blue-400">Tech</span>Byte
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
            >
              Member Login
            </Link>
            <Link
              href="/admin-login"
              className="text-sm font-medium bg-white/10 hover:bg-white/15 border border-white/10 text-white px-4 py-2 rounded-lg transition-all"
            >
              Admin Panel
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wider uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            XTS Member Portal
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 max-w-4xl">
            Welcome to{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, #38b6ff 0%, #818cf8 50%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Xavier TechByte
            </span>
            <br />
            Member Portal
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
            Log in and check your complete <span className="text-slate-200 font-medium">XTS Profile</span>, view your{" "}
            <span className="text-slate-200 font-medium">Certifications</span>, and stay connected with your team — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full max-w-md">
            <Link
              href="/login"
              id="member-login-btn"
              className="group w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-7 py-4 rounded-2xl font-semibold text-white text-base transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                boxShadow: "0 0 32px rgba(59,130,246,0.35), 0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              <User className="h-5 w-5" />
              Member Login
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/admin-login"
              id="admin-login-btn"
              className="group w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-7 py-4 rounded-2xl font-semibold text-white text-base border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              Admin Access
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-slate-400" />
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl w-full">
            <div className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] rounded-2xl p-6 text-left transition-all duration-300 group cursor-default">
              <div className="h-11 w-11 rounded-xl bg-blue-500/15 flex items-center justify-center mb-4 group-hover:bg-blue-500/25 transition-colors">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-1.5">Your XTS Profile</h3>
              <p className="text-sm text-slate-500 leading-relaxed">View your complete member profile, team, and personal details at a glance.</p>
            </div>

            <div className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] rounded-2xl p-6 text-left transition-all duration-300 group cursor-default">
              <div className="h-11 w-11 rounded-xl bg-indigo-500/15 flex items-center justify-center mb-4 group-hover:bg-indigo-500/25 transition-colors">
                <Award className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-white mb-1.5">Certificates</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Access and download all your XTS-issued certificates and achievements.</p>
            </div>

            <div className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] rounded-2xl p-6 text-left transition-all duration-300 group cursor-default">
              <div className="h-11 w-11 rounded-xl bg-violet-500/15 flex items-center justify-center mb-4 group-hover:bg-violet-500/25 transition-colors">
                <Users className="h-5 w-5 text-violet-400" />
              </div>
              <h3 className="font-semibold text-white mb-1.5">Team Directory</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Explore all XTS members, teams, and their roles within the organization.</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-white/5 text-slate-600 text-sm">
          © {new Date().getFullYear()} Xavier TechByte &mdash; All rights reserved.
        </footer>
      </div>
    </div>
  );
}
