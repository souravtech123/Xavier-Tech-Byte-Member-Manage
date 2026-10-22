"use client";

import { useState } from "react";
import Link from "next/link";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import {
  Zap,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  FolderGit2,
  CheckCircle2,
  Video,
  Award,
  CreditCard,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Eye,
  User,
  ExternalLink,
} from "lucide-react";
import NotificationBell from "./dashboard/NotificationBell";
import LandingClient from "./LandingClient";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

const D = "font-[family-name:var(--font-display)]";

interface LoggedInLandingProps {
  memberData?: any;
  adminData?: any;
  role: "member" | "admin";
}

export default function LoggedInLanding({
  memberData,
  adminData,
  role,
}: LoggedInLandingProps) {
  const [showPublicPreview, setShowPublicPreview] = useState(false);

  if (showPublicPreview) {
    const publicEvents = memberData?.events || adminData?.events || [];
    const publicProjects = memberData?.projects || adminData?.projects || [];
    return (
      <div>
        <div className="sticky top-0 z-[60] flex flex-wrap items-center justify-between gap-3 bg-[#0F1226] px-4 py-2.5 text-xs text-white shadow-md">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 shrink-0 text-[#FFB627]" />
            <span className="leading-snug">
              Previewing <strong>Public Landing</strong> as guest
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowPublicPreview(false)}
            className="shrink-0 rounded-full bg-[#FFB627] px-3.5 py-1 font-bold text-[#0F1226] transition hover:bg-white"
          >
            ← Back to Portal
          </button>
        </div>
        <LandingClient initialEvents={publicEvents} initialProjects={publicProjects} />
      </div>
    );
  }

  // ── ADMIN VIEW ──────────────────────────────────────────────────────────────
  if (role === "admin") {
    const { members = [], projects = [], events = [], resignations = [] } = adminData || {};
    const pendingResignations = resignations.filter((r: any) => r.status === "pending").length;

    return (
      <main
        className={`${display.variable} ${body.variable} min-h-screen bg-[#F4F5FA] font-[family-name:var(--font-body)] text-[#0F1226]`}
      >
        <header className="sticky top-0 z-50 border-b border-[#DDE0F0] bg-[#F4F5FA]/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-8">
            <Link href="/" className={`${D} flex items-center gap-2 text-lg font-extrabold tracking-tight`}>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0F1226] text-white">
                <Zap className="h-4 w-4 text-[#FFB627]" />
              </div>
              <span className="hidden sm:block">
                Xavier<span className="text-[#3347F2]">Tech</span>Byte
              </span>
              <span className="text-[#3347F2] sm:hidden">XTS</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full bg-[#3347F2]/10 px-3 py-1 text-xs font-bold text-[#3347F2] sm:inline-flex">
                <ShieldCheck className="h-3.5 w-3.5" />
                Administrator
              </span>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#3347F2] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#0F1226]"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Admin Portal</span>
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-full border border-[#DDE0F0] bg-white px-3 py-2 text-xs font-semibold text-[#0F1226] transition hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-4 pt-6 pb-6 sm:px-8 sm:pt-10">
          <div className="relative overflow-hidden rounded-2xl bg-[#0F1226] p-6 text-[#F4F5FA] shadow-lg sm:rounded-3xl sm:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#3347F2]/25 blur-3xl" />
            <div className="relative">
              <span className="inline-block rounded-full bg-[#FFB627] px-3 py-1 text-[11px] font-extrabold text-[#0F1226]">
                ADMIN CONTROL
              </span>
              <h1 className={`${D} mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl`}>
                Welcome back, Administrator 👋
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#DDE0F0]/80">
                Manage society members, publish events, update projects, and monitor attendance.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-full bg-[#3347F2] px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#0F1226]"
                >
                  Enter Admin Portal <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowPublicPreview(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <Eye className="h-4 w-4" />
                  Preview Landing
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-8">
          <h2 className={`${D} text-lg font-bold text-[#0F1226] sm:text-xl`}>Live Society Analytics</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { label: "Active Members", value: members.length, sub: "Verified in system", color: "#3347F2" },
              { label: "Society Projects", value: projects.length, sub: "Published portfolio", color: "#0F766E" },
              { label: "Scheduled Events", value: events.length, sub: "Live on calendar", color: "#6D4AFF" },
              {
                label: "Pending Requests",
                value: pendingResignations,
                sub: "Resignations to review",
                color: pendingResignations > 0 ? "#B91C1C" : "#15803D",
              },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[#DDE0F0] bg-white p-4 shadow-sm sm:p-5">
                <p className="text-xs font-semibold text-[#6B7086]">{stat.label}</p>
                <p className={`${D} mt-1.5 text-3xl font-extrabold`} style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-[#6B7086]">{stat.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-[#DDE0F0] py-6 text-center text-xs text-[#6B7086]">
          <p>© {new Date().getFullYear()} Xavier Tech Byte Society. Admin Workspace.</p>
        </footer>
      </main>
    );
  }

  // ── MEMBER VIEW ─────────────────────────────────────────────────────────────
  const {
    user = {},
    attendanceStats = {
      eligibleMeetings: 0,
      attended: 0,
      absent: 0,
      excused: 0,
      percentage: 100,
    },
    meetings = [],
    events = [],
    projects = [],
    certificates = [],
    notifications = [],
  } = memberData || {};

  return (
    <main
      className={`${display.variable} ${body.variable} min-h-screen bg-[#F4F5FA] font-[family-name:var(--font-body)] text-[#0F1226] selection:bg-[#FFB627] selection:text-[#0F1226]`}
    >
      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#DDE0F0] bg-[#F4F5FA]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
          <Link href="/" className={`${D} flex items-center gap-2 text-lg font-extrabold tracking-tight`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#3347F2] text-white">
              <Zap className="h-4 w-4" />
            </div>
            <span className="hidden sm:block">
              Xavier<span className="text-[#3347F2]">Tech</span>Byte
            </span>
            <span className="text-[#3347F2] sm:hidden">XTS</span>
          </Link>

          <div className="flex items-center gap-2">
            <NotificationBell initialNotifications={notifications} xts_id={user.xts_id} />

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#3347F2] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#0F1226]"
            >
              <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">My Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>

            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                title="Sign out"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE0F0] bg-white px-3 py-2 text-xs font-semibold text-[#0F1226] transition hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ── HERO / WELCOME BANNER ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-5 pb-2 sm:px-8 sm:pt-10">
        <div className="relative overflow-hidden rounded-2xl bg-[#0F1226] p-5 text-[#F4F5FA] shadow-lg sm:rounded-3xl sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-[#3347F2]/25 blur-3xl sm:-right-20 sm:-top-20 sm:h-72 sm:w-72"
          />
          <div className="relative">
            {/* Avatar + Meta row */}
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-[#FFB627] bg-[#1E275A] shadow-md sm:h-20 sm:w-20 sm:rounded-2xl">
                {user.profile_image ? (
                  <img src={user.profile_image} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-7 w-7 text-[#FFB627] sm:h-9 sm:w-9" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-[#FFB627] px-2.5 py-0.5 text-[11px] font-extrabold text-[#0F1226]">
                    XTS MEMBER
                  </span>
                  {user.team && (
                    <span className="rounded-full border border-[#3347F2] bg-[#3347F2]/40 px-2.5 py-0.5 text-[11px] font-bold text-white">
                      {user.team} Team
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-xs text-[#DDE0F0]/60">ID: {user.xts_id}</p>
              </div>
            </div>

            <h1 className={`${D} mt-4 text-2xl font-extrabold tracking-tight sm:text-4xl`}>
              Welcome back, {user.name?.split(" ")[0]}! 👋
            </h1>
            <p className="mt-1.5 text-sm text-[#DDE0F0]/75 sm:text-base">
              {user.course ? `${user.course}` : ""}
              {user.semester ? ` · Sem ${user.semester}` : ""}
              {" · St. Xavier's College, Ranchi"}
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-[#FFB627] px-5 py-3 text-sm font-bold text-[#0F1226] transition hover:bg-white"
              >
                Open Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => setShowPublicPreview(true)}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <Eye className="h-4 w-4" />
                <span>Preview Public Site</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD ANALYTICS STATS ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-5 sm:px-8 sm:py-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#3347F2]">
              YOUR METRICS
            </p>
            <h2 className={`${D} mt-0.5 text-xl font-extrabold text-[#0F1226] sm:text-2xl`}>
              Dashboard Analytics
            </h2>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#3347F2] hover:underline"
          >
            Full reports <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          {/* Attendance */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#DDE0F0] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7086]">Attendance</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#15803D]/10 text-[#15803D]">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className={`${D} text-2xl font-extrabold text-[#0F1226] sm:text-3xl`}>
                  {attendanceStats.percentage}%
                </span>
                <span className="text-[11px] font-medium text-[#15803D]">
                  {attendanceStats.attended}/{attendanceStats.eligibleMeetings}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E8F2]">
                <div
                  className="h-full rounded-full bg-[#15803D] transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, attendanceStats.percentage))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Meetings */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#DDE0F0] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7086]">Meetings</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3347F2]/10 text-[#3347F2]">
                <Video className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-3">
              <span className={`${D} text-2xl font-extrabold text-[#0F1226] sm:text-3xl`}>
                {meetings.length}
              </span>
              <p className="mt-1 text-xs text-[#6B7086]">Total sessions</p>
            </div>
          </div>

          {/* Projects */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#DDE0F0] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7086]">Projects</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F766E]/10 text-[#0F766E]">
                <FolderGit2 className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-3">
              <span className={`${D} text-2xl font-extrabold text-[#0F1226] sm:text-3xl`}>
                {projects.length}
              </span>
              <p className="mt-1 text-xs font-medium text-[#0F766E]">Society builds</p>
            </div>
          </div>

          {/* Certificates */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#DDE0F0] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7086]">Certificates</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#A16207]/10 text-[#A16207]">
                <Award className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-3">
              <span className={`${D} text-2xl font-extrabold text-[#0F1226] sm:text-3xl`}>
                {certificates.length}
              </span>
              <p className="mt-1 text-xs font-medium text-[#A16207]">Credentials issued</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK WORKSPACE LINKS ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-3 sm:px-8">
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: "/dashboard", icon: CreditCard, color: "#3347F2", bg: "#EEF0FF", label: "Digital ID Card", sub: "View & download credentials", border: "hover:border-[#3347F2]/40" },
            { href: "/dashboard", icon: CheckCircle2, color: "#15803D", bg: "#F0FAF6", label: "Attendance Record", sub: "Meeting history & audits", border: "hover:border-[#15803D]/40" },
            { href: "/dashboard", icon: Calendar, color: "#6D4AFF", bg: "#F3F0FF", label: "Upcoming Events", sub: "Workshops & hackathons", border: "hover:border-[#6D4AFF]/40" },
            { href: "/dashboard", icon: FolderGit2, color: "#0F766E", bg: "#EFFAF8", label: "Society Projects", sub: "Repos & builds", border: "hover:border-[#0F766E]/40" },
          ].map(({ href, icon: Icon, color, bg, label, sub, border }) => (
            <Link
              key={label}
              href={href}
              className={`group flex flex-col justify-between rounded-2xl border border-[#DDE0F0] bg-white p-4 transition hover:shadow-sm ${border}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: bg, color }}>
                  <Icon className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#8B90A3] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <div className="mt-3">
                <p className="text-sm font-bold leading-snug text-[#0F1226]">{label}</p>
                <p className="mt-0.5 text-xs leading-snug text-[#6B7086]">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── EVENTS SECTION ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-7 sm:px-8">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6D4AFF]">SOCIETY CALENDAR</p>
            <h2 className={`${D} mt-0.5 text-xl font-extrabold text-[#0F1226] sm:text-2xl`}>
              Events &amp; Workshops
            </h2>
          </div>
          <Link href="/dashboard" className="mt-0.5 shrink-0 inline-flex items-center gap-1 text-xs font-bold text-[#3347F2] hover:underline">
            Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[#DDE0F0] bg-white p-8 text-center text-[#6B7086]">
            <Calendar className="mx-auto h-7 w-7 opacity-50" />
            <p className="mt-2 text-sm font-bold text-[#0F1226]">No scheduled events at this moment</p>
            <p className="text-xs">Upcoming workshops and hackathons will appear here.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {events.slice(0, 3).map((e: any) => {
              const eventDate = e.date ? new Date(e.date) : null;
              const isValid = eventDate && !isNaN(eventDate.getTime());
              const isUpcoming = isValid ? eventDate.getTime() >= new Date().setHours(0, 0, 0, 0) : true;
              const dateString = isValid
                ? eventDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
                : e.date;

              return (
                <article key={e._id || e.title} className="rounded-2xl border border-[#DDE0F0] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6D4AFF]/10 text-[#6D4AFF]">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${isUpcoming ? "bg-[#EAF7F0] text-[#16845B]" : "bg-[#F1F3F9] text-[#777D98]"}`}>
                          {isUpcoming ? "Upcoming" : "Concluded"}
                        </span>
                        <span className="text-[11px] font-semibold text-[#6D4AFF]">{dateString}</span>
                      </div>
                      <h3 className={`${D} mt-1.5 text-base font-bold text-[#0F1226] sm:text-lg`}>{e.title}</h3>
                      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-[#0F1226]/70">
                        {e.description || e.text}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ── PROJECTS SECTION ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-8">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0F766E]">BUILDING TOGETHER</p>
            <h2 className={`${D} mt-0.5 text-xl font-extrabold text-[#0F1226] sm:text-2xl`}>Society Projects</h2>
          </div>
          <Link href="/dashboard" className="mt-0.5 shrink-0 inline-flex items-center gap-1 text-xs font-bold text-[#0F766E] hover:underline">
            All projects <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[#DDE0F0] bg-white p-8 text-center text-[#6B7086]">
            <FolderGit2 className="mx-auto h-7 w-7 opacity-50" />
            <p className="mt-2 text-sm font-bold text-[#0F1226]">No active projects published</p>
            <p className="text-xs">Projects added by admin will appear here.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {projects.slice(0, 4).map((p: any) => {
              const hasExternalLink = p.link && (p.link.startsWith("http://") || p.link.startsWith("https://"));
              return (
                <article key={p._id || p.title} className="flex flex-col justify-between rounded-2xl border border-[#DDE0F0] bg-white p-4 shadow-sm transition hover:border-[#0F766E]/40 hover:shadow-md sm:p-5">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E]">
                        <FolderGit2 className="h-4 w-4" />
                      </div>
                      <span className="rounded-full bg-[#0F766E]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#0F766E]">Active</span>
                    </div>
                    <h3 className={`${D} mt-3 text-base font-bold text-[#0F1226] sm:text-lg`}>{p.title}</h3>
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-[#0F1226]/70">{p.description}</p>
                  </div>
                  {hasExternalLink && (
                    <div className="mt-4 border-t border-[#DDE0F0] pt-3">
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:underline">
                        Open Repository / Project
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#DDE0F0] bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-xs text-[#6B7086]">
                Signed in as <strong className="text-[#0F1226]">{user.name}</strong>
              </p>
              <p className="mt-0.5 truncate text-xs text-[#8B90A3]">{user.email}</p>
              <p className="mt-0.5 text-xs text-[#8B90A3]">Xavier Tech Byte Society · St. Xavier&apos;s College, Ranchi</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPublicPreview(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE0F0] bg-[#F4F5FA] px-4 py-2 text-xs font-semibold text-[#0F1226] transition hover:bg-[#DDE0F0]"
              >
                <Eye className="h-3.5 w-3.5" />
                Preview Public Page
              </button>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0F1226] px-4 py-2 text-xs font-bold text-white transition hover:bg-red-600"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 text-center text-[11px] text-[#8B90A3]">
            © {new Date().getFullYear()} Xavier Tech Byte Society. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
