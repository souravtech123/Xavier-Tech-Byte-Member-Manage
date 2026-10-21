'use client';

import { useState } from 'react';
import {
  createMeeting, updateMeeting, cancelMeeting, deleteMeeting,
  recordAttendance, bulkRecordAttendance, getMeetingAttendanceRegister
} from '@/lib/actions';
import {
  Video, MapPin, Calendar, Clock, Plus, Loader2, Pencil, Trash2, X,
  CheckCircle2, XCircle, AlertCircle, History, ExternalLink, Search,
  Users, Check, HelpCircle, FileText, Ban
} from 'lucide-react';

const MC = {
  ink: '#0F1226',
  muted: '#6B7086',
  subtle: '#94A3B8',
  border: '#DDE0F0',
  paper: '#F4F5FA',
  cardBg: '#FFFFFF',
  blue: '#3347F2',
  blueLight: '#EEF0FF',
  green: '#16845B',
  greenBg: '#EAF7F0',
  red: '#C43D4B',
  redBg: '#FFF0F1',
  amber: '#986500',
  amberBg: '#FFF7E5',
};

const inputCls = 'w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all';
const inputStyle = { background: '#FFFFFF', border: '1px solid #DDE0F0', color: '#0F1226' } as const;

export default function MeetingAdminSection({
  meetings,
  members,
  onRefresh,
}: {
  meetings: any[];
  members: any[];
  onRefresh: () => void;
}) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formMsg, setFormMsg] = useState('');

  // Attendance Register Modal
  const [registerMeeting, setRegisterMeeting] = useState<any>(null);
  const [roster, setRoster] = useState<any[]>([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterSearch, setRosterSearch] = useState('');
  const [auditLogMember, setAuditLogMember] = useState<any>(null);

  // Form State for Create/Edit Meeting
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [description, setDescription] = useState('');
  const [agenda, setAgenda] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [meetingType, setMeetingType] = useState<'online' | 'offline' | 'hybrid'>('online');
  const [link, setLink] = useState('');
  const [venue, setVenue] = useState('');
  const [inviteAll, setInviteAll] = useState(true);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [memberFilterTeam, setMemberFilterTeam] = useState('');
  const [memberSearch, setMemberSearch] = useState('');

  const openCreateModal = () => {
    setEditingMeeting(null);
    setTitle('');
    setPurpose('');
    setDescription('');
    setAgenda('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setMeetingType('online');
    setLink('');
    setVenue('');
    setInviteAll(true);
    setSelectedParticipants([]);
    setFormMsg('');
    setModalOpen(true);
  };

  const openEditModal = (m: any) => {
    setEditingMeeting(m);
    setTitle(m.title || '');
    setPurpose(m.purpose || '');
    setDescription(m.description || '');
    setAgenda(m.agenda || '');
    setDate(m.date ? new Date(m.date).toISOString().split('T')[0] : '');
    setStartTime(m.startTime || '');
    setEndTime(m.endTime || '');
    setMeetingType(m.type || 'online');
    setLink(m.link || '');
    setVenue(m.venue || '');
    setInviteAll(!!m.inviteAll);
    setSelectedParticipants((m.participants || []).map((p: any) => (p._id ? p._id.toString() : p.toString())));
    setFormMsg('');
    setModalOpen(true);
  };

  const handleSaveMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !startTime || !endTime) {
      setFormMsg('Please fill in title, date, start time, and end time.');
      return;
    }
    setLoading(true);
    setFormMsg('');

    let res;
    if (editingMeeting) {
      res = await updateMeeting({
        meetingId: editingMeeting._id,
        title,
        purpose,
        description,
        agenda,
        date,
        startTime,
        endTime,
        type: meetingType,
        link,
        venue,
        inviteAll,
        participantIds: selectedParticipants,
      });
    } else {
      res = await createMeeting({
        title,
        purpose,
        description,
        agenda,
        date,
        startTime,
        endTime,
        type: meetingType,
        link,
        venue,
        inviteAll,
        participantIds: selectedParticipants,
      });
    }

    if (res.error) {
      setFormMsg(res.error);
    } else {
      setModalOpen(false);
      onRefresh();
    }
    setLoading(false);
  };

  const handleCancel = async (meetingId: string) => {
    if (!confirm('Cancel this meeting? Cancelled meetings do not penalize attendance.')) return;
    setLoading(true);
    const res = await cancelMeeting(meetingId);
    if (res.error) alert(res.error);
    else onRefresh();
    setLoading(false);
  };

  const handleDelete = async (meetingId: string) => {
    if (!confirm('Permanently delete this meeting and its attendance register?')) return;
    setLoading(true);
    const res = await deleteMeeting(meetingId);
    if (res.error) alert(res.error);
    else onRefresh();
    setLoading(false);
  };

  // Open Attendance Register Modal
  const openAttendance = async (m: any) => {
    setRegisterMeeting(m);
    setRosterLoading(true);
    setRosterSearch('');
    const res = await getMeetingAttendanceRegister(m._id);
    if (res.success) {
      setRoster(res.roster || []);
    } else {
      alert(res.error || 'Failed to load attendance');
    }
    setRosterLoading(false);
  };

  const handleStatusChange = async (memberId: string, newStatus: 'present' | 'absent' | 'excused' | 'not_recorded') => {
    if (!registerMeeting) return;
    const res = await recordAttendance({
      meetingId: registerMeeting._id,
      memberId,
      status: newStatus,
    });
    if (res.error) {
      alert(res.error);
    } else {
      setRoster(prev => prev.map(item => {
        if (item.member._id === memberId) {
          const logs = [...(item.auditLogs || [])];
          if (item.status !== newStatus) {
            logs.push({
              previousStatus: item.status,
              updatedStatus: newStatus,
              modifiedBy: 'Admin',
              modifiedAt: new Date().toISOString(),
              remarks: '',
            });
          }
          return {
            ...item,
            status: newStatus,
            recordedAt: new Date().toISOString(),
            auditLogs: logs,
          };
        }
        return item;
      }));
    }
  };

  const handleMarkAllPresent = async () => {
    if (!registerMeeting) return;
    if (!confirm('Mark all displayed participants as Present?')) return;
    setRosterLoading(true);
    const records = roster.map(r => ({ memberId: r.member._id, status: 'present' as const }));
    const res = await bulkRecordAttendance({
      meetingId: registerMeeting._id,
      records,
      remarks: 'Bulk marked Present by Admin',
    });
    if (res.error) {
      alert(res.error);
    } else {
      const updated = await getMeetingAttendanceRegister(registerMeeting._id);
      if (updated.success) setRoster(updated.roster || []);
    }
    setRosterLoading(false);
  };

  // Filtered Meetings
  const filteredMeetings = meetings.filter(m => {
    const matchesFilter = filter === 'all' || m.status === filter;
    const matchesSearch = !searchTerm ||
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.meeting_id && m.meeting_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.venue && m.venue.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const uniqueTeams = Array.from(new Set(members.map((m: any) => m.team).filter(Boolean))) as string[];

  const filteredMembersForSelection = members.filter((m: any) => {
    const matchesTeam = !memberFilterTeam || m.team === memberFilterTeam;
    const matchesQuery = !memberSearch ||
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.xts_id.toLowerCase().includes(memberSearch.toLowerCase());
    return matchesTeam && matchesQuery;
  });

  const filteredRoster = roster.filter(r => {
    if (!rosterSearch) return true;
    const q = rosterSearch.toLowerCase();
    return (
      r.member.name.toLowerCase().includes(q) ||
      r.member.xts_id.toLowerCase().includes(q) ||
      (r.member.team && r.member.team.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 750, color: MC.ink, margin: 0 }}>
            Meeting Management &amp; Attendance
          </h2>
          <p style={{ color: MC.muted, fontSize: 13, margin: '4px 0 0' }}>
            Schedule meetings, assign participants, and manage the official attendance register.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
            borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #3347F2, #4F62FF)', color: '#fff',
            fontWeight: 650, fontSize: 13, boxShadow: '0 4px 14px rgba(51,71,242,0.2)'
          }}
        >
          <Plus style={{ width: 16, height: 16 }} /> Schedule Meeting
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: 6, background: '#F1F3F9', padding: 4, borderRadius: 10, border: `1px solid ${MC.border}` }}>
          {(['all', 'upcoming', 'completed', 'cancelled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: filter === tab ? 650 : 500,
                background: filter === tab ? MC.blue : 'transparent',
                color: filter === tab ? '#FFFFFF' : MC.muted,
                transition: 'all 0.15s', textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: 280 }}>
          <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: MC.subtle }} />
          <input
            type="text"
            placeholder="Search meetings or ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
              background: '#FFFFFF', border: `1px solid ${MC.border}`,
              borderRadius: 8, color: MC.ink, fontSize: 13, outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Meetings List */}
      {filteredMeetings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FAFAFD', borderRadius: 12, border: `1px dashed ${MC.border}` }}>
          <Video style={{ width: 44, height: 44, color: MC.subtle, margin: '0 auto 12px' }} />
          <p style={{ color: MC.ink, fontWeight: 700, fontSize: 15, margin: '0 0 6px' }}>No meetings found</p>
          <p style={{ color: MC.muted, fontSize: 13, margin: 0 }}>
            {searchTerm ? 'Try adjusting your search criteria' : 'Click "Schedule Meeting" to create your first session.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
          {filteredMeetings.map(m => {
            const summary = m.attendanceSummary || { present: 0, absent: 0, excused: 0, total: 0 };
            const isCancelled = m.status === 'cancelled';
            const isCompleted = m.status === 'completed';

            return (
              <div
                key={m._id}
                style={{
                  background: MC.cardBg,
                  border: isCancelled ? '1px solid #FFD8DC' : `1px solid ${MC.border}`,
                  borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column',
                  gap: 12, position: 'relative', boxShadow: '0 2px 8px rgba(15,18,38,0.02)'
                }}
              >
                {/* Header: ID, Badge, Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: MC.blue, background: MC.blueLight, padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                      {m.meeting_id}
                    </span>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: MC.ink, margin: '8px 0 2px' }}>
                      {m.title}
                    </h3>
                    {m.purpose && (
                      <p style={{ color: MC.muted, fontSize: 12, margin: 0 }}>
                        {m.purpose}
                      </p>
                    )}
                  </div>

                  <span
                    style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                      textTransform: 'capitalize',
                      background: isCancelled ? MC.redBg : isCompleted ? MC.greenBg : MC.blueLight,
                      color: isCancelled ? MC.red : isCompleted ? MC.green : MC.blue,
                      border: `1px solid ${isCancelled ? '#FFD8DC' : isCompleted ? '#C9EAD9' : '#D5DBFF'}`
                    }}
                  >
                    {m.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar style={{ width: 14, height: 14, color: MC.subtle }} />
                    <span>{new Date(m.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock style={{ width: 14, height: 14, color: MC.subtle }} />
                    <span>{m.startTime} – {m.endTime}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Video style={{ width: 14, height: 14, color: MC.subtle }} />
                    <span style={{ textTransform: 'capitalize' }}>{m.type}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                    <Users style={{ width: 14, height: 14, color: MC.subtle, flexShrink: 0 }} />
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {m.inviteAll ? 'All Active Members' : `${(m.participants || []).length} assigned`}
                    </span>
                  </div>
                </div>

                {/* Link or Venue */}
                {m.link && (
                  <div style={{ background: '#EEF2FF', border: '1px solid #D5DBFF', borderRadius: 8, padding: '7px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                      <Video style={{ width: 13, height: 13, color: MC.blue, flexShrink: 0 }} />
                      <span style={{ color: MC.ink, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {m.link}
                      </span>
                    </div>
                    <a href={m.link.startsWith('http') ? m.link : `https://${m.link}`} target="_blank" rel="noopener noreferrer" style={{ color: MC.blue, display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0, fontWeight: 700 }}>
                      Join <ExternalLink style={{ width: 12, height: 12 }} />
                    </a>
                  </div>
                )}
                {m.venue && (
                  <div style={{ background: '#F8F9FD', border: `1px solid ${MC.border}`, borderRadius: 8, padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: MC.ink }}>
                    <MapPin style={{ width: 13, height: 13, color: '#D97706', flexShrink: 0 }} />
                    <span>Venue: {m.venue}</span>
                  </div>
                )}

                {/* Attendance Summary Bar */}
                <div style={{ background: '#F8F9FC', border: `1px solid ${MC.border}`, padding: '8px 10px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: MC.muted, fontWeight: 550 }}>Attendance:</span>
                  <div style={{ display: 'flex', gap: 10, fontWeight: 700 }}>
                    <span style={{ color: MC.green }}>✓ {summary.present} P</span>
                    <span style={{ color: MC.red }}>✗ {summary.absent} A</span>
                    <span style={{ color: '#D97706' }}>◎ {summary.excused} E</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 6, borderTop: `1px solid ${MC.border}` }}>
                  <button
                    onClick={() => openAttendance(m)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '8px', borderRadius: 8, border: `1px solid ${MC.border}`, cursor: 'pointer',
                      background: MC.blueLight, color: MC.blue, fontWeight: 700, fontSize: 12
                    }}
                  >
                    <CheckCircle2 style={{ width: 14, height: 14 }} /> Register &amp; Attendance
                  </button>

                  <button
                    onClick={() => openEditModal(m)}
                    title="Edit Meeting"
                    style={{
                      padding: '8px 10px', borderRadius: 8, border: `1px solid ${MC.border}`,
                      background: '#F8F9FD', color: MC.ink, cursor: 'pointer'
                    }}
                  >
                    <Pencil style={{ width: 13, height: 13 }} />
                  </button>

                  {!isCancelled && (
                    <button
                      onClick={() => handleCancel(m._id)}
                      title="Cancel Meeting"
                      style={{
                        padding: '8px 10px', borderRadius: 8, border: '1px solid #FFD8DC',
                        background: MC.redBg, color: MC.red, cursor: 'pointer'
                      }}
                    >
                      <Ban style={{ width: 13, height: 13 }} />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(m._id)}
                    title="Delete Meeting"
                    style={{
                      padding: '8px 10px', borderRadius: 8, border: '1px solid #FFD8DC',
                      background: MC.redBg, color: MC.red, cursor: 'pointer'
                    }}
                  >
                    <Trash2 style={{ width: 13, height: 13 }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CREATE / EDIT MEETING MODAL ───────────────────────── */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 18, 38, 0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100 }}>
          <div style={{ background: '#FFFFFF', border: `1px solid ${MC.border}`, borderRadius: 18, padding: 24, width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 80px rgba(15,18,38,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 750, color: MC.ink, margin: 0 }}>
                  {editingMeeting ? 'Edit Meeting Details' : 'Schedule New Meeting'}
                </h2>
                <p style={{ color: MC.muted, fontSize: 12, margin: '2px 0 0' }}>
                  {editingMeeting ? `Updating ID: ${editingMeeting.meeting_id}` : 'Create and notify participants'}
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background: '#F5F6FB', border: `1px solid ${MC.border}`, borderRadius: 8, padding: 6, cursor: 'pointer', color: MC.muted }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {formMsg && (
              <div style={{ padding: '8px 14px', borderRadius: 8, fontSize: 12, background: MC.redBg, border: '1px solid #FFD8DC', color: MC.red, marginBottom: 14 }}>
                {formMsg}
              </div>
            )}

            <form onSubmit={handleSaveMeeting} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MC.muted, marginBottom: 5 }}>Meeting Title *</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Weekly Tech Sync & Project Review" className={inputCls} style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MC.muted, marginBottom: 5 }}>Purpose</label>
                  <input value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="e.g. Project Milestones Review" className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MC.muted, marginBottom: 5 }}>Meeting Type</label>
                  <select value={meetingType} onChange={e => setMeetingType(e.target.value as any)} className={inputCls} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="online">Online (Video Call)</option>
                    <option value="offline">Offline (Physical Venue)</option>
                    <option value="hybrid">Hybrid (Online + Physical)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MC.muted, marginBottom: 5 }}>Date *</label>
                  <input type="date" required value={date} onChange={e => setDate(e.target.value)} className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MC.muted, marginBottom: 5 }}>Start Time *</label>
                  <input type="time" required value={startTime} onChange={e => setStartTime(e.target.value)} className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MC.muted, marginBottom: 5 }}>End Time *</label>
                  <input type="time" required value={endTime} onChange={e => setEndTime(e.target.value)} className={inputCls} style={inputStyle} />
                </div>
              </div>

              {(meetingType === 'online' || meetingType === 'hybrid') && (
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MC.muted, marginBottom: 5 }}>Online Meeting Link (Google Meet, Zoom, MS Teams, etc.)</label>
                  <input value={link} onChange={e => setLink(e.target.value)} placeholder="https://meet.google.com/xxx-xxxx-xxx" className={inputCls} style={inputStyle} />
                </div>
              )}

              {(meetingType === 'offline' || meetingType === 'hybrid') && (
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MC.muted, marginBottom: 5 }}>Physical Venue / Room</label>
                  <input value={venue} onChange={e => setVenue(e.target.value)} placeholder="e.g. Xavier Hall Room 302, Lab 4" className={inputCls} style={inputStyle} />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MC.muted, marginBottom: 5 }}>Agenda</label>
                <textarea rows={2} value={agenda} onChange={e => setAgenda(e.target.value)} placeholder="1. Welcome, 2. Sprint Demo, 3. Next Steps" className={inputCls} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MC.muted, marginBottom: 5 }}>Description &amp; Notes</label>
                <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Additional context or prerequisites for participants..." className={inputCls} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              {/* Participant Assignment */}
              <div style={{ background: '#F9FAFC', border: `1px solid ${MC.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: MC.ink, margin: 0 }}>Participant Assignment</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setInviteAll(true)}
                      style={{
                        padding: '4px 10px', borderRadius: 6, border: `1px solid ${inviteAll ? MC.blue : MC.border}`, cursor: 'pointer', fontSize: 11, fontWeight: 650,
                        background: inviteAll ? MC.blue : '#FFFFFF',
                        color: inviteAll ? '#FFFFFF' : MC.muted
                      }}
                    >
                      Invite All Members ({members.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setInviteAll(false)}
                      style={{
                        padding: '4px 10px', borderRadius: 6, border: `1px solid ${!inviteAll ? MC.blue : MC.border}`, cursor: 'pointer', fontSize: 11, fontWeight: 650,
                        background: !inviteAll ? MC.blue : '#FFFFFF',
                        color: !inviteAll ? '#FFFFFF' : MC.muted
                      }}
                    >
                      Select Specific ({selectedParticipants.length})
                    </button>
                  </div>
                </div>

                {!inviteAll && (
                  <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <input
                        type="text"
                        placeholder="Search members to assign..."
                        value={memberSearch}
                        onChange={e => setMemberSearch(e.target.value)}
                        style={{ flex: 1, padding: '6px 10px', background: '#FFFFFF', border: `1px solid ${MC.border}`, borderRadius: 6, color: MC.ink, fontSize: 12, outline: 'none' }}
                      />
                      <select
                        value={memberFilterTeam}
                        onChange={e => setMemberFilterTeam(e.target.value)}
                        style={{ padding: '6px 10px', background: '#FFFFFF', border: `1px solid ${MC.border}`, borderRadius: 6, color: MC.ink, fontSize: 12, cursor: 'pointer' }}
                      >
                        <option value="">All Teams</option>
                        {uniqueTeams.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const allFilteredIds = filteredMembersForSelection.map((m: any) => m._id.toString());
                          const combined = Array.from(new Set([...selectedParticipants, ...allFilteredIds]));
                          setSelectedParticipants(combined);
                        }}
                        style={{ padding: '6px 10px', borderRadius: 6, border: `1px solid ${MC.border}`, cursor: 'pointer', background: MC.blueLight, color: MC.blue, fontSize: 11, fontWeight: 650 }}
                      >
                        Select All Filtered
                      </button>
                    </div>

                    <div style={{ maxHeight: 160, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {filteredMembersForSelection.map((m: any) => {
                        const isSelected = selectedParticipants.includes(m._id.toString());
                        return (
                          <div
                            key={m._id}
                            onClick={() => {
                              const sid = m._id.toString();
                              setSelectedParticipants(prev =>
                                prev.includes(sid) ? prev.filter(id => id !== sid) : [...prev, sid]
                              );
                            }}
                            style={{
                              padding: '6px 10px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              background: isSelected ? MC.blueLight : '#FFFFFF',
                              border: `1px solid ${isSelected ? MC.blue : MC.border}`,
                              fontSize: 12
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <input type="checkbox" checked={isSelected} readOnly style={{ cursor: 'pointer' }} />
                              <span style={{ color: MC.ink, fontWeight: 550 }}>{m.name}</span>
                              <span style={{ color: MC.muted }}>({m.xts_id})</span>
                            </div>
                            {m.team && <span style={{ color: MC.blue, fontSize: 10, fontWeight: 650 }}>{m.team}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ flex: 1, padding: '11px', borderRadius: 10, border: `1px solid ${MC.border}`, background: '#F8F9FD', color: MC.muted, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #3347F2, #4F62FF)', color: '#fff',
                    fontWeight: 650, fontSize: 13, opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> : editingMeeting ? 'Save Changes' : 'Schedule Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ATTENDANCE REGISTER MODAL ─────────────────────────── */}
      {registerMeeting && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 18, 38, 0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100 }}>
          <div style={{ background: '#FFFFFF', border: `1px solid ${MC.border}`, borderRadius: 18, padding: 24, width: '100%', maxWidth: 840, maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 80px rgba(15,18,38,0.2)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: MC.blue, background: MC.blueLight, padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                    {registerMeeting.meeting_id}
                  </span>
                  <h2 style={{ fontSize: 18, fontWeight: 750, color: MC.ink, margin: 0 }}>
                    Attendance Register: {registerMeeting.title}
                  </h2>
                </div>
                <p style={{ color: MC.muted, fontSize: 12, margin: '4px 0 0' }}>
                  {new Date(registerMeeting.date).toLocaleDateString()} &bull; {registerMeeting.startTime} – {registerMeeting.endTime} &bull; {registerMeeting.type}
                </p>
              </div>
              <button onClick={() => setRegisterMeeting(null)} style={{ background: '#F5F6FB', border: `1px solid ${MC.border}`, borderRadius: 8, padding: 6, cursor: 'pointer', color: MC.muted }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {/* Warning if cancelled */}
            {registerMeeting.status === 'cancelled' && (
              <div style={{ padding: '10px 14px', borderRadius: 8, background: MC.redBg, border: '1px solid #FFD8DC', color: MC.red, fontSize: 12, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle style={{ width: 16, height: 16 }} />
                This meeting is CANCELLED. Attendance records cannot be modified and are excluded from attendance percentages.
              </div>
            )}

            {/* Sub-bar: Search, Mark All, Summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: 240 }}>
                <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: MC.subtle }} />
                <input
                  type="text"
                  placeholder="Filter roster..."
                  value={rosterSearch}
                  onChange={e => setRosterSearch(e.target.value)}
                  style={{ width: '100%', paddingLeft: 32, paddingRight: 10, paddingTop: 6, paddingBottom: 6, background: '#FFFFFF', border: `1px solid ${MC.border}`, borderRadius: 8, color: MC.ink, fontSize: 12, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: MC.muted, fontWeight: 550 }}>
                  {roster.length} participants
                </span>
                {registerMeeting.status !== 'cancelled' && (
                  <button
                    onClick={handleMarkAllPresent}
                    disabled={rosterLoading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                      borderRadius: 8, border: '1px solid #C9EAD9', cursor: 'pointer',
                      background: MC.greenBg, color: MC.green, fontSize: 12, fontWeight: 650
                    }}
                  >
                    <CheckCircle2 style={{ width: 14, height: 14 }} /> Mark All Present
                  </button>
                )}
              </div>
            </div>

            {/* Roster Table */}
            <div style={{ flex: 1, overflowY: 'auto', border: `1px solid ${MC.border}`, borderRadius: 10 }}>
              {rosterLoading ? (
                <div style={{ textAlign: 'center', padding: 40, color: MC.muted }}>
                  <Loader2 style={{ width: 24, height: 24, margin: '0 auto 8px' }} className="animate-spin" />
                  Loading attendance roster...
                </div>
              ) : filteredRoster.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: MC.muted }}>
                  No participants matched your filter.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#F8F9FD', borderBottom: `1px solid ${MC.border}`, color: MC.muted, fontSize: 11, textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px 14px' }}>Member</th>
                      <th style={{ padding: '10px 14px' }}>XTS ID</th>
                      <th style={{ padding: '10px 14px' }}>Team</th>
                      <th style={{ padding: '10px 14px' }}>Status</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center' }}>Mark Status</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Audit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoster.map(item => {
                      const m = item.member;
                      const status = item.status;
                      const hasAudit = item.auditLogs && item.auditLogs.length > 0;

                      return (
                        <tr key={m._id} style={{ borderBottom: `1px solid ${MC.border}` }}>
                          <td style={{ padding: '10px 14px', color: MC.ink, fontWeight: 600 }}>
                            {m.name}
                          </td>
                          <td style={{ padding: '10px 14px', color: MC.muted, fontFamily: 'monospace' }}>
                            {m.xts_id}
                          </td>
                          <td style={{ padding: '10px 14px', color: MC.muted }}>
                            {m.team || '—'}
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <span
                              style={{
                                fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 12,
                                background: status === 'present' ? MC.greenBg : status === 'absent' ? MC.redBg : status === 'excused' ? MC.amberBg : '#F1F3F9',
                                color: status === 'present' ? MC.green : status === 'absent' ? MC.red : status === 'excused' ? MC.amber : MC.muted,
                                textTransform: 'capitalize'
                              }}
                            >
                              {status === 'not_recorded' ? 'Not Recorded' : status}
                            </span>
                          </td>
                          <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                            {registerMeeting.status !== 'cancelled' ? (
                              <div style={{ display: 'inline-flex', gap: 4 }}>
                                <button
                                  onClick={() => handleStatusChange(m._id, 'present')}
                                  title="Mark Present"
                                  style={{
                                    padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                                    background: status === 'present' ? MC.green : '#F1F3F9',
                                    color: status === 'present' ? '#fff' : MC.muted, fontSize: 11, fontWeight: 700
                                  }}
                                >
                                  P
                                </button>
                                <button
                                  onClick={() => handleStatusChange(m._id, 'absent')}
                                  title="Mark Absent"
                                  style={{
                                    padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                                    background: status === 'absent' ? MC.red : '#F1F3F9',
                                    color: status === 'absent' ? '#fff' : MC.muted, fontSize: 11, fontWeight: 700
                                  }}
                                >
                                  A
                                </button>
                                <button
                                  onClick={() => handleStatusChange(m._id, 'excused')}
                                  title="Mark Excused"
                                  style={{
                                    padding: '4px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                                    background: status === 'excused' ? '#D97706' : '#F1F3F9',
                                    color: status === 'excused' ? '#fff' : MC.muted, fontSize: 11, fontWeight: 700
                                  }}
                                >
                                  E
                                </button>
                                <button
                                  onClick={() => handleStatusChange(m._id, 'not_recorded')}
                                  title="Reset to Not Recorded"
                                  style={{
                                    padding: '4px 8px', borderRadius: 6, border: `1px solid ${MC.border}`, cursor: 'pointer',
                                    background: status === 'not_recorded' ? '#E2E8F0' : '#F8F9FD',
                                    color: MC.muted, fontSize: 11
                                  }}
                                >
                                  —
                                </button>
                              </div>
                            ) : (
                              <span style={{ color: MC.muted, fontSize: 11 }}>Locked</span>
                            )}
                          </td>
                          <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                            {hasAudit ? (
                              <button
                                onClick={() => setAuditLogMember(item)}
                                title="View Correction History"
                                style={{
                                  background: 'none', border: 'none', cursor: 'pointer', color: MC.blue,
                                  fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600
                                }}
                              >
                                <History style={{ width: 12, height: 12 }} />
                                {item.auditLogs.length} edits
                              </button>
                            ) : (
                              <span style={{ color: MC.subtle, fontSize: 11 }}>None</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
              <button
                onClick={() => {
                  setRegisterMeeting(null);
                  onRefresh();
                }}
                style={{
                  padding: '9px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #3347F2, #4F62FF)', color: '#fff',
                  fontWeight: 650, fontSize: 13
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── AUDIT LOG DRAWER / MODAL ─────────────────────────── */}
      {auditLogMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 18, 38, 0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 110 }}>
          <div style={{ background: '#FFFFFF', border: `1px solid ${MC.border}`, borderRadius: 16, padding: 22, width: '100%', maxWidth: 480, boxShadow: '0 25px 80px rgba(15,18,38,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 750, color: MC.ink, margin: 0 }}>
                  Attendance Audit Trail
                </h3>
                <p style={{ color: MC.muted, fontSize: 12, margin: '2px 0 0' }}>
                  {auditLogMember.member.name} ({auditLogMember.member.xts_id})
                </p>
              </div>
              <button onClick={() => setAuditLogMember(null)} style={{ background: '#F5F6FB', border: `1px solid ${MC.border}`, borderRadius: 8, padding: 6, cursor: 'pointer', color: MC.muted }}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
              {(auditLogMember.auditLogs || []).map((log: any, idx: number) => (
                <div key={idx} style={{ background: '#F8F9FD', border: `1px solid ${MC.border}`, borderRadius: 10, padding: 12, fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ color: MC.ink, fontWeight: 650 }}>
                      {log.previousStatus} → <span style={{ color: MC.blue }}>{log.updatedStatus}</span>
                    </span>
                    <span style={{ color: MC.muted, fontSize: 10 }}>
                      {new Date(log.modifiedAt).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ color: MC.muted, fontSize: 11 }}>
                    Modified by: <span style={{ color: MC.ink, fontWeight: 550 }}>{log.modifiedBy}</span>
                  </div>
                  {log.remarks && (
                    <div style={{ color: MC.muted, fontSize: 11, marginTop: 4, fontStyle: 'italic' }}>
                      Remarks: "{log.remarks}"
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setAuditLogMember(null)}
              style={{ width: '100%', marginTop: 16, padding: '9px', borderRadius: 8, border: `1px solid ${MC.border}`, background: '#F8F9FD', color: MC.ink, fontSize: 12, cursor: 'pointer', fontWeight: 650 }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
