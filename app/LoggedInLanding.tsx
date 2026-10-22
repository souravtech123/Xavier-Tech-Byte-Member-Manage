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
  Sparkles,
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

  // If user clicked to preview public landing page without logging out:
  if (showPublicPreview) {
    const publicEvents = memberData?.events || adminData?.events || [];
    const publicProjects = memberData?.projects || adminData?.projects || [];
    return (
      <div>
        {/* Banner informing user they are in preview mode */}
        <div className="sticky top-0 z-[60] flex flex-wrap items-center justify-between gap-3 bg-[#0F1226] px-5 py-2.5 text-xs text-white shadow-md">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-[#FFB627]" />
            <span>
              You are previewing the <strong>Public Landing Page</strong> as a guest.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowPublicPreview(false)}
            className="rounded-full bg-[#FFB627] px-3.5 py-1 font-bold text-[#0F1226] transition hover:bg-white"
          >
            ← Back to Member Portal
          </button>
        </div>
        <LandingClient initialEvents={publicEvents} initialProjects={publicProjects} />
      </div>
    );
  }

  // ── ADMIN VIEW ─────────────────────────────────────────────────────────────
  if (role === "admin") {
    const { members = [], projects = [], events = [], resignations = [] } = adminData || {};
    const pendingResignations = resignations.filter((r: any) => r.status === "pending").length;

    return (
      <main
        className={`${display.variable} ${body.variable} min-h-screen bg-[#F4F5FA] font-[family-name:var(--font-body)] text-[#0F1226]`}
      >
        {/* Navbar */}
        <header className="sticky top-0 z-50 border-b border-[#DDE0F0] bg-[#F4F5FA]/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
            <Link href="/" className={`${D} flex items-center gap-2.5 text-xl font-extrabold tracking-tight`}>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F1226] text-white">
                <Zap className="h-5 w-5 text-[#FFB627]" />
              </div>
              <span>
                Xavier<span className="text-[#3347F2]">Tech</span>Byte
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1.5 rounded-full bg-[#3347F2]/10 px-3 py-1 text-xs font-bold text-[#3347F2] sm:inline-flex">
                <ShieldCheck className="h-3.5 w-3.5" />
                Administrator
              </span>

              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#3347F2] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0F1226]"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Admin Portal</span>
              </Link>

              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-full border border-[#DDE0F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#0F1226] transition hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-6xl px-5 pt-12 pb-8 sm:px-8">
          <div className="rounded-3xl bg-[#0F1226] p-8 text-[#F4F5FA] sm:p-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#FFB627] px-3 py-1 text-xs font-extrabold text-[#0F1226]">
                ADMIN CONTROL
              </span>
              <span className="text-xs text-[#DDE0F0]/70">St. Xavier&apos;s College, Ranchi</span>
            </div>

            <h1 className={`${D} mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl`}>
              Welcome back, Administrator 👋
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#DDE0F0]/80 sm:text-base">
              You are signed in with system administrator privileges. Manage society members, publish events, update projects, and monitor attendance.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-full bg-[#3347F2] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#0F1226]"
              >
                Enter Admin Portal <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={() => setShowPublicPreview(true)}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <Eye className="h-4 w-4" />
                Preview Public Landing
              </button>
            </div>
          </div>
        </section>

        {/* Admin Analytics Grid */}
        <section className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
          <h2 className={`${D} text-xl font-bold text-[#0F1226]`}>Live Society Analytics</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-[#DDE0F0] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold text-[#6B7086]">Active Members</p>
              <p className={`${D} mt-2 text-3xl font-extrabold text-[#3347F2]`}>{members.length}</p>
              <p className="mt-1 text-xs text-[#15803D]">Verified in system</p>
            </div>

            <div className="rounded-2xl border border-[#DDE0F0] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold text-[#6B7086]">Society Projects</p>
              <p className={`${D} mt-2 text-3xl font-extrabold text-[#0F766E]`}>{projects.length}</p>
              <p className="mt-1 text-xs text-[#6B7086]">Published portfolio</p>
            </div>

            <div className="rounded-2xl border border-[#DDE0F0] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold text-[#6B7086]">Scheduled Events</p>
              <p className={`${D} mt-2 text-3xl font-extrabold text-[#6D4AFF]`}>{events.length}</p>
              <p className="mt-1 text-xs text-[#6B7086]">Live on calendar</p>
            </div>

            <div className="rounded-2xl border border-[#DDE0F0] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold text-[#6B7086]">Pending Requests</p>
              <p className={`${D} mt-2 text-3xl font-extrabold ${pendingResignations > 0 ? "text-[#B91C1C]" : "text-[#15803D]"}`}>
                {pendingResignations}
              </p>
              <p className="mt-1 text-xs text-[#6B7086]">Resignations to review</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-[#DDE0F0] py-8 text-center text-xs text-[#6B7086]">
          <p>© {new Date().getFullYear()} Xavier Tech Byte Society. Admin Workspace.</p>
        </footer>
      </main>
    );
  }

  // ── MEMBER VIEW ────────────────────────────────────────────────────────────
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
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#DDE0F0] bg-[#F4F5FA]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className={`${D} flex items-center gap-2.5 text-xl font-extrabold tracking-tight`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3347F2] text-white">
              <Zap className="h-5 w-5" />
            </div>
            <span>
              Xavier<span className="text-[#3347F2]">Tech</span>Byte
            </span>
          </Link>

          {/* Quick Actions in Navbar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <NotificationBell initialNotifications={notifications} xts_id={user.xts_id} />

            {/* Direct Dashboard Link */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#3347F2] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0F1226]"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>My Dashboard</span>
            </Link>

            {/* Logout Button */}
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                title="Log out and return to public website"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE0F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#0F1226] transition hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* HERO / WELCOME BANNER WITH NAME */}
      <section className="mx-auto max-w-6xl px-5 pt-8 pb-4 sm:px-8 sm:pt-12">
        <div className="relative overflow-hidden rounded-3xl bg-[#0F1226] p-7 text-[#F4F5FA] shadow-lg sm:p-11">
          {/* Subtle background glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#3347F2]/25 blur-3xl"
          />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Member Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#FFB627] bg-[#1E275A] shadow-md sm:h-20 sm:w-20">
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-9 w-9 text-[#FFB627]" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#FFB627] px-2.5 py-0.5 text-[11px] font-extrabold text-[#0F1226]">
                    XTS MEMBER
                  </span>
                  {user.team && (
                    <span className="rounded-full bg-[#3347F2]/40 px-2.5 py-0.5 text-[11px] font-bold text-white border border-[#3347F2]">
                      {user.team} Team
                    </span>
                  )}
                  <span className="text-xs text-[#DDE0F0]/65">ID: {user.xts_id}</span>
                </div>

                <h1 className={`${D} mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl`}>
                  Welcome back, {user.name}! 👋
                </h1>

                <p className="mt-2 text-sm text-[#DDE0F0]/80 sm:text-base">
                  {user.course ? `${user.course} · ` : ""}
                  {user.semester ? `Semester ${user.semester} · ` : ""}
                  St. Xavier&apos;s College, Ranchi
                </p>
              </div>
            </div>

            {/* Main Action CTAs */}
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-[#FFB627] px-6 py-3.5 text-sm font-bold text-[#0F1226] transition hover:bg-white"
              >
                Open Full Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD ANALYTICS & STATS STRIP */}
      <section className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#3347F2]">
              YOUR ACTIVITY &amp; METRICS
            </p>
            <h2 className={`${D} mt-1 text-2xl font-extrabold text-[#0F1226]`}>
              Dashboard Analytics
            </h2>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#3347F2] hover:underline"
          >
            Detailed reports <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Attendance Stat */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#DDE0F0] bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7086]">Attendance</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#15803D]/10 text-[#15803D]">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className={`${D} text-3xl font-extrabold text-[#0F1226]`}>
                  {attendanceStats.percentage}%
                </span>
                <span className="text-xs font-medium text-[#15803D]">
                  {attendanceStats.attended}/{attendanceStats.eligibleMeetings} attended
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

          {/* Meetings Stat */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#DDE0F0] bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7086]">Society Meetings</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3347F2]/10 text-[#3347F2]">
                <Video className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className={`${D} text-3xl font-extrabold text-[#0F1226]`}>
                {meetings.length}
              </span>
              <p className="mt-1 text-xs text-[#6B7086]">Scheduled sessions</p>
            </div>
          </div>

          {/* Projects Stat */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#DDE0F0] bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7086]">Active Projects</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F766E]/10 text-[#0F766E]">
                <FolderGit2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className={`${D} text-3xl font-extrabold text-[#0F1226]`}>
                {projects.length}
              </span>
              <p className="mt-1 text-xs text-[#0F766E] font-medium">Society builds</p>
            </div>
          </div>

          {/* Certificates Stat */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#DDE0F0] bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7086]">Certificates</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#A16207]/10 text-[#A16207]">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className={`${D} text-3xl font-extrabold text-[#0F1226]`}>
                {certificates.length}
              </span>
              <p className="mt-1 text-xs text-[#A16207] font-medium">Credentials issued</p>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK WORKSPACE ACCESS */}
      <section className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            href="/dashboard"
            className="group flex flex-col justify-between rounded-2xl border border-[#DDE0F0] bg-white p-4 transition hover:border-[#3347F2]/40 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3347F2]/10 text-[#3347F2]">
                <CreditCard className="h-4 w-4" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#8B90A3] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold text-[#0F1226]">My Digital ID Card</p>
              <p className="text-xs text-[#6B7086]">View &amp; download credentials</p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="group flex flex-col justify-between rounded-2xl border border-[#DDE0F0] bg-white p-4 transition hover:border-[#15803D]/40 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#15803D]/10 text-[#15803D]">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#8B90A3] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold text-[#0F1226]">Attendance Record</p>
              <p className="text-xs text-[#6B7086]">Meeting history &amp; audits</p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="group flex flex-col justify-between rounded-2xl border border-[#DDE0F0] bg-white p-4 transition hover:border-[#6D4AFF]/40 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6D4AFF]/10 text-[#6D4AFF]">
                <Calendar className="h-4 w-4" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#8B90A3] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold text-[#0F1226]">Upcoming Events</p>
              <p className="text-xs text-[#6B7086]">Workshops &amp; hackathons</p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="group flex flex-col justify-between rounded-2xl border border-[#DDE0F0] bg-white p-4 transition hover:border-[#0F766E]/40 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E]">
                <FolderGit2 className="h-4 w-4" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#8B90A3] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold text-[#0F1226]">Society Projects</p>
              <p className="text-xs text-[#6B7086]">Repositories &amp; builds</p>
            </div>
          </Link>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6D4AFF]">
              SOCIETY CALENDAR
            </p>
            <h2 className={`${D} mt-1 text-2xl font-extrabold text-[#0F1226]`}>
              Events &amp; Workshops
            </h2>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3347F2] hover:underline"
          >
            View in Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[#DDE0F0] bg-white p-8 text-center text-[#6B7086]">
            <Calendar className="mx-auto h-7 w-7 opacity-50" />
            <p className="mt-2 text-sm font-bold text-[#0F1226]">No scheduled events at this moment</p>
            <p className="text-xs">Upcoming workshops and hackathons will appear here.</p>
          </div>
        ) : (
          <div className="mt-5 space-y-3.5">
            {events.slice(0, 3).map((e: any) => {
              const eventDate = e.date ? new Date(e.date) : null;
              const isValid = eventDate && !isNaN(eventDate.getTime());
              const isUpcoming = isValid ? eventDate.getTime() >= new Date().setHours(0, 0, 0, 0) : true;
              const dateString = isValid
                ? eventDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : e.date;

              return (
                <article
                  key={e._id || e.title}
                  className="flex flex-col gap-4 rounded-2xl border border-[#DDE0F0] bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#6D4AFF]/10 text-[#6D4AFF]">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            isUpcoming ? "bg-[#EAF7F0] text-[#16845B]" : "bg-[#F1F3F9] text-[#777D98]"
                          }`}
                        >
                          {isUpcoming ? "Upcoming" : "Concluded"}
                        </span>
                        <span className="text-xs font-semibold text-[#6D4AFF]">{dateString}</span>
                      </div>

                      <h3 className={`${D} text-lg font-bold text-[#0F1226]`}>{e.title}</h3>
                      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-[#0F1226]/75">
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

      {/* PROJECTS SECTION */}
      <section className="mx-auto max-w-6xl px-5 py-4 pb-12 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F766E]">
              BUILDING TOGETHER
            </p>
            <h2 className={`${D} mt-1 text-2xl font-extrabold text-[#0F1226]`}>
              Society Projects
            </h2>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:underline"
          >
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
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {projects.slice(0, 4).map((p: any) => {
              const hasExternalLink = p.link && (p.link.startsWith("http://") || p.link.startsWith("https://"));
              return (
                <article
                  key={p._id || p.title}
                  className="flex flex-col justify-between rounded-2xl border border-[#DDE0F0] bg-white p-5 shadow-sm transition hover:border-[#0F766E]/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E]">
                        <FolderGit2 className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-[#0F766E]/10 px-2.5 py-0.5 text-xs font-bold text-[#0F766E]">
                        Active Project
                      </span>
                    </div>

                    <h3 className={`${D} mt-3 text-lg font-bold text-[#0F1226]`}>{p.title}</h3>
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-[#0F1226]/75">
                      {p.description}
                    </p>
                  </div>

                  {hasExternalLink && (
                    <div className="mt-4 pt-3 border-t border-[#DDE0F0]">
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:underline"
                      >
                        <span>Open Repository / Project</span>
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

      {/* FOOTER BAR WITH PREVIEW OPTION & LOGOUT */}
      <footer className="border-t border-[#DDE0F0] bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-center sm:flex-row sm:text-left sm:px-8">
          <div>
            <p className="text-xs text-[#6B7086]">
              Signed in as <strong className="text-[#0F1226]">{user.name}</strong> ({user.email})
            </p>
            <p className="mt-0.5 text-xs text-[#8B90A3]">
              Xavier Tech Byte Society · St. Xavier&apos;s College, Ranchi
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPublicPreview(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE0F0] bg-[#F4F5FA] px-4 py-2 text-xs font-semibold text-[#0F1226] transition hover:bg-[#DDE0F0]"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview Public Landing Page</span>
            </button>

            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0F1226] px-4 py-2 text-xs font-bold text-white transition hover:bg-red-600"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </footer>
    </main>
  );
}
