'use client';

import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { useState, useEffect } from 'react';
import {
  createMember,
  createCertificate,
  createEvent,
  updateEvent,
  deleteEvent,
  createProject,
  updateProject,
  deleteProject,
  updateMember,
  deleteMember,
  approveResignation,
  rejectResignation,
} from '@/lib/actions';
import {
  Users,
  FileBadge,
  Calendar,
  FolderGit2,
  Plus,
  Loader2,
  QrCode,
  Pencil,
  Trash2,
  X,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  Download,
  Video,
  ShieldCheck,
  Search,
  ArrowUpDown,
  UserPlus,
  Shield,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Activity,
  Smartphone,
  Monitor,
  RefreshCw,
  BarChart3,
} from 'lucide-react';
import MeetingAdminSection from './MeetingAdminSection';

const C = {
  ink: '#0F1226',
  paper: '#F4F5FA',
  white: '#FFFFFF',
  blue: '#3347F2',
  blueLight: '#EEF0FF',
  gold: '#FFB627',
  border: '#DDE0F0',
  muted: '#777D98',
  subtle: '#A0A5BA',
  green: '#16845B',
  greenBg: '#EAF7F0',
  red: '#C43D4B',
  redBg: '#FFF0F1',
  amber: '#986500',
  amberBg: '#FFF7E5',
};

const NAV = [
  { id: 'analytics', label: 'App Analytics', icon: Activity, description: 'Live visitors & installs' },
  { id: 'members', label: 'Add Member', icon: Plus, description: 'Register a member' },
  { id: 'view_members', label: 'Members', icon: Users, description: 'Manage member records' },
  { id: 'meetings', label: 'Meetings', icon: Video, description: 'Coordinate meetings' },
  { id: 'certificates', label: 'Certificates', icon: FileBadge, description: 'Issue certificates' },
  { id: 'events', label: 'Events', icon: Calendar, description: 'Manage events' },
  { id: 'projects', label: 'Projects', icon: FolderGit2, description: 'Track projects' },
  { id: 'resignations', label: 'Resignations', icon: LogOut, description: 'Review requests' },
];

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box' as const,
  padding: '11px 13px',
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  background: C.white,
  color: C.ink,
  fontSize: 13,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: C.muted,
  marginBottom: 7,
};

const cardStyle = {
  background: C.white,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(15,18,38,0.035)',
};

const primaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '11px 16px',
  borderRadius: 10,
  border: 'none',
  cursor: 'pointer',
  background: C.blue,
  color: C.white,
  fontWeight: 700,
  fontSize: 13,
  transition: 'background 0.2s, transform 0.2s',
};

const secondaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 7,
  padding: '9px 12px',
  borderRadius: 9,
  border: `1px solid ${C.border}`,
  cursor: 'pointer',
  background: C.white,
  color: C.ink,
  fontWeight: 600,
  fontSize: 12,
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p
        style={{
          margin: '0 0 7px',
          color: C.blue,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        {eyebrow}
      </p>

      <h2
        style={{
          color: C.ink,
          fontSize: 23,
          fontWeight: 800,
          letterSpacing: '-0.045em',
          margin: 0,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: '7px 0 0',
          color: C.muted,
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ minWidth: 0 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function AdminClient({
  initialData,
}: {
  initialData: any;
}) {
  const [activeTab, setActiveTab] = useState('members');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingMember, setEditingMember] = useState<any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [qrMember, setQrMember] = useState<string | null>(null);
  const [addPreview, setAddPreview] = useState<string | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [resLoading, setResLoading] = useState<string | null>(null);
  const [filterTeam, setFilterTeam] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchName, setSearchName] = useState('');

  const {
    members = [],
    certificates = [],
    events = [],
    projects = [],
    resignations = [],
    meetings = [],
    analytics: initialAnalytics = null,
  } = initialData || {};

  const pendingCount = resignations.filter(
    (r: any) => r.status === 'pending'
  ).length;

  // ── Analytics live state ──────────────────────────────────────────────────
  const [analyticsData, setAnalyticsData] = useState<any>(initialAnalytics);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const refreshAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch('/api/analytics/track');
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (e) {
      console.error('Analytics refresh failed:', e);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Auto-refresh analytics every 30 seconds when on analytics tab
  useEffect(() => {
    if (activeTab !== 'analytics') return;
    refreshAnalytics();
    const interval = setInterval(refreshAnalytics, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleAction = async (
    action: (formData: FormData) => Promise<any>,
    formData: FormData
  ) => {
    setLoading(true);
    setMessage('');

    try {
      const res = await action(formData);

      if (res?.error) {
        setMessage(`Error: ${res.error}`);
      } else {
        setMessage('Success! Changes saved.');
        window.location.reload();
      }
    } catch {
      setMessage('Error: Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this member? This action cannot be undone.')) return;

    setLoading(true);
    setMessage('');

    try {
      const res = await deleteMember(id);

      if (res?.error) {
        setMessage(`Error: ${res.error}`);
      } else {
        window.location.reload();
      }
    } catch {
      setMessage('Error: Unable to delete member.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Delete this event? It will also be removed from the public website.')) return;

    setLoading(true);
    setMessage('');

    try {
      const res = await deleteEvent(id);
      if (res?.error) {
        setMessage(`Error: ${res.error}`);
      } else {
        window.location.reload();
      }
    } catch {
      setMessage('Error: Unable to delete event.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Delete this project? It will also be removed from the public website.')) return;

    setLoading(true);
    setMessage('');

    try {
      const res = await deleteProject(id);
      if (res?.error) {
        setMessage(`Error: ${res.error}`);
      } else {
        window.location.reload();
      }
    } catch {
      setMessage('Error: Unable to delete project.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (
      !confirm(
        'Approve this resignation? The member account will be permanently deleted.'
      )
    ) {
      return;
    }

    setResLoading(id);
    setMessage('');

    try {
      const res = await approveResignation(id);

      if (res?.error) {
        setMessage(`Error: ${res.error}`);
      } else {
        window.location.reload();
      }
    } catch {
      setMessage('Error: Unable to process resignation.');
    } finally {
      setResLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject and remove this resignation request?')) return;

    setResLoading(id);
    setMessage('');

    try {
      const res = await rejectResignation(id);

      if (res?.error) {
        setMessage(`Error: ${res.error}`);
      } else {
        window.location.reload();
      }
    } catch {
      setMessage('Error: Unable to reject resignation.');
    } finally {
      setResLoading(null);
    }
  };

  const exportMembers = (filtered: any[]) => {
    const headers = [
      'Name',
      'XTS ID',
      'Email',
      'Phone',
      'Course',
      'Semester',
      'Team',
    ];

    const rows = filtered.map((m: any) => [
      m.name || '',
      m.xts_id || '',
      m.email || '',
      m.phone || '',
      m.course || '',
      m.semester || '',
      m.team || '',
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const link = document.createElement('a');
    link.href = URL.createObjectURL(
      new Blob(['\uFEFF', csv], {
        type: 'text/csv;charset=utf-8;',
      })
    );
    link.download = 'XTS_members_export.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setPreview: (value: string | null) => void
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB. Please choose a smaller image.');
      event.target.value = '';
      setPreview(null);
      return;
    }

    setPreview(URL.createObjectURL(file));
  };

  const selectedNav = NAV.find((item) => item.id === activeTab);

  const teams = Array.from(
    new Set(members.map((m: any) => m.team).filter(Boolean))
  ) as string[];

  const xtsKey = (xtsId: string) => {
    const parts = (xtsId || '').split('-');
    const year = parseInt(parts[1] || '0', 10);
    const number = parseInt(parts[2] || '0', 10);

    return year * 10000 + number;
  };

  const filteredMembers = [...members]
    .filter((m: any) => !filterTeam || m.team === filterTeam)
    .filter((m: any) =>
      !searchName ||
      (m.name || '').toLowerCase().includes(searchName.toLowerCase()) ||
      (m.xts_id || '').toLowerCase().includes(searchName.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(searchName.toLowerCase())
    )
    .sort((a: any, b: any) => {
      const difference = xtsKey(a.xts_id) - xtsKey(b.xts_id);
      return sortOrder === 'asc' ? difference : -difference;
    });

  return (
    <div className="xts-admin" style={{ color: C.ink, width: '100%' }}>
      <style>{`
        .xts-admin,
        .xts-admin * {
          box-sizing: border-box;
        }

        .xts-admin input:focus,
        .xts-admin select:focus,
        .xts-admin textarea:focus {
          border-color: ${C.blue} !important;
          box-shadow: 0 0 0 3px rgba(51, 71, 242, 0.09);
          outline: none;
        }

        .xts-admin button:disabled {
          opacity: 0.55;
          cursor: not-allowed !important;
        }

        .xts-admin button:not(:disabled) {
          -webkit-tap-highlight-color: transparent;
        }

        .xts-admin .xts-nav-button:hover {
          background: ${C.blueLight} !important;
          color: ${C.blue} !important;
        }

        .xts-admin .xts-table-row:hover {
          background: #F8F9FF;
        }

        .xts-admin .xts-action-button:hover {
          transform: translateY(-1px);
        }

        .xts-admin .xts-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .xts-admin .xts-admin-layout {
          display: grid;
          grid-template-columns: 225px minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }

        .xts-admin .xts-sidebar {
          position: sticky;
          top: 20px;
        }

        .xts-admin .xts-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(15, 18, 38, 0.48);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        @media (max-width: 900px) {
          .xts-admin .xts-admin-layout {
            grid-template-columns: 1fr;
          }

          .xts-admin .xts-sidebar {
            position: static;
          }

          .xts-admin .xts-nav-list {
            display: flex !important;
            overflow-x: auto;
            padding-bottom: 6px;
          }

          .xts-admin .xts-nav-button {
            min-width: max-content;
          }

          .xts-admin .xts-nav-description {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .xts-admin .xts-form-grid {
            grid-template-columns: 1fr;
          }

          .xts-admin .xts-main-card {
            padding: 18px !important;
          }

          .xts-admin .xts-welcome {
            padding: 22px !important;
          }

          .xts-admin .xts-welcome-title {
            font-size: 25px !important;
          }

          .xts-admin .xts-profile-row {
            align-items: flex-start !important;
          }
        }

        /* Refined XTS admin visual system */
        .xts-admin {
          min-height: 100vh;
          padding: clamp(16px, 2.5vw, 34px);
          background:
            radial-gradient(circle at 8% 0%, rgba(80, 100, 255, 0.07), transparent 28rem),
            #f6f7fb;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .xts-admin h1,
        .xts-admin h2,
        .xts-admin h3,
        .xts-admin p {
          overflow-wrap: anywhere;
        }

        .xts-admin button {
          font-family: inherit;
          transition: transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
        }

        .xts-admin button:not(:disabled):hover {
          box-shadow: 0 5px 14px rgba(28, 43, 105, .08);
        }

        .xts-admin button:not(:disabled):active {
          transform: translateY(1px);
        }

        .xts-admin input,
        .xts-admin select,
        .xts-admin textarea {
          font-family: inherit;
          min-height: 42px;
        }

        .xts-admin textarea {
          min-height: 110px;
        }

        .xts-admin .xts-admin-layout {
          grid-template-columns: 248px minmax(0, 1fr);
          gap: 20px;
        }

        .xts-admin .xts-sidebar,
        .xts-admin .xts-main-card {
          border-color: #e5e8f2 !important;
          border-radius: 20px !important;
          box-shadow: 0 10px 35px rgba(24, 34, 75, .045) !important;
        }

        .xts-admin .xts-sidebar {
          padding: 14px !important;
          background: rgba(255,255,255,.92) !important;
        }

        .xts-admin .xts-main-card {
          padding: clamp(18px, 2.2vw, 30px) !important;
          background: rgba(255,255,255,.96) !important;
        }

        .xts-admin .xts-welcome {
          border-radius: 24px !important;
          padding: clamp(24px, 4vw, 42px) !important;
          box-shadow: 0 14px 42px rgba(42, 57, 160, .055);
        }

        .xts-admin .xts-welcome-title {
          max-width: 700px;
          line-height: 1.08 !important;
          letter-spacing: -.055em !important;
        }

        .xts-admin .xts-nav-button {
          min-height: 58px;
          padding: 9px 10px !important;
        }

        .xts-admin .xts-nav-button:hover {
          transform: translateX(2px);
        }

        .xts-admin .xts-form-grid {
          gap: 18px;
        }

        .xts-admin table th {
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .xts-admin .xts-table-row:last-child {
          border-bottom: 0 !important;
        }

        .xts-admin .xts-modal-overlay {
          overflow-y: auto;
          padding: 20px;
        }

        .xts-admin .xts-modal-overlay > div {
          max-height: calc(100dvh - 40px);
          overflow-y: auto;
        }

        .xts-admin :focus-visible {
          outline: 3px solid rgba(51, 71, 242, .25);
          outline-offset: 2px;
        }

        @media (max-width: 1100px) {
          .xts-admin .xts-admin-layout {
            grid-template-columns: 1fr;
          }

          .xts-admin .xts-sidebar {
            position: static;
          }

          .xts-admin .xts-nav-list {
            display: flex !important;
            flex-direction: row !important;
            overflow-x: auto;
            scrollbar-width: thin;
            gap: 7px !important;
          }

          .xts-admin .xts-nav-button {
            min-width: max-content;
            width: auto !important;
          }

          .xts-admin .xts-nav-description {
            display: none !important;
          }
        }

        @media (max-width: 600px) {
          .xts-admin {
            padding: 12px;
          }

          .xts-admin .xts-welcome {
            border-radius: 18px !important;
            padding: 22px !important;
          }

          .xts-admin .xts-welcome-title {
            font-size: clamp(25px, 7vw, 32px) !important;
          }

          .xts-admin .xts-main-card {
            padding: 17px !important;
            border-radius: 16px !important;
          }

          .xts-admin .xts-form-grid {
            grid-template-columns: minmax(0, 1fr) !important;
          }

          .xts-admin .xts-profile-row {
            align-items: stretch !important;
            flex-direction: column;
          }

          .xts-admin .xts-profile-row > label {
            width: 92px !important;
            height: 92px !important;
          }

          .xts-admin .xts-nav-button {
            padding: 8px !important;
          }

          .xts-admin .xts-nav-button > span:nth-child(2) {
            display: none;
          }

          .xts-admin .xts-modal-overlay {
            align-items: flex-start;
            padding: 12px;
          }

          .xts-admin .xts-modal-overlay > div {
            max-height: calc(100dvh - 24px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .xts-admin *,
          .xts-admin *::before,
          .xts-admin *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }

      `}</style>

      {/* Administration header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 13,
              background: C.ink,
              display: 'grid',
              placeItems: 'center',
              color: C.white,
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={23} />
          </div>

          <div>
            <p
              style={{
                margin: '0 0 3px',
                color: C.muted,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              Xavier Tech Byte Society
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: 21,
                color: C.ink,
                fontWeight: 800,
                letterSpacing: '-0.04em',
              }}
            >
              Administration
            </h1>
          </div>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            border: `1px solid ${C.border}`,
            background: C.white,
            padding: '8px 12px',
            borderRadius: 10,
            color: C.muted,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          <Shield size={14} color={C.blue} />
          SECURE ADMIN ACCESS
        </div>
      </div>

      {/* Administrative welcome banner */}
      <section
        className="xts-welcome"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 20,
          padding: 30,
          marginBottom: 26,
          background:
            'linear-gradient(115deg, #FFFFFF 0%, #F2F3FF 60%, #E9ECFF 100%)',
          border: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -25,
            top: -65,
            width: 230,
            height: 230,
            border: '1px solid rgba(51,71,242,0.11)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            right: 25,
            top: -20,
            width: 145,
            height: 145,
            border: '1px solid rgba(51,71,242,0.11)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 690 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '6px 10px',
              borderRadius: 7,
              background: C.white,
              border: `1px solid ${C.border}`,
              color: C.blue,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.1em',
              marginBottom: 17,
            }}
          >
            <Sparkles size={13} />
            XTS OPERATIONS CENTER
          </div>

          <h2
            className="xts-welcome-title"
            style={{
              margin: 0,
              color: C.ink,
              fontSize: 34,
              lineHeight: 1.15,
              fontWeight: 850,
              letterSpacing: '-0.055em',
            }}
          >
            Welcome back, Administrator.
          </h2>

          <p
            style={{
              maxWidth: 610,
              margin: '13px 0 20px',
              color: C.muted,
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            Your leadership drives the people, programmes, and progress of
            Xavier Tech Byte Society. Manage member records, coordinate
            meetings, oversee projects, issue certificates, and review
            administrative requests from one central workspace.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: C.ink,
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: '8px 11px',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              <ShieldCheck size={14} color={C.blue} />
              Administrative Workspace
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: C.ink,
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: '8px 11px',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              <Users size={14} color={C.blue} />
              Member Operations
            </span>
          </div>
        </div>
      </section>

      {/* Overview cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
          gap: 13,
          marginBottom: 26,
        }}
      >
        {[
          {
            label: 'Total Members',
            value: members.length,
            icon: Users,
            color: C.blue,
            bg: C.blueLight,
          },
          {
            label: 'Meetings',
            value: meetings.length,
            icon: Video,
            color: '#7251C8',
            bg: '#F2EDFF',
          },
          {
            label: 'Certificates',
            value: certificates.length,
            icon: FileBadge,
            color: '#A56A00',
            bg: '#FFF5DE',
          },
          {
            label: 'Projects',
            value: projects.length,
            icon: FolderGit2,
            color: C.green,
            bg: C.greenBg,
          },
          {
            label: 'Pending Requests',
            value: pendingCount,
            icon: Clock,
            color: pendingCount ? C.red : C.green,
            bg: pendingCount ? C.redBg : C.greenBg,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              style={{
                ...cardStyle,
                padding: 17,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginBottom: 17,
                }}
              >
                <span
                  style={{
                    color: C.muted,
                    fontSize: 11,
                    fontWeight: 700,
                    lineHeight: 1.4,
                  }}
                >
                  {item.label}
                </span>

                <span
                  style={{
                    width: 32,
                    height: 32,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 9,
                    background: item.bg,
                    color: item.color,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} />
                </span>
              </div>

              <div
                style={{
                  color: C.ink,
                  fontSize: 28,
                  fontWeight: 850,
                  letterSpacing: '-0.05em',
                }}
              >
                {item.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main administration workspace */}
      <div className="xts-admin-layout">
        {/* Sidebar */}
        <aside
          className="xts-sidebar"
          style={{
            ...cardStyle,
            padding: 12,
          }}
        >
          <div
            style={{
              padding: '10px 10px 14px',
              borderBottom: `1px solid ${C.border}`,
              marginBottom: 9,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 10,
                color: C.subtle,
                letterSpacing: '0.13em',
                fontWeight: 800,
              }}
            >
              WORKSPACE
            </p>
            <p
              style={{
                margin: '5px 0 0',
                fontSize: 13,
                fontWeight: 800,
                color: C.ink,
              }}
            >
              Manage XTS
            </p>
          </div>

          <nav
            className="xts-nav-list"
            style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
          >
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className="xts-nav-button"
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    padding: '11px 10px',
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: 10,
                    border: `1px solid ${active ? '#DDE2FF' : 'transparent'}`,
                    background: active ? C.blueLight : 'transparent',
                    color: active ? C.blue : C.muted,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      background: active ? C.white : '#F5F6FB',
                      border: `1px solid ${active ? '#DDE2FF' : C.border}`,
                    }}
                  >
                    <Icon size={16} />
                  </span>

                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 12,
                        fontWeight: active ? 800 : 650,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="xts-nav-description"
                      style={{
                        display: 'block',
                        fontSize: 10,
                        marginTop: 4,
                        color: active ? '#5A67C8' : C.subtle,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.description}
                    </span>
                  </span>

                  {item.id === 'resignations' && pendingCount > 0 && (
                    <span
                      style={{
                        minWidth: 21,
                        height: 21,
                        borderRadius: 7,
                        display: 'grid',
                        placeItems: 'center',
                        padding: '0 5px',
                        background: C.red,
                        color: C.white,
                        fontSize: 10,
                        fontWeight: 800,
                      }}
                    >
                      {pendingCount}
                    </span>
                  )}

                  {active && (
                    <ChevronRight
                      size={14}
                      style={{ flexShrink: 0 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div
            style={{
              marginTop: 15,
              padding: 12,
              borderRadius: 10,
              background: '#F7F8FC',
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                color: C.ink,
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              <ShieldCheck size={15} color={C.blue} />
              Official Workspace
            </div>
            <p
              style={{
                color: C.muted,
                fontSize: 10,
                lineHeight: 1.6,
                margin: '7px 0 0',
              }}
            >
              Handle member records and society operations responsibly.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ minWidth: 0 }}>
          {message && (
            <div
              role="status"
              style={{
                padding: '13px 15px',
                marginBottom: 16,
                borderRadius: 11,
                fontSize: 12,
                fontWeight: 650,
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                background: message.startsWith('Error')
                  ? C.redBg
                  : C.greenBg,
                border: `1px solid ${
                  message.startsWith('Error') ? '#F5CDD1' : '#C9EAD9'
                }`,
                color: message.startsWith('Error') ? C.red : C.green,
              }}
            >
              {message.startsWith('Error') ? (
                <XCircle size={16} />
              ) : (
                <CheckCircle2 size={16} />
              )}
              {message}
            </div>
          )}

          <section
            className="xts-main-card"
            style={{
              ...cardStyle,
              padding: 25,
              minWidth: 0,
            }}
          >
            {/* Section title */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 24,
                paddingBottom: 19,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: C.blueLight,
                  color: C.blue,
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                {selectedNav &&
                  (() => {
                    const Icon = selectedNav.icon;
                    return <Icon size={19} />;
                  })()}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 850,
                    color: C.ink,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {selectedNav?.label}
                </h2>
                <p
                  style={{
                    margin: '4px 0 0',
                    color: C.muted,
                    fontSize: 11,
                  }}
                >
                  {selectedNav?.description}
                </p>
              </div>

              <span
                style={{
                  color: C.subtle,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                }}
              >
                XTS ADMIN
              </span>
            </div>

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div>
                    <p style={{ margin: 0, color: C.blue, fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      Live Monitoring
                    </p>
                    <h2 style={{ margin: '6px 0 4px', color: C.ink, fontSize: 23, fontWeight: 800, letterSpacing: '-0.045em' }}>
                      App Analytics
                    </h2>
                    <p style={{ margin: 0, color: C.muted, fontSize: 13 }}>
                      Real-time visitor activity and PWA install tracking for the XTS portal.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={refreshAnalytics}
                    disabled={analyticsLoading}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '9px 16px', borderRadius: 10,
                      background: C.blueLight, color: C.blue,
                      border: `1px solid #DDE2FF`, cursor: 'pointer',
                      fontSize: 12, fontWeight: 700, flexShrink: 0,
                      opacity: analyticsLoading ? 0.6 : 1,
                    }}
                  >
                    <RefreshCw size={14} style={{ animation: analyticsLoading ? 'spin 1s linear infinite' : 'none' }} />
                    {analyticsLoading ? 'Refreshing…' : 'Refresh'}
                  </button>
                </div>

                {/* LIVE METRICS GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                  {/* Currently Visiting */}
                  <div style={{ ...cardStyle, padding: '20px 22px', borderLeft: '4px solid #22C55E', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 10, right: 14, width: 10, height: 10, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 0 4px rgba(34,197,94,0.2)', animation: 'pulse 2s ease-in-out infinite' }} />
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: '#15803D', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      Currently Visiting
                    </p>
                    <p style={{ margin: '8px 0 0', fontSize: 36, fontWeight: 900, color: C.ink, letterSpacing: '-0.04em', lineHeight: 1 }}>
                      {analyticsData?.currentlyVisiting ?? '—'}
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: 11, color: C.muted }}>Active in last 3 minutes</p>
                  </div>

                  {/* App Downloads */}
                  <div style={{ ...cardStyle, padding: '20px 22px', borderLeft: '4px solid #3347F2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                      <Smartphone size={14} color={C.blue} />
                      <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: C.blue, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        App Downloads
                      </p>
                    </div>
                    <p style={{ margin: 0, fontSize: 36, fontWeight: 900, color: C.ink, letterSpacing: '-0.04em', lineHeight: 1 }}>
                      {analyticsData?.totalAppInstalls ?? '—'}
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: 11, color: C.muted }}>PWA installs detected</p>
                  </div>

                  {/* Visits Today */}
                  <div style={{ ...cardStyle, padding: '20px 22px', borderLeft: '4px solid #FFB627' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                      <BarChart3 size={14} color="#A16207" />
                      <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: '#A16207', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        Visits Today
                      </p>
                    </div>
                    <p style={{ margin: 0, fontSize: 36, fontWeight: 900, color: C.ink, letterSpacing: '-0.04em', lineHeight: 1 }}>
                      {analyticsData?.totalVisitsToday ?? '—'}
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: 11, color: C.muted }}>Unique sessions today</p>
                  </div>

                  {/* All-Time Visits */}
                  <div style={{ ...cardStyle, padding: '20px 22px', borderLeft: '4px solid #6D4AFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                      <Activity size={14} color="#6D4AFF" />
                      <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: '#6D4AFF', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        Total Sessions
                      </p>
                    </div>
                    <p style={{ margin: 0, fontSize: 36, fontWeight: 900, color: C.ink, letterSpacing: '-0.04em', lineHeight: 1 }}>
                      {analyticsData?.totalVisitsAllTime ?? '—'}
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: 11, color: C.muted }}>All-time sessions logged</p>
                  </div>
                </div>

                {/* DEVICE BREAKDOWN */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                  <div style={{ ...cardStyle, padding: '18px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: '#EEF0FF', display: 'grid', placeItems: 'center' }}>
                          <Smartphone size={16} color={C.blue} />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: C.ink }}>Mobile Visitors</p>
                          <p style={{ margin: 0, fontSize: 10, color: C.muted }}>Touch-screen devices</p>
                        </div>
                      </div>
                      <span style={{ fontSize: 24, fontWeight: 900, color: C.blue }}>
                        {analyticsData?.mobileVisits ?? 0}
                      </span>
                    </div>
                    <div style={{ height: 8, borderRadius: 6, background: '#F1F3F9', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 6, background: C.blue,
                        width: analyticsData?.totalVisitsAllTime
                          ? `${Math.round((analyticsData.mobileVisits / analyticsData.totalVisitsAllTime) * 100)}%`
                          : '0%',
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: 10, color: C.muted }}>
                      {analyticsData?.totalVisitsAllTime
                        ? `${Math.round((analyticsData.mobileVisits / analyticsData.totalVisitsAllTime) * 100)}% of total`
                        : 'No data yet'}
                    </p>
                  </div>

                  <div style={{ ...cardStyle, padding: '18px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: '#F0FAF6', display: 'grid', placeItems: 'center' }}>
                          <Monitor size={16} color="#15803D" />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: C.ink }}>Desktop Visitors</p>
                          <p style={{ margin: 0, fontSize: 10, color: C.muted }}>Laptop / PC sessions</p>
                        </div>
                      </div>
                      <span style={{ fontSize: 24, fontWeight: 900, color: '#15803D' }}>
                        {analyticsData?.desktopVisits ?? 0}
                      </span>
                    </div>
                    <div style={{ height: 8, borderRadius: 6, background: '#F1F3F9', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 6, background: '#15803D',
                        width: analyticsData?.totalVisitsAllTime
                          ? `${Math.round((analyticsData.desktopVisits / analyticsData.totalVisitsAllTime) * 100)}%`
                          : '0%',
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: 10, color: C.muted }}>
                      {analyticsData?.totalVisitsAllTime
                        ? `${Math.round((analyticsData.desktopVisits / analyticsData.totalVisitsAllTime) * 100)}% of total`
                        : 'No data yet'}
                    </p>
                  </div>
                </div>

                {/* RECENT VISITORS TABLE */}
                <div style={{ ...cardStyle, padding: '20px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: C.blueLight, display: 'grid', placeItems: 'center', color: C.blue }}>
                      <Activity size={16} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.ink }}>Recent Sessions</p>
                      <p style={{ margin: 0, fontSize: 10, color: C.muted }}>Latest 10 activity logs</p>
                    </div>
                  </div>

                  {!analyticsData?.recentVisitors?.length ? (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: C.muted }}>
                      <Activity size={32} style={{ opacity: 0.3, margin: '0 auto 10px', display: 'block' }} />
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.ink }}>No sessions recorded yet</p>
                      <p style={{ margin: '4px 0 0', fontSize: 12 }}>Visitors will appear here once they access the portal.</p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                            {['Visitor ID', 'Device', 'Page', 'Installed App', 'Last Seen'].map((h) => (
                              <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData.recentVisitors.map((v: any, i: number) => {
                            const lastSeen = v.lastActive ? new Date(v.lastActive) : null;
                            const minsAgo = lastSeen ? Math.round((Date.now() - lastSeen.getTime()) / 60000) : null;
                            const timeLabel = minsAgo !== null
                              ? minsAgo < 1 ? 'Just now'
                                : minsAgo < 60 ? `${minsAgo}m ago`
                                : minsAgo < 1440 ? `${Math.round(minsAgo / 60)}h ago`
                                : lastSeen!.toLocaleDateString()
                              : '—';

                            return (
                              <tr key={v._id || i} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.15s' }}
                                onMouseEnter={e => (e.currentTarget.style.background = C.paper)}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                              >
                                <td style={{ padding: '10px 10px', color: C.muted, fontFamily: 'monospace', fontSize: 11 }}>
                                  {String(v.visitorId).slice(0, 14)}…
                                </td>
                                <td style={{ padding: '10px 10px' }}>
                                  <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 5,
                                    padding: '3px 8px', borderRadius: 6,
                                    background: v.device === 'mobile' ? '#EEF0FF' : '#F0FAF6',
                                    color: v.device === 'mobile' ? C.blue : '#15803D',
                                    fontSize: 11, fontWeight: 700,
                                  }}>
                                    {v.device === 'mobile' ? <Smartphone size={11} /> : <Monitor size={11} />}
                                    {v.device === 'mobile' ? 'Mobile' : 'Desktop'}
                                  </span>
                                </td>
                                <td style={{ padding: '10px 10px', color: C.ink, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {v.path || '/'}
                                </td>
                                <td style={{ padding: '10px 10px' }}>
                                  {v.installedApp || v.isStandalone ? (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6, background: '#EAF7F0', color: '#15803D', fontSize: 11, fontWeight: 700 }}>
                                      <CheckCircle2 size={11} />
                                      Installed
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: 11, color: C.subtle }}>Browser</span>
                                  )}
                                </td>
                                <td style={{ padding: '10px 10px', color: C.muted, whiteSpace: 'nowrap', fontSize: 11 }}>
                                  {timeLabel}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Pulse animation style */}
                <style>{`
                  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
                  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                `}</style>
              </div>
            )}

            {/* ADD MEMBER */}
            {activeTab === 'members' && (
              <div>
                <SectionHeading
                  eyebrow="Member management"
                  title="Register a new member"
                  description="Create an XTS member record and add their basic details."
                />

                <form
                  action={(formData) =>
                    handleAction(createMember, formData)
                  }
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 18,
                    maxWidth: 620,
                  }}
                >
                  <div
                    className="xts-profile-row"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                    }}
                  >
                    <label
                      style={{
                        width: 105,
                        height: 105,
                        borderRadius: 14,
                        border: `1px dashed #BCC4E6`,
                        background: '#F8F9FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <input
                        type="file"
                        name="profile_image"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) =>
                          handleImageChange(e, setAddPreview)
                        }
                      />

                      {addPreview ? (
                        <img
                          src={addPreview}
                          alt="Member photo preview"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div style={{ textAlign: 'center', color: C.muted }}>
                          <UserPlus
                            size={23}
                            style={{ margin: '0 auto 7px' }}
                          />
                          <span style={{ display: 'block', fontSize: 10 }}>
                            Add Photo
                          </span>
                        </div>
                      )}
                    </label>

                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 14,
                      }}
                    >
                      <Field label="Full Name">
                        <input
                          name="name"
                          required
                          placeholder="Enter full name"
                          style={inputStyle}
                        />
                      </Field>

                      <Field label="Email Address">
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder="name@example.com"
                          style={inputStyle}
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="xts-form-grid">
                    {[
                      {
                        name: 'xts_id',
                        label: 'XTS ID',
                        required: true,
                        placeholder: 'XTS-XXXX',
                      },
                      {
                        name: 'phone',
                        label: 'Phone Number',
                        placeholder: 'Enter phone number',
                      },
                      {
                        name: 'course',
                        label: 'Course',
                        placeholder: 'e.g. BCA',
                      },
                      {
                        name: 'team',
                        label: 'Team',
                        placeholder: 'e.g. Development',
                      },
                      {
                        name: 'semester',
                        label: 'Semester',
                        placeholder: 'e.g. 5',
                      },
                    ].map((field) => (
                      <Field key={field.name} label={field.label}>
                        <input
                          name={field.name}
                          required={field.required}
                          placeholder={field.placeholder}
                          style={inputStyle}
                        />
                      </Field>
                    ))}
                  </div>

                  <div
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: '#F7F8FC',
                      color: C.muted,
                      fontSize: 11,
                      lineHeight: 1.6,
                    }}
                  >
                    <ShieldCheck
                      size={14}
                      style={{
                        display: 'inline',
                        verticalAlign: 'middle',
                        marginRight: 6,
                        color: C.blue,
                      }}
                    />
                    Please verify the member's details before creating the
                    record. Profile images must be no larger than 5 MB.
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      ...primaryButtonStyle,
                      width: '100%',
                      marginTop: 2,
                    }}
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}
                    {loading ? 'Creating member...' : 'Create Member Record'}
                  </button>
                </form>
              </div>
            )}

            {/* VIEW MEMBERS */}
            {activeTab === 'view_members' && (
              <div>
                <SectionHeading
                  eyebrow="Member directory"
                  title="Member records"
                  description="Search, filter, export, edit, and manage XTS member profiles."
                />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    flexWrap: 'wrap',
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: C.ink,
                        fontWeight: 800,
                        fontSize: 13,
                        margin: 0,
                      }}
                    >
                      {filteredMembers.length} member
                      {filteredMembers.length !== 1 ? 's' : ''} found
                    </p>
                    <p
                      style={{
                        color: C.muted,
                        fontSize: 11,
                        margin: '4px 0 0',
                      }}
                    >
                      {filterTeam || searchName
                        ? 'Filtered results'
                        : 'Showing all registered members'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => exportMembers(filteredMembers)}
                    style={secondaryButtonStyle}
                  >
                    <Download size={14} color={C.blue} />
                    Export CSV
                  </button>
                </div>

                {/* Search, filter, and sort */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    flexWrap: 'wrap',
                    marginBottom: 18,
                  }}
                >
                  <div style={{ position: 'relative', flex: '1 1 210px' }}>
                    <Search
                      size={15}
                      style={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: C.subtle,
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search name, XTS ID or email..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      style={{
                        ...inputStyle,
                        paddingLeft: 36,
                      }}
                    />
                  </div>

                  <select
                    value={filterTeam}
                    onChange={(e) => setFilterTeam(e.target.value)}
                    style={{
                      ...inputStyle,
                      width: 'auto',
                      minWidth: 145,
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">All Teams</option>
                    {teams.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      setSortOrder((current) =>
                        current === 'asc' ? 'desc' : 'asc'
                      )
                    }
                    style={secondaryButtonStyle}
                  >
                    <ArrowUpDown size={14} />
                    {sortOrder === 'asc' ? 'ID: Ascending' : 'ID: Descending'}
                  </button>

                  {(filterTeam || searchName) && (
                    <button
                      type="button"
                      onClick={() => {
                        setFilterTeam('');
                        setSearchName('');
                      }}
                      style={{
                        ...secondaryButtonStyle,
                        color: C.red,
                        borderColor: '#F2CDD1',
                      }}
                    >
                      <X size={13} />
                      Clear
                    </button>
                  )}
                </div>

                {/* Members table */}
                <div
                  style={{
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{
                        width: '100%',
                        minWidth: 720,
                        borderCollapse: 'collapse',
                        textAlign: 'left',
                        fontSize: 12,
                      }}
                    >
                      <thead>
                        <tr style={{ background: '#F7F8FC' }}>
                          {[
                            'Member',
                            'XTS ID',
                            'Contact',
                            'Details',
                            'Actions',
                          ].map((heading) => (
                            <th
                              key={heading}
                              style={{
                                padding: '13px 14px',
                                color: C.muted,
                                fontSize: 10,
                                fontWeight: 800,
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                borderBottom: `1px solid ${C.border}`,
                                textAlign:
                                  heading === 'Actions' ? 'right' : 'left',
                              }}
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {filteredMembers.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              style={{
                                padding: 45,
                                textAlign: 'center',
                                color: C.muted,
                              }}
                            >
                              <Users
                                size={27}
                                style={{ margin: '0 auto 10px', opacity: 0.5 }}
                              />
                              No members match your search.
                            </td>
                          </tr>
                        ) : (
                          filteredMembers.map((member: any) => (
                            <tr
                              key={member._id}
                              className="xts-table-row"
                              style={{
                                borderBottom: `1px solid ${C.border}`,
                                transition: 'background 0.15s',
                              }}
                            >
                              <td style={{ padding: 14 }}>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                  }}
                                >
                                  <div
                                    style={{
                                      width: 43,
                                      height: 43,
                                      borderRadius: 11,
                                      background: C.blueLight,
                                      border: `1px solid ${C.border}`,
                                      display: 'grid',
                                      placeItems: 'center',
                                      overflow: 'hidden',
                                      flexShrink: 0,
                                    }}
                                  >
                                    {member.profile_image ? (
                                      <img
                                        src={member.profile_image}
                                        alt={member.name || 'Member'}
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover',
                                        }}
                                      />
                                    ) : (
                                      <Users size={18} color={C.blue} />
                                    )}
                                  </div>

                                  <div style={{ minWidth: 0 }}>
                                    <p
                                      style={{
                                        color: C.ink,
                                        fontWeight: 800,
                                        fontSize: 12,
                                        margin: 0,
                                      }}
                                    >
                                      {member.name || 'Unnamed member'}
                                    </p>

                                    {member.profile_image && (
                                      <a
                                        href={member.profile_image}
                                        download={`${(member.name || 'member').replace(/\s+/g, '_')}_photo`}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: 4,
                                          marginTop: 5,
                                          color: C.blue,
                                          textDecoration: 'none',
                                          fontSize: 10,
                                          fontWeight: 700,
                                        }}
                                      >
                                        <Download size={10} />
                                        Photo
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td
                                style={{
                                  padding: '14px',
                                  color: C.ink,
                                  fontFamily: 'monospace',
                                  fontWeight: 800,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {member.xts_id || '—'}
                              </td>

                              <td style={{ padding: '14px', color: C.ink }}>
                                <div style={{ fontWeight: 650 }}>
                                  {member.email || '—'}
                                </div>
                                <div
                                  style={{
                                    color: C.muted,
                                    fontSize: 11,
                                    marginTop: 4,
                                  }}
                                >
                                  {member.phone || 'No phone'}
                                </div>
                              </td>

                              <td style={{ padding: '14px', color: C.ink }}>
                                <div>
                                  {member.course || '—'}
                                  {member.semester
                                    ? ` · Sem ${member.semester}`
                                    : ''}
                                </div>
                                {member.team && (
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      marginTop: 5,
                                      color: C.blue,
                                      background: C.blueLight,
                                      padding: '3px 7px',
                                      borderRadius: 5,
                                      fontSize: 10,
                                      fontWeight: 700,
                                    }}
                                  >
                                    {member.team}
                                  </span>
                                )}
                              </td>

                              <td
                                style={{
                                  padding: '14px',
                                  textAlign: 'right',
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 5,
                                  }}
                                >
                                  <button
                                    type="button"
                                    title="Show QR Code"
                                    onClick={() => setQrMember(member._id)}
                                    className="xts-action-button"
                                    style={{
                                      width: 31,
                                      height: 31,
                                      display: 'grid',
                                      placeItems: 'center',
                                      border: `1px solid ${C.border}`,
                                      borderRadius: 8,
                                      cursor: 'pointer',
                                      background: C.blueLight,
                                      color: C.blue,
                                    }}
                                  >
                                    <QrCode size={14} />
                                  </button>

                                  <button
                                    type="button"
                                    title="Edit member"
                                    onClick={() => {
                                      setEditingMember(member);
                                      setEditPreview(null);
                                    }}
                                    className="xts-action-button"
                                    style={{
                                      width: 31,
                                      height: 31,
                                      display: 'grid',
                                      placeItems: 'center',
                                      border: `1px solid ${C.border}`,
                                      borderRadius: 8,
                                      cursor: 'pointer',
                                      background: C.white,
                                      color: C.muted,
                                    }}
                                  >
                                    <Pencil size={14} />
                                  </button>

                                  <button
                                    type="button"
                                    title="Delete member"
                                    onClick={() => handleDelete(member._id)}
                                    className="xts-action-button"
                                    style={{
                                      width: 31,
                                      height: 31,
                                      display: 'grid',
                                      placeItems: 'center',
                                      border: '1px solid #F2CDD1',
                                      borderRadius: 8,
                                      cursor: 'pointer',
                                      background: C.redBg,
                                      color: C.red,
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p
                  style={{
                    margin: '12px 0 0',
                    color: C.muted,
                    fontSize: 10,
                    lineHeight: 1.6,
                  }}
                >
                  Export CSV creates a spreadsheet-compatible file containing
                  the currently filtered member records.
                </p>
              </div>
            )}

            {/* MEETINGS */}
            {activeTab === 'meetings' && (
              <MeetingAdminSection
                meetings={meetings}
                members={members}
                onRefresh={() => window.location.reload()}
              />
            )}

            {/* CERTIFICATES */}
            {activeTab === 'certificates' && (
              <div>
                <SectionHeading
                  eyebrow="Recognition and records"
                  title="Issue a certificate"
                  description="Associate a certificate with a registered member and provide its file URL."
                />

                <form
                  action={(formData) =>
                    handleAction(createCertificate, formData)
                  }
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 17,
                    maxWidth: 530,
                  }}
                >
                  <Field label="Select Member">
                    <select
                      name="member_id"
                      required
                      defaultValue=""
                      style={inputStyle}
                    >
                      <option value="" disabled>
                        Choose a registered member
                      </option>
                      {members.map((member: any) => (
                        <option key={member._id} value={member._id}>
                          {member.name} ({member.xts_id})
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Certificate Title">
                    <input
                      name="title"
                      required
                      placeholder="e.g. Certificate of Participation"
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Certificate File URL">
                    <input
                      name="file_url"
                      type="url"
                      required
                      placeholder="https://..."
                      style={inputStyle}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={loading}
                    style={primaryButtonStyle}
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}
                    {loading ? 'Uploading...' : 'Upload Certificate'}
                  </button>
                </form>
              </div>
            )}

            {/* EVENTS */}
            {activeTab === 'events' && (
              <div>
                <SectionHeading
                  eyebrow="Society activities"
                  title="Events Management"
                  description="Publish, update, and manage official XTS events visible to members and on the public website."
                />

                <div
                  style={{
                    background: '#F9FAFC',
                    border: `1px solid ${C.border}`,
                    borderRadius: 14,
                    padding: 22,
                    marginBottom: 32,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 750,
                      color: C.ink,
                      margin: '0 0 16px',
                    }}
                  >
                    Create New Event
                  </h3>

                  <form
                    action={(formData) => handleAction(createEvent, formData)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                      maxWidth: 620,
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                      <Field label="Event Title">
                        <input
                          name="title"
                          required
                          placeholder="e.g. BUILDX: IoT Edition"
                          style={inputStyle}
                        />
                      </Field>

                      <Field label="Event Date">
                        <input
                          name="date"
                          type="date"
                          required
                          style={inputStyle}
                        />
                      </Field>
                    </div>

                    <Field label="Description">
                      <textarea
                        name="description"
                        required
                        rows={3}
                        placeholder="Provide event details, schedule, or prerequisites..."
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </Field>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{ ...primaryButtonStyle, alignSelf: 'flex-start' }}
                    >
                      {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Plus size={16} />
                      )}
                      {loading ? 'Publishing event...' : 'Publish Event'}
                    </button>
                  </form>
                </div>

                {/* Existing Events List */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 16,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 750,
                        color: C.ink,
                        margin: 0,
                      }}
                    >
                      Published Events ({events.length})
                    </h3>
                    <span style={{ fontSize: 12, color: C.muted }}>
                      Live on Landing Page &amp; Member Dashboard
                    </span>
                  </div>

                  {events.length === 0 ? (
                    <div
                      style={{
                        padding: 36,
                        textAlign: 'center',
                        background: '#FAFAFD',
                        borderRadius: 14,
                        border: `1px dashed ${C.border}`,
                        color: C.muted,
                      }}
                    >
                      <Calendar size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                      <p style={{ margin: 0, fontWeight: 600 }}>No events published yet.</p>
                      <p style={{ margin: '4px 0 0', fontSize: 12 }}>Create an event above to showcase it to members and visitors.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {events.map((ev: any) => {
                        const eventDate = new Date(ev.date);
                        const isUpcoming = eventDate.getTime() >= new Date().setHours(0, 0, 0, 0);

                        return (
                          <div
                            key={ev._id}
                            style={{
                              border: `1px solid ${C.border}`,
                              borderRadius: 14,
                              padding: '18px 20px',
                              background: C.white,
                              boxShadow: '0 2px 8px rgba(15,18,38,0.02)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 12,
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                gap: 12,
                                flexWrap: 'wrap',
                              }}
                            >
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                  <span
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 700,
                                      padding: '3px 8px',
                                      borderRadius: 6,
                                      background: isUpcoming ? '#EAF7F0' : '#F1F3F9',
                                      color: isUpcoming ? '#16845B' : '#777D98',
                                    }}
                                  >
                                    {isUpcoming ? 'Upcoming' : 'Concluded'}
                                  </span>

                                  <span
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 600,
                                      color: C.blue,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4,
                                    }}
                                  >
                                    <Calendar size={13} />
                                    {eventDate.toLocaleDateString(undefined, {
                                      weekday: 'short',
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </div>

                                <h4
                                  style={{
                                    fontSize: 17,
                                    fontWeight: 800,
                                    color: C.ink,
                                    margin: 0,
                                    letterSpacing: '-0.02em',
                                  }}
                                >
                                  {ev.title}
                                </h4>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <button
                                  type="button"
                                  onClick={() => setEditingEvent(ev)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '7px 12px',
                                    borderRadius: 8,
                                    border: `1px solid ${C.border}`,
                                    background: '#F8F9FD',
                                    color: C.ink,
                                    fontSize: 12,
                                    fontWeight: 650,
                                    cursor: 'pointer',
                                  }}
                                >
                                  <Pencil size={13} />
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteEvent(ev._id)}
                                  disabled={loading}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '7px 12px',
                                    borderRadius: 8,
                                    border: '1px solid #FFD8DC',
                                    background: '#FFF4F5',
                                    color: '#C43D4B',
                                    fontSize: 12,
                                    fontWeight: 650,
                                    cursor: 'pointer',
                                  }}
                                >
                                  <Trash2 size={13} />
                                  Delete
                                </button>
                              </div>
                            </div>

                            <p
                              style={{
                                color: C.muted,
                                fontSize: 13,
                                lineHeight: 1.65,
                                margin: 0,
                                whiteSpace: 'pre-line',
                              }}
                            >
                              {ev.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PROJECTS */}
            {activeTab === 'projects' && (
              <div>
                <SectionHeading
                  eyebrow="Project portfolio"
                  title="Projects Management"
                  description="Publish, update, and manage official XTS projects visible on the Landing Page and Member Portal."
                />

                <div
                  style={{
                    background: '#F9FAFC',
                    border: `1px solid ${C.border}`,
                    borderRadius: 14,
                    padding: 22,
                    marginBottom: 32,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 750,
                      color: C.ink,
                      margin: '0 0 16px',
                    }}
                  >
                    Add New Project
                  </h3>

                  <form
                    action={(formData) => handleAction(createProject, formData)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                      maxWidth: 620,
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                      <Field label="Project Title">
                        <input
                          name="title"
                          required
                          placeholder="e.g. BuildMate"
                          style={inputStyle}
                        />
                      </Field>

                      <Field label="Project Link / Repository">
                        <input
                          name="link"
                          type="url"
                          required
                          placeholder="https://github.com/..."
                          style={inputStyle}
                        />
                      </Field>
                    </div>

                    <Field label="Project Description">
                      <textarea
                        name="description"
                        required
                        rows={3}
                        placeholder="Detail the project goals, tech stack, and contribution opportunities..."
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </Field>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{ ...primaryButtonStyle, alignSelf: 'flex-start' }}
                    >
                      {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Plus size={16} />
                      )}
                      {loading ? 'Adding project...' : 'Add Project'}
                    </button>
                  </form>
                </div>

                {/* Existing Projects List */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 16,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 750,
                        color: C.ink,
                        margin: 0,
                      }}
                    >
                      Published Projects ({projects.length})
                    </h3>
                    <span style={{ fontSize: 12, color: C.muted }}>
                      Live on Landing Page &amp; Member Dashboard
                    </span>
                  </div>

                  {projects.length === 0 ? (
                    <div
                      style={{
                        padding: 36,
                        textAlign: 'center',
                        background: '#FAFAFD',
                        borderRadius: 14,
                        border: `1px dashed ${C.border}`,
                        color: C.muted,
                      }}
                    >
                      <FolderGit2 size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                      <p style={{ margin: 0, fontWeight: 600 }}>No projects published yet.</p>
                      <p style={{ margin: '4px 0 0', fontSize: 12 }}>Add a project above to showcase work by XTS builders.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
                      {projects.map((proj: any) => (
                        <div
                          key={proj._id}
                          style={{
                            border: `1px solid ${C.border}`,
                            borderRadius: 14,
                            padding: '18px 20px',
                            background: C.white,
                            boxShadow: '0 2px 8px rgba(15,18,38,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              justifyContent: 'space-between',
                              gap: 12,
                            }}
                          >
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <h4
                                style={{
                                  fontSize: 17,
                                  fontWeight: 800,
                                  color: C.ink,
                                  margin: '0 0 4px',
                                  letterSpacing: '-0.02em',
                                }}
                              >
                                {proj.title}
                              </h4>

                              {proj.link && (
                                <a
                                  href={proj.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    fontSize: 12,
                                    color: C.blue,
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {proj.link.replace(/^https?:\/\//, '')}
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                              <button
                                type="button"
                                onClick={() => setEditingProject(proj)}
                                title="Edit project"
                                style={{
                                  padding: 7,
                                  borderRadius: 8,
                                  border: `1px solid ${C.border}`,
                                  background: '#F8F9FD',
                                  color: C.ink,
                                  cursor: 'pointer',
                                }}
                              >
                                <Pencil size={13} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteProject(proj._id)}
                                title="Delete project"
                                disabled={loading}
                                style={{
                                  padding: 7,
                                  borderRadius: 8,
                                  border: '1px solid #FFD8DC',
                                  background: '#FFF4F5',
                                  color: '#C43D4B',
                                  cursor: 'pointer',
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <p
                            style={{
                              color: C.muted,
                              fontSize: 13,
                              lineHeight: 1.65,
                              margin: 0,
                              whiteSpace: 'pre-line',
                            }}
                          >
                            {proj.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RESIGNATIONS */}
            {activeTab === 'resignations' && (
              <div>
                <SectionHeading
                  eyebrow="Member requests"
                  title="Resignation requests"
                  description="Review resignation letters and take action on pending requests."
                />

                {pendingCount > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: 13,
                      marginBottom: 18,
                      borderRadius: 10,
                      background: C.amberBg,
                      border: '1px solid #F0DCA9',
                      color: C.amber,
                    }}
                  >
                    <Clock size={17} />
                    <span style={{ fontSize: 12, fontWeight: 750 }}>
                      {pendingCount} request{pendingCount === 1 ? '' : 's'}{' '}
                      awaiting review
                    </span>
                  </div>
                )}

                {resignations.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '50px 20px',
                      border: `1px dashed ${C.border}`,
                      borderRadius: 14,
                      background: '#FAFBFF',
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: 15,
                        background: C.blueLight,
                        color: C.blue,
                        margin: '0 auto 13px',
                      }}
                    >
                      <LogOut size={23} />
                    </div>

                    <p
                      style={{
                        color: C.ink,
                        fontWeight: 800,
                        fontSize: 14,
                        margin: 0,
                      }}
                    >
                      No resignation requests
                    </p>

                    <p
                      style={{
                        color: C.muted,
                        fontSize: 12,
                        margin: '7px 0 0',
                      }}
                    >
                      There are no resignation records to review.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 13,
                    }}
                  >
                    {resignations.map((resignation: any) => {
                      const pending = resignation.status === 'pending';
                      const busy = resLoading === resignation._id;

                      return (
                        <article
                          key={resignation._id}
                          style={{
                            border: `1px solid ${
                              pending ? '#F0DCA9' : C.border
                            }`,
                            borderRadius: 14,
                            padding: 18,
                            background: pending ? '#FFFEFA' : C.white,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              justifyContent: 'space-between',
                              gap: 12,
                              flexWrap: 'wrap',
                              marginBottom: 14,
                            }}
                          >
                            <div>
                              <p
                                style={{
                                  color: C.ink,
                                  fontWeight: 800,
                                  fontSize: 14,
                                  margin: '0 0 5px',
                                }}
                              >
                                {resignation.member_name}
                              </p>

                              <p
                                style={{
                                  color: C.muted,
                                  fontSize: 11,
                                  margin: 0,
                                }}
                              >
                                {resignation.member_xts_id}
                                {' · '}
                                {resignation.submittedAt
                                  ? new Date(
                                      resignation.submittedAt
                                    ).toLocaleDateString()
                                  : 'Date unavailable'}
                              </p>
                            </div>

                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '6px 9px',
                                borderRadius: 7,
                                fontSize: 10,
                                fontWeight: 800,
                                color: pending ? C.amber : C.green,
                                background: pending ? C.amberBg : C.greenBg,
                                border: `1px solid ${
                                  pending ? '#F0DCA9' : '#C9EAD9'
                                }`,
                              }}
                            >
                              {pending ? (
                                <Clock size={12} />
                              ) : (
                                <CheckCircle2 size={12} />
                              )}
                              {pending ? 'PENDING REVIEW' : 'PROCESSED'}
                            </span>
                          </div>

                          <div
                            style={{
                              background: '#F7F8FC',
                              border: `1px solid ${C.border}`,
                              borderRadius: 10,
                              padding: '13px 14px',
                              marginBottom: pending ? 14 : 0,
                            }}
                          >
                            <p
                              style={{
                                color: C.muted,
                                fontSize: 12,
                                margin: 0,
                                lineHeight: 1.8,
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {resignation.letter ||
                                'No resignation letter was provided.'}
                            </p>
                          </div>

                          {pending && (
                            <div
                              style={{
                                display: 'flex',
                                gap: 9,
                                flexWrap: 'wrap',
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  handleApprove(resignation._id)
                                }
                                disabled={busy}
                                style={{
                                  ...primaryButtonStyle,
                                  flex: '1 1 200px',
                                  background: C.red,
                                }}
                              >
                                {busy ? (
                                  <Loader2
                                    size={15}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <CheckCircle2 size={15} />
                                )}
                                Approve & Remove Member
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleReject(resignation._id)
                                }
                                disabled={busy}
                                style={{
                                  ...secondaryButtonStyle,
                                  padding: '10px 15px',
                                }}
                              >
                                <XCircle size={15} />
                                Reject Request
                              </button>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* EDIT MEMBER MODAL */}
      {editingMember && (
        <div
          className="xts-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setEditingMember(null);
              setEditPreview(null);
            }
          }}
        >
          <div
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 18,
              padding: 25,
              width: '100%',
              maxWidth: 560,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 80px rgba(15,18,38,0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                paddingBottom: 18,
                borderBottom: `1px solid ${C.border}`,
                marginBottom: 20,
              }}
            >
              <div>
                <p
                  style={{
                    color: C.blue,
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    margin: '0 0 5px',
                  }}
                >
                  MEMBER MANAGEMENT
                </p>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 850,
                    color: C.ink,
                    margin: 0,
                    letterSpacing: '-0.04em',
                  }}
                >
                  Edit Member
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingMember(null);
                  setEditPreview(null);
                }}
                aria-label="Close edit member dialog"
                style={{
                  width: 35,
                  height: 35,
                  display: 'grid',
                  placeItems: 'center',
                  background: '#F5F6FB',
                  border: `1px solid ${C.border}`,
                  borderRadius: 9,
                  color: C.muted,
                  cursor: 'pointer',
                }}
              >
                <X size={17} />
              </button>
            </div>

            <form
              action={async (formData) => {
                setLoading(true);
                setMessage('');

                try {
                  const res = await updateMember(formData);

                  if (res?.error) {
                    setMessage(`Error: ${res.error}`);
                  } else {
                    setEditingMember(null);
                    setEditPreview(null);
                    window.location.reload();
                  }
                } catch {
                  setMessage('Error: Unable to update member.');
                } finally {
                  setLoading(false);
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <input
                type="hidden"
                name="member_id"
                value={editingMember._id}
              />

              <div
                className="xts-profile-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <label
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 13,
                    border: `1px dashed #BCC4E6`,
                    background: '#F8F9FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <input
                    type="file"
                    name="profile_image"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(event) =>
                      handleImageChange(event, setEditPreview)
                    }
                  />

                  {editPreview || editingMember.profile_image ? (
                    <img
                      src={editPreview || editingMember.profile_image}
                      alt="Member photo preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: C.muted }}>
                      <Pencil
                        size={19}
                        style={{ margin: '0 auto 5px' }}
                      />
                      <span style={{ display: 'block', fontSize: 10 }}>
                        Change Photo
                      </span>
                    </div>
                  )}
                </label>

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 13,
                  }}
                >
                  <Field label="Full Name">
                    <input
                      name="name"
                      defaultValue={editingMember.name || ''}
                      required
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Email Address">
                    <input
                      name="email"
                      type="email"
                      defaultValue={editingMember.email || ''}
                      required
                      style={inputStyle}
                    />
                  </Field>
                </div>
              </div>

              <div className="xts-form-grid">
                {[
                  {
                    name: 'xts_id',
                    label: 'XTS ID',
                    value: editingMember.xts_id,
                    required: true,
                  },
                  {
                    name: 'phone',
                    label: 'Phone Number',
                    value: editingMember.phone,
                  },
                  {
                    name: 'course',
                    label: 'Course',
                    value: editingMember.course,
                  },
                  {
                    name: 'team',
                    label: 'Team',
                    value: editingMember.team,
                  },
                  {
                    name: 'semester',
                    label: 'Semester',
                    value: editingMember.semester,
                  },
                ].map((field) => (
                  <Field key={field.name} label={field.label}>
                    <input
                      name={field.name}
                      defaultValue={field.value || ''}
                      required={field.required}
                      style={inputStyle}
                    />
                  </Field>
                ))}
              </div>

              <Field label="ID Card Image (Upload)">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    padding: 12,
                    border: `1px solid ${C.border}`,
                    background: '#F8F9FC',
                    borderRadius: 10,
                  }}
                >
                  <CreditCard size={17} color={C.blue} />
                  <input
                    name="id_card_url"
                    type="file"
                    accept="image/*"
                    style={{
                      ...inputStyle,
                      padding: 7,
                      border: 'none',
                      background: 'transparent',
                    }}
                  />
                </div>
              </Field>

              <div
                style={{
                  display: 'flex',
                  gap: 9,
                  justifyContent: 'flex-end',
                  marginTop: 4,
                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setEditingMember(null);
                    setEditPreview(null);
                  }}
                  style={secondaryButtonStyle}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={primaryButtonStyle}
                >
                  {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={15} />
                  )}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EVENT MODAL */}
      {editingEvent && (
        <div
          className="xts-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setEditingEvent(null);
            }
          }}
        >
          <div
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 18,
              padding: 25,
              width: '100%',
              maxWidth: 540,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 80px rgba(15,18,38,0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                paddingBottom: 16,
                borderBottom: `1px solid ${C.border}`,
                marginBottom: 20,
              }}
            >
              <div>
                <p
                  style={{
                    color: C.blue,
                    fontSize: 10,
                    fontWeight: 850,
                    letterSpacing: '0.12em',
                    margin: '0 0 4px',
                    textTransform: 'uppercase',
                  }}
                >
                  Event Configuration
                </p>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 850,
                    color: C.ink,
                    margin: 0,
                    letterSpacing: '-0.03em',
                  }}
                >
                  Edit Event
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                aria-label="Close modal"
                style={{
                  width: 32,
                  height: 32,
                  display: 'grid',
                  placeItems: 'center',
                  background: '#F5F6FB',
                  border: `1px solid ${C.border}`,
                  borderRadius: 9,
                  cursor: 'pointer',
                  color: C.muted,
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form
              action={async (formData) => {
                setLoading(true);
                setMessage('');
                try {
                  const res = await updateEvent(formData);
                  if (res?.error) {
                    setMessage(`Error: ${res.error}`);
                  } else {
                    setEditingEvent(null);
                    window.location.reload();
                  }
                } catch {
                  setMessage('Error: Unable to update event.');
                } finally {
                  setLoading(false);
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <input
                type="hidden"
                name="event_id"
                value={editingEvent._id}
              />

              <Field label="Event Title">
                <input
                  name="title"
                  defaultValue={editingEvent.title || ''}
                  required
                  style={inputStyle}
                />
              </Field>

              <Field label="Event Date">
                <input
                  name="date"
                  type="date"
                  defaultValue={
                    editingEvent.date
                      ? new Date(editingEvent.date).toISOString().split('T')[0]
                      : ''
                  }
                  required
                  style={inputStyle}
                />
              </Field>

              <Field label="Description">
                <textarea
                  name="description"
                  defaultValue={editingEvent.description || ''}
                  required
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </Field>

              <div
                style={{
                  display: 'flex',
                  gap: 9,
                  justifyContent: 'flex-end',
                  marginTop: 6,
                }}
              >
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  style={secondaryButtonStyle}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={primaryButtonStyle}
                >
                  {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={15} />
                  )}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROJECT MODAL */}
      {editingProject && (
        <div
          className="xts-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setEditingProject(null);
            }
          }}
        >
          <div
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 18,
              padding: 25,
              width: '100%',
              maxWidth: 540,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 80px rgba(15,18,38,0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                paddingBottom: 16,
                borderBottom: `1px solid ${C.border}`,
                marginBottom: 20,
              }}
            >
              <div>
                <p
                  style={{
                    color: C.blue,
                    fontSize: 10,
                    fontWeight: 850,
                    letterSpacing: '0.12em',
                    margin: '0 0 4px',
                    textTransform: 'uppercase',
                  }}
                >
                  Project Portfolio
                </p>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 850,
                    color: C.ink,
                    margin: 0,
                    letterSpacing: '-0.03em',
                  }}
                >
                  Edit Project
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setEditingProject(null)}
                aria-label="Close modal"
                style={{
                  width: 32,
                  height: 32,
                  display: 'grid',
                  placeItems: 'center',
                  background: '#F5F6FB',
                  border: `1px solid ${C.border}`,
                  borderRadius: 9,
                  cursor: 'pointer',
                  color: C.muted,
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form
              action={async (formData) => {
                setLoading(true);
                setMessage('');
                try {
                  const res = await updateProject(formData);
                  if (res?.error) {
                    setMessage(`Error: ${res.error}`);
                  } else {
                    setEditingProject(null);
                    window.location.reload();
                  }
                } catch {
                  setMessage('Error: Unable to update project.');
                } finally {
                  setLoading(false);
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <input
                type="hidden"
                name="project_id"
                value={editingProject._id}
              />

              <Field label="Project Title">
                <input
                  name="title"
                  defaultValue={editingProject.title || ''}
                  required
                  style={inputStyle}
                />
              </Field>

              <Field label="Project Link / Repository">
                <input
                  name="link"
                  type="url"
                  defaultValue={editingProject.link || ''}
                  required
                  style={inputStyle}
                />
              </Field>

              <Field label="Project Description">
                <textarea
                  name="description"
                  defaultValue={editingProject.description || ''}
                  required
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </Field>

              <div
                style={{
                  display: 'flex',
                  gap: 9,
                  justifyContent: 'flex-end',
                  marginTop: 6,
                }}
              >
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  style={secondaryButtonStyle}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={primaryButtonStyle}
                >
                  {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={15} />
                  )}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEMBER QR CODE MODAL */}
      {qrMember &&
        (() => {
          const qrMemberObj = members.find(
            (member: any) => member._id === qrMember
          );

          const qrUrl = `${window.location.origin}/member/${qrMember}`;

          const downloadQR = () => {
            const canvas = document.getElementById(
              'qr-download-canvas'
            ) as HTMLCanvasElement | null;

            if (!canvas) return;

            const link = document.createElement('a');
            link.download = `${(
              qrMemberObj?.name || 'member'
            ).replace(/\s+/g, '_')}_QR.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
          };

          return (
            <div
              className="xts-modal-overlay"
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  setQrMember(null);
                }
              }}
            >
              <div
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 19,
                  padding: 25,
                  width: '100%',
                  maxWidth: 370,
                  textAlign: 'center',
                  boxShadow: '0 25px 80px rgba(15,18,38,0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 10,
                    marginBottom: 21,
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: C.blue,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        margin: '0 0 5px',
                      }}
                    >
                      MEMBER IDENTIFICATION
                    </p>

                    <h2
                      style={{
                        fontSize: 20,
                        fontWeight: 850,
                        color: C.ink,
                        margin: 0,
                        letterSpacing: '-0.04em',
                      }}
                    >
                      Member QR Code
                    </h2>

                    {qrMemberObj && (
                      <p
                        style={{
                          color: C.muted,
                          fontSize: 11,
                          margin: '6px 0 0',
                        }}
                      >
                        {qrMemberObj.name} · {qrMemberObj.xts_id}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setQrMember(null)}
                    aria-label="Close QR code"
                    style={{
                      width: 33,
                      height: 33,
                      display: 'grid',
                      placeItems: 'center',
                      background: '#F5F6FB',
                      border: `1px solid ${C.border}`,
                      borderRadius: 9,
                      cursor: 'pointer',
                      color: C.muted,
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div
                  style={{
                    display: 'inline-block',
                    padding: 17,
                    borderRadius: 14,
                    border: `1px solid ${C.border}`,
                    background: C.white,
                    marginBottom: 15,
                  }}
                >
                  <QRCodeSVG value={qrUrl} size={200} />
                </div>

                <div style={{ display: 'none' }}>
                  <QRCodeCanvas
                    id="qr-download-canvas"
                    value={qrUrl}
                    size={400}
                  />
                </div>

                <p
                  style={{
                    color: C.muted,
                    fontSize: 11,
                    lineHeight: 1.7,
                    margin: '0 0 17px',
                  }}
                >
                  Scan to open the member profile. XTS ID verification may be
                  required to access profile details.
                </p>

                <button
                  type="button"
                  onClick={downloadQR}
                  style={{
                    ...primaryButtonStyle,
                    width: '100%',
                  }}
                >
                  <Download size={15} />
                  Download QR Code
                </button>
          </div>
</div>
);
})()}
    </div>
  );
}
