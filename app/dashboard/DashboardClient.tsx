
"use client";

import { useState, useEffect, type CSSProperties, type ReactNode } from "react";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { submitResignation, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/actions";
import {
  User,
  Calendar,
  FileBadge,
  FolderGit2,
  CreditCard,
  LogOut,
  Loader2,
  Award,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Menu,
  X,
  Video,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Bell,
  Sparkles,
  CheckCheck,
} from "lucide-react";

import MemberMeetingsView from "./MemberMeetingsView";
import MemberAttendanceView from "./MemberAttendanceView";
import NotificationBell from "./NotificationBell";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const D = "font-[family-name:var(--font-display)]";

const COLORS = {
  ink: "#0F1226",
  paper: "#F4F5FA",
  blue: "#3347F2",
  gold: "#FFB627",
  mist: "#DDE0F0",
  muted: "#6B7086",
  green: "#15803D",
  red: "#B91C1C",
};

const NAV = [
  { id: "profile", label: "My Profile", icon: User, color: "#3347F2" },
  { id: "notifications", label: "Notifications", icon: Bell, color: "#E11D48" },
  { id: "meetings", label: "My Meetings", icon: Video, color: "#3347F2" },
  { id: "attendance", label: "My Attendance", icon: CheckCircle2, color: "#15803D" },
  { id: "events", label: "Events", icon: Calendar, color: "#6D4AFF" },
  { id: "projects", label: "Projects", icon: FolderGit2, color: "#0F766E" },
  { id: "certificates", label: "Certificates", icon: Award, color: "#A16207" },
  { id: "idcard", label: "My ID Card", icon: CreditCard, color: "#0369A1" },
  { id: "resign", label: "Resign", icon: LogOut, color: "#B91C1C" },
];

const cardStyle: CSSProperties = {
  background: "#FFFFFF",
  border: `1px solid ${COLORS.mist}`,
  borderRadius: 18,
  boxShadow: "0 3px 14px rgba(15,18,38,0.025)",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  background: "#FFFFFF",
  border: `1px solid ${COLORS.mist}`,
  color: COLORS.ink,
  fontSize: 14,
  outline: "none",
};

type DashboardData = {
  user: any;
  certificates: any[];
  events: any[];
  projects: any[];
  notifications?: any[];
  resignationPending: boolean;
  meetings?: any[];
  attendanceStats?: {
    eligibleMeetings: number;
    attended: number;
    absent: number;
    excused: number;
    percentage: number;
  };
};

export default function DashboardClient({ data }: { data: DashboardData }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resignLetter, setResignLetter] = useState("");
  const [resignLoading, setResignLoading] = useState(false);
  const [resignMsg, setResignMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const {
    user,
    certificates = [],
    events = [],
    projects = [],
    notifications = [],
    resignationPending,
    meetings = [],
    attendanceStats = {
      eligibleMeetings: 0,
      attended: 0,
      absent: 0,
      excused: 0,
      percentage: 100,
    },
  } = data;

  const [memberNotifications, setMemberNotifications] = useState(notifications);

  useEffect(() => {
    setMemberNotifications(notifications);
  }, [notifications]);

  const unreadNotifsCount = memberNotifications.filter((n: any) => !n.isRead).length;

  const activeItem = NAV.find((item) => item.id === activeTab) ?? NAV[0];

  async function handleResign() {
    if (!resignLetter.trim()) {
      setResignMsg({
        type: "err",
        text: "Please write your resignation letter.",
      });
      return;
    }

    if (
      !confirm(
        "Are you sure you want to submit your resignation? This cannot be undone once approved."
      )
    ) {
      return;
    }

    setResignLoading(true);
    setResignMsg(null);

    try {
      const res = await submitResignation(
        user._id,
        user.name,
        user.xts_id,
        resignLetter
      );

      if (res.error) {
        setResignMsg({ type: "err", text: res.error });
      } else {
        setResignMsg({
          type: "ok",
          text: "Your resignation letter has been submitted. The admin will review it.",
        });
        setResignLetter("");
      }
    } catch {
      setResignMsg({
        type: "err",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setResignLoading(false);
    }
  }

  function changeTab(id: string) {
    setActiveTab(id);
    setSidebarOpen(false);
  }

  function sectionHeader(
    icon: ReactNode,
    label: string,
    color: string
  ) {
    return (
      <div className="mb-7 flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: `${color}12`,
            color,
            border: `1px solid ${color}22`,
          }}
        >
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6B7086]">
            XTS Member Space
          </p>
          <h2 className={`${D} mt-0.5 text-2xl font-bold tracking-tight text-[#0F1226] sm:text-3xl`}>
            {label}
          </h2>
        </div>
      </div>
    );
  }

  function NavItems() {
    return (
      <>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => changeTab(item.id)}
              aria-current={active ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition ${
                active
                  ? "border-[#DDE0F0] bg-white font-bold text-[#0F1226] shadow-sm"
                  : "border-transparent font-medium text-[#6B7086] hover:border-[#DDE0F0] hover:bg-white/70 hover:text-[#0F1226]"
              }`}
            >
              <Icon
                className="h-[18px] w-[18px] shrink-0"
                style={{ color: item.color }}
              />

              <span className="flex-1">{item.label}</span>

              {item.id === "notifications" && unreadNotifsCount > 0 && (
                <span className="rounded-full bg-[#E11D48] px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
                  {unreadNotifsCount}
                </span>
              )}

              {item.id === "resign" && resignationPending && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  Pending
                </span>
              )}

              {active && (
                <ChevronRight className="h-4 w-4 text-[#3347F2]" />
              )}
            </button>
          );
        })}
      </>
    );
  }

  function SidebarContent({ mobile = false }: { mobile?: boolean }) {
    return (
      <>
        <div className="mb-5 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3347F2] text-white">
              <Zap className="h-5 w-5" />
            </div>

            <div>
              <p className={`${D} font-extrabold tracking-tight text-[#0F1226]`}>
                Xavier<span className="text-[#3347F2]">Tech</span>Byte
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B7086]">
                Member Platform
              </p>
            </div>
          </div>

          {mobile && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
              className="rounded-lg border border-[#DDE0F0] p-2 text-[#6B7086]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mb-5 rounded-2xl border border-[#DDE0F0] bg-white p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#DDE0F0] bg-[#F4F5FA]">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={`${user.name}'s profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-[#3347F2]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#0F1226]">
                {user.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-[#6B7086]">
                {user.xts_id}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 border-t border-[#DDE0F0] pt-3 text-xs font-medium text-[#15803D]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Member workspace
          </div>
        </div>

        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B90A3]">
          Workspace
        </p>

        <div className="flex flex-col gap-1">
          <NavItems />
        </div>

        <div className="mt-auto pt-6">
          <div className="mb-4 border-t border-[#DDE0F0]" />

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#6B7086] transition hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-[18px] w-[18px]" />
              Sign Out
            </button>
          </form>

          <p className="mt-5 px-3 text-[10px] leading-5 text-[#8B90A3]">
            Xavier Tech Byte Society
            <br />
            Member Platform
          </p>
        </div>
      </>
    );
  }

  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#F4F5FA] font-[family-name:var(--font-body)] text-[#0F1226]`}
    >
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#0F1226]/35 backdrop-blur-[2px] sm:hidden"
        />
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[258px] flex-col overflow-y-auto border-r border-[#DDE0F0] bg-[#F4F5FA] px-4 py-5 sm:flex">
        <SidebarContent />
      </aside>

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col overflow-y-auto border-r border-[#DDE0F0] bg-[#F4F5FA] px-4 py-5 shadow-2xl transition-transform duration-300 sm:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!sidebarOpen}
      >
        <SidebarContent mobile />
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-h-screen min-w-0 sm:ml-[258px]">
        {/* TOPBAR */}
        <header className="sticky top-0 z-20 border-b border-[#DDE0F0] bg-[#F4F5FA]/90 backdrop-blur-xl">
          <div className="flex min-h-[76px] items-center justify-between gap-3 px-4 py-3 sm:px-7 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation"
                className="rounded-xl border border-[#DDE0F0] bg-white p-2.5 text-[#0F1226] sm:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#3347F2]">
                  XTS / Workspace
                </p>
                <h1 className={`${D} mt-0.5 truncate text-xl font-bold tracking-tight text-[#0F1226] sm:text-2xl`}>
                  {activeTab === "profile"
                    ? `Welcome, ${user.name?.split(" ")[0] || "Member"}`
                    : activeItem.label}
                </h1>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <NotificationBell initialNotifications={memberNotifications} xts_id={user.xts_id} />

              <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#DDE0F0] bg-white px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-[#15803D]" />
                <span className="hidden text-xs font-semibold text-[#6B7086] sm:inline">
                  Member Access
                </span>
                <ShieldCheck className="h-4 w-4 text-[#3347F2] sm:hidden" />
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="max-w-5xl">
              <div className="mb-7">
                <p className="text-sm font-semibold text-[#3347F2]">
                  YOUR MEMBER SPACE
                </p>
                <h2 className={`${D} mt-2 text-3xl font-extrabold tracking-tight text-[#0F1226] sm:text-4xl`}>
                  Your XTS at a glance.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[#6B7086] sm:text-base">
                  Your membership, meetings, achievements, and community
                  activity — together in one place.
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
                {/* MEMBER IDENTITY */}
                <section
                  className="overflow-hidden rounded-3xl border border-[#DDE0F0] bg-white"
                >
                  <div className="h-2 bg-[#3347F2]" />

                  <div className="p-5 sm:p-7">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#DDE0F0] bg-[#F4F5FA]">
                        {user.profile_image ? (
                          <img
                            src={user.profile_image}
                            alt={`${user.name}'s profile`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-9 w-9 text-[#3347F2]" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#6B7086]">
                          XTS MEMBER
                        </p>
                        <h3 className={`${D} mt-1 break-words text-2xl font-extrabold text-[#0F1226]`}>
                          {user.name}
                        </h3>
                        <p className="mt-1 text-sm text-[#6B7086]">
                          {user.xts_id}
                        </p>
                      </div>

                      {user.team && (
                        <span className="rounded-full bg-[#3347F2]/10 px-3 py-1.5 text-xs font-bold text-[#3347F2]">
                          {user.team} Team
                        </span>
                      )}
                    </div>

                    <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {[
                        { label: "XTS ID", value: user.xts_id },
                        { label: "Email Address", value: user.email },
                        { label: "Phone", value: user.phone || "—" },
                        { label: "Course", value: user.course || "—" },
                        {
                          label: "Semester",
                          value: user.semester ? `Sem ${user.semester}` : "—",
                        },
                        { label: "Team", value: user.team || "Unassigned" },
                      ].map((field) => (
                        <div
                          key={field.label}
                          className="min-w-0 rounded-xl border border-[#DDE0F0] bg-[#F4F5FA]/60 p-3.5"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B90A3]">
                            {field.label}
                          </p>
                          <p className="mt-1 break-words text-sm font-semibold text-[#0F1226]">
                            {field.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* MEMBER SUMMARY */}
                <section className="rounded-3xl border border-[#DDE0F0] bg-white p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#3347F2]">
                    Your Activity
                  </p>
                  <h3 className={`${D} mt-2 text-2xl font-bold text-[#0F1226]`}>
                    Member summary
                  </h3>

                  <div className="mt-5 space-y-4">
                    {[
                      {
                        label: "Attendance",
                        value: `${attendanceStats.percentage}%`,
                        icon: CheckCircle2,
                        color: "#15803D",
                      },
                      {
                        label: "Meetings",
                        value: meetings.length,
                        icon: Video,
                        color: "#3347F2",
                      },
                      {
                        label: "Certificates",
                        value: certificates.length,
                        icon: Award,
                        color: "#A16207",
                      },
                      {
                        label: "Events",
                        value: events.length,
                        icon: Calendar,
                        color: "#6D4AFF",
                      },
                      {
                        label: "Projects",
                        value: projects.length,
                        icon: FolderGit2,
                        color: "#0F766E",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="flex items-center justify-between border-b border-[#DDE0F0] pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <stat.icon
                            className="h-[18px] w-[18px]"
                            style={{ color: stat.color }}
                          />
                          <span className="text-sm font-medium text-[#6B7086]">
                            {stat.label}
                          </span>
                        </div>
                        <span className={`${D} text-xl font-bold text-[#0F1226]`}>
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* QUICK NAVIGATION */}
              <div className="mt-7">
                <h3 className={`${D} text-xl font-bold text-[#0F1226]`}>
                  Quick access
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      id: "meetings",
                      title: "My Meetings",
                      text: "View your meetings",
                      icon: Video,
                      color: "#3347F2",
                    },
                    {
                      id: "attendance",
                      title: "My Attendance",
                      text: "Check attendance records",
                      icon: CheckCircle2,
                      color: "#15803D",
                    },
                    {
                      id: "certificates",
                      title: "Certificates",
                      text: "Access your achievements",
                      icon: Award,
                      color: "#A16207",
                    },
                    {
                      id: "projects",
                      title: "Projects",
                      text: "Explore project details",
                      icon: FolderGit2,
                      color: "#0F766E",
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => changeTab(item.id)}
                      className="flex items-center gap-3 rounded-2xl border border-[#DDE0F0] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#3347F2]/40 hover:shadow-md"
                    >
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          background: `${item.color}12`,
                          color: item.color,
                        }}
                      >
                        <item.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-[#0F1226]">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-xs text-[#6B7086]">
                          {item.text}
                        </span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-[#8B90A3]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="max-w-5xl">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                {sectionHeader(
                  <Bell className="h-5 w-5" />,
                  "Notifications & Announcements",
                  "#E11D48"
                )}

                {unreadNotifsCount > 0 && (
                  <button
                    type="button"
                    onClick={async () => {
                      setMemberNotifications((prev: any) =>
                        prev.map((n: any) => ({ ...n, isRead: true }))
                      );
                      await markAllNotificationsAsRead(user.xts_id);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#DDE0F0] bg-white px-4 py-2 text-xs font-bold text-[#3347F2] shadow-sm transition hover:bg-[#3347F2] hover:text-white"
                  >
                    <CheckCheck className="h-4 w-4" />
                    Mark all as read
                  </button>
                )}
              </div>

              {memberNotifications.length === 0 ? (
                <EmptyState
                  icon={<Bell className="h-7 w-7" />}
                  title="No notifications yet"
                  description="Updates regarding events, projects, meetings, and society activities will appear here."
                />
              ) : (
                <div className="space-y-3">
                  {memberNotifications.map((notif: any) => {
                    const isRead = notif.isRead;
                    return (
                      <article
                        key={notif._id}
                        className={`flex flex-col gap-4 rounded-2xl border p-5 transition ${
                          isRead
                            ? "border-[#DDE0F0] bg-white text-[#6B7086]"
                            : "border-[#3347F2]/30 bg-white shadow-sm ring-1 ring-[#3347F2]/10"
                        } sm:flex-row sm:items-start sm:justify-between`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                              notif.type.startsWith("event")
                                ? "bg-[#6D4AFF]/10 text-[#6D4AFF]"
                                : notif.type.startsWith("project")
                                ? "bg-[#0F766E]/10 text-[#0F766E]"
                                : notif.type === "welcome"
                                ? "bg-[#FFB627]/20 text-[#D97706]"
                                : "bg-[#3347F2]/10 text-[#3347F2]"
                            }`}
                          >
                            {notif.type.startsWith("event") ? (
                              <Calendar className="h-5 w-5" />
                            ) : notif.type.startsWith("project") ? (
                              <FolderGit2 className="h-5 w-5" />
                            ) : notif.type === "welcome" ? (
                              <Sparkles className="h-5 w-5" />
                            ) : (
                              <Bell className="h-5 w-5" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              {!isRead && (
                                <span className="rounded-full bg-[#3347F2] px-2 py-0.5 text-[10px] font-bold text-white">
                                  NEW
                                </span>
                              )}
                              <span className="text-xs font-semibold text-[#8B90A3]">
                                {new Date(notif.createdAt).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>

                            <h3 className={`${D} text-lg font-bold text-[#0F1226]`}>
                              {notif.title}
                            </h3>

                            <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-[#0F1226]/75">
                              {notif.message}
                            </p>
                          </div>
                        </div>

                        {!isRead && (
                          <button
                            type="button"
                            onClick={async () => {
                              setMemberNotifications((prev: any) =>
                                prev.map((n: any) =>
                                  n._id === notif._id ? { ...n, isRead: true } : n
                                )
                              );
                              await markNotificationAsRead(notif._id, user.xts_id);
                            }}
                            className="shrink-0 self-end sm:self-center rounded-xl border border-[#DDE0F0] bg-[#F4F5FA] px-3 py-1.5 text-xs font-semibold text-[#0F1226] transition hover:bg-[#3347F2] hover:text-white"
                          >
                            Mark read
                          </button>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* MEETINGS */}
          {activeTab === "meetings" && (
            <div className="max-w-5xl">
              {sectionHeader(
                <Video className="h-5 w-5" />,
                "My Meetings",
                "#3347F2"
              )}
              <MemberMeetingsView
                meetings={meetings}
                cardStyle={cardStyle}
                sectionHeader={sectionHeader}
              />
            </div>
          )}

          {/* ATTENDANCE */}
          {activeTab === "attendance" && (
            <div className="max-w-5xl">
              {sectionHeader(
                <CheckCircle2 className="h-5 w-5" />,
                "My Attendance",
                "#15803D"
              )}
              <MemberAttendanceView
                meetings={meetings}
                stats={attendanceStats}
                cardStyle={cardStyle}
                sectionHeader={sectionHeader}
              />
            </div>
          )}

          {/* EVENTS */}
          {activeTab === "events" && (
            <div className="max-w-5xl">
              {sectionHeader(
                <Calendar className="h-5 w-5" />,
                "Events & Workshops",
                "#6D4AFF"
              )}

              {events.length === 0 ? (
                <EmptyState
                  icon={<Calendar className="h-7 w-7" />}
                  title="No upcoming events"
                  description="New XTS event announcements will appear here."
                />
              ) : (
                <div className="space-y-4">
                  {events.map((event: any) => {
                    const eventDate = new Date(event.date);
                    const isValidDate = !isNaN(eventDate.getTime());
                    const isUpcoming = isValidDate ? eventDate.getTime() >= new Date().setHours(0, 0, 0, 0) : true;
                    const dateFormatted = isValidDate
                      ? eventDate.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : event.date;

                    return (
                      <article
                        key={event._id}
                        className="flex flex-col gap-4 rounded-2xl border border-[#DDE0F0] bg-white p-6 shadow-sm transition hover:shadow-md sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6D4AFF]/10 text-[#6D4AFF]">
                            <Calendar className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                  isUpcoming
                                    ? "bg-[#EAF7F0] text-[#16845B]"
                                    : "bg-[#F1F3F9] text-[#777D98]"
                                }`}
                              >
                                {isUpcoming ? "Upcoming" : "Concluded"}
                              </span>
                              <span className="text-xs font-semibold text-[#6D4AFF]">
                                {dateFormatted}
                              </span>
                            </div>

                            <h3 className={`${D} text-xl font-bold text-[#0F1226]`}>
                              {event.title}
                            </h3>

                            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#0F1226]/75">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* PROJECTS */}
          {activeTab === "projects" && (
            <div className="max-w-5xl">
              {sectionHeader(
                <FolderGit2 className="h-5 w-5" />,
                "Society Projects",
                "#0F766E"
              )}

              {projects.length === 0 ? (
                <EmptyState
                  icon={<FolderGit2 className="h-7 w-7" />}
                  title="No projects available"
                  description="Active society projects and products will appear here."
                />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {projects.map((project: any) => (
                    <article
                      key={project._id}
                      className="flex flex-col justify-between rounded-2xl border border-[#DDE0F0] bg-white p-6 shadow-sm transition hover:border-[#0F766E]/40 hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E]">
                            <FolderGit2 className="h-5 w-5" />
                          </div>
                          <span className="rounded-full bg-[#0F766E]/10 px-3 py-1 text-xs font-bold text-[#0F766E]">
                            Active Project
                          </span>
                        </div>

                        <h3 className={`${D} mt-4 text-xl font-bold text-[#0F1226]`}>
                          {project.title}
                        </h3>

                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#0F1226]/75">
                          {project.description}
                        </p>
                      </div>

                      {project.link && (
                        <div className="mt-6 pt-4 border-t border-[#DDE0F0]">
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#0F766E] transition hover:text-[#0F766E]/80"
                          >
                            <span>Open Project Repository / Link</span>
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CERTIFICATES */}
          {activeTab === "certificates" && (
            <div className="max-w-5xl">
              {sectionHeader(
                <Award className="h-5 w-5" />,
                "My Certificates",
                "#A16207"
              )}

              {certificates.length === 0 ? (
                <EmptyState
                  icon={<Award className="h-7 w-7" />}
                  title="Your achievements start here"
                  description="Certificates issued to you by XTS will appear here."
                />
              ) : (
                <div className="space-y-3">
                  {certificates.map((certificate: any) => (
                    <a
                      key={certificate._id}
                      href={certificate.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-2xl border border-[#DDE0F0] bg-white p-4 transition hover:border-[#A16207]/40 hover:shadow-md sm:p-5"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFB627]/20 text-[#A16207]">
                        <FileBadge className="h-6 w-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className={`${D} break-words font-bold text-[#0F1226]`}>
                          {certificate.title}
                        </h3>
                        <p className="mt-1 text-xs text-[#6B7086]">
                          Issued:{" "}
                          {new Date(
                            certificate.date_issued
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <ArrowUpRight className="h-5 w-5 shrink-0 text-[#8B90A3] transition group-hover:text-[#A16207]" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ID CARD */}
          {activeTab === "idcard" && (
            <div className="max-w-xl">
              {sectionHeader(
                <CreditCard className="h-5 w-5" />,
                "My XTS ID Card",
                "#0369A1"
              )}

              {user.id_card_url ? (
                <div className="rounded-3xl border border-[#DDE0F0] bg-white p-4 sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0369A1]/10 text-[#0369A1]">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className={`${D} font-bold text-[#0F1226]`}>
                        Member Identification
                      </h3>
                      <p className="mt-1 text-xs text-[#6B7086]">
                        Your XTS-issued ID card
                      </p>
                    </div>
                  </div>

                  <img
                    src={user.id_card_url}
                    alt="XTS Member ID Card"
                    className="w-full rounded-xl border border-[#DDE0F0]"
                  />

                  <a
                    href={user.id_card_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3347F2] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#0F1226]"
                  >
                    Open Full Size
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <EmptyState
                  icon={<CreditCard className="h-7 w-7" />}
                  title="ID card not available yet"
                  description="Please contact your XTS administrator if you need your ID card."
                />
              )}
            </div>
          )}

          {/* RESIGNATION */}
          {activeTab === "resign" && (
            <div className="max-w-2xl">
              {sectionHeader(
                <LogOut className="h-5 w-5" />,
                "Resign from XTS",
                "#B91C1C"
              )}

              {resignationPending ? (
                <div className="rounded-3xl border border-amber-200 bg-white p-7 text-center sm:p-10">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <Clock className="h-7 w-7" />
                  </div>
                  <h3 className={`${D} mt-5 text-2xl font-bold text-[#0F1226]`}>
                    Resignation Pending
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#6B7086]">
                    Your resignation letter has been submitted and is under
                    review by the admin. You will be notified once a decision
                    is made.
                  </p>
                  <span className="mt-5 inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-bold text-amber-800">
                    Awaiting review
                  </span>
                </div>
              ) : (
                <div className="rounded-3xl border border-[#DDE0F0] bg-white p-5 sm:p-8">
                  <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
                    <div>
                      <p className="text-sm font-bold text-red-800">
                        Important notice
                      </p>
                      <p className="mt-1 text-sm leading-6 text-red-700">
                        Once the admin approves your resignation, your account
                        will be permanently deleted. This action cannot be
                        reversed.
                      </p>
                    </div>
                  </div>

                  {resignMsg && (
                    <div
                      role="alert"
                      className={`mt-5 flex items-start gap-3 rounded-xl border p-4 ${
                        resignMsg.type === "ok"
                          ? "border-green-200 bg-green-50 text-green-800"
                          : "border-red-200 bg-red-50 text-red-800"
                      }`}
                    >
                      {resignMsg.type === "ok" ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                      ) : (
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                      )}
                      <p className="text-sm leading-6">{resignMsg.text}</p>
                    </div>
                  )}

                  <div className="mt-6">
                    <label
                      htmlFor="resignation-letter"
                      className="mb-2 block text-sm font-bold text-[#0F1226]"
                    >
                      Resignation Letter{" "}
                      <span className="text-red-600">*</span>
                    </label>

                    <textarea
                      id="resignation-letter"
                      value={resignLetter}
                      onChange={(event) => setResignLetter(event.target.value)}
                      rows={7}
                      required
                      disabled={resignLoading}
                      placeholder="Write your resignation letter here. Explain your reason for leaving XTS..."
                      className="w-full resize-y rounded-xl border border-[#DDE0F0] bg-white px-4 py-3.5 text-sm leading-7 text-[#0F1226] outline-none transition placeholder:text-[#8B90A3] focus:border-[#3347F2] focus:ring-4 focus:ring-[#3347F2]/10 disabled:opacity-60"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleResign}
                    disabled={resignLoading}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#B91C1C] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#991B1B] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resignLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <LogOut className="h-4 w-4" />
                        Submit Resignation Letter
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FOOTER */}
          <footer className="mt-12 flex flex-col gap-2 border-t border-[#DDE0F0] pt-5 text-xs text-[#8B90A3] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Xavier Tech Byte Society
            </p>
            <p>Built with purpose. Driven by innovation.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-[#DDE0F0] bg-white px-6 py-12 text-center sm:py-16">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4F5FA] text-[#3347F2]">
        {icon}
      </div>
      <h3 className={`${D} mt-5 text-xl font-bold text-[#0F1226]`}>
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-[#6B7086]">
        {description}
      </p>
    </div>
  );
}
