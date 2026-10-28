
'use client';

import { useState } from 'react';
import {
  Video,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Filter,
} from 'lucide-react';

const COLORS = {
  ink: '#0F1226',
  paper: '#F4F5FA',
  blue: '#3347F2',
  gold: '#FFB627',
  mist: '#DDE0F0',
  muted: '#777D98',
  green: '#16845B',
  red: '#C43D4B',
  amber: '#A66A08',
};

const ATTENDANCE_STYLES: Record<
  string,
  { color: string; background: string; border: string }
> = {
  present: {
    color: COLORS.green,
    background: '#E7F6EE',
    border: '#C5EAD5',
  },
  absent: {
    color: COLORS.red,
    background: '#FDECEE',
    border: '#F5CDD2',
  },
  excused: {
    color: COLORS.amber,
    background: '#FFF5DE',
    border: '#F1DEAA',
  },
  not_recorded: {
    color: COLORS.muted,
    background: '#F0F1F7',
    border: COLORS.mist,
  },
};

export default function MemberMeetingsView({
  meetings = [],
  cardStyle,
  sectionHeader,
}: {
  meetings: any[];
  cardStyle: React.CSSProperties;
  sectionHeader: (
    icon: React.ReactNode,
    label: string,
    color: string
  ) => React.ReactNode;
}) {
  const [filterType, setFilterType] = useState<
    'all' | 'upcoming' | 'past'
  >('all');

  const [searchQuery, setSearchQuery] = useState('');

  const now = new Date();

  const filteredMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.date);

    const isPast =
      meetingDate < now || meeting.status === 'completed';

    const isUpcoming =
      meetingDate >= now &&
      meeting.status !== 'completed' &&
      meeting.status !== 'cancelled';

    if (filterType === 'upcoming' && !isUpcoming) {
      return false;
    }

    if (filterType === 'past' && !isPast) {
      return false;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      const matchTitle = meeting.title?.toLowerCase().includes(query);
      const matchPurpose = meeting.purpose?.toLowerCase().includes(query);
      const matchId = meeting.meeting_id?.toLowerCase().includes(query);
      const matchVenue = meeting.venue?.toLowerCase().includes(query);

      if (!matchTitle && !matchPurpose && !matchId && !matchVenue) {
        return false;
      }
    }

    return true;
  });

  const getAttendanceBadge = (status: string) => {
    const style =
      ATTENDANCE_STYLES[status] || ATTENDANCE_STYLES.not_recorded;

    const icon =
      status === 'present' ? (
        <CheckCircle2 size={13} />
      ) : status === 'absent' ? (
        <XCircle size={13} />
      ) : status === 'excused' ? (
        <AlertCircle size={13} />
      ) : (
        <HelpCircle size={13} />
      );

    const label =
      status === 'present'
        ? 'Present'
        : status === 'absent'
          ? 'Absent'
          : status === 'excused'
            ? 'Excused'
            : 'Not Recorded';

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          padding: '5px 9px',
          borderRadius: 6,
          background: style.background,
          border: `1px solid ${style.border}`,
          color: style.color,
          fontSize: 10,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        {icon}
        {label}
      </span>
    );
  };

  const baseCardStyle: React.CSSProperties = {
    ...cardStyle,
    background: '#FFFFFF',
    color: COLORS.ink,
    border: `1px solid ${COLORS.mist}`,
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(15,18,38,0.025)',
  };

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1000,
        color: COLORS.ink,
      }}
    >
      {/* Section Heading */}
    
      <p
        style={{
          margin: '8px 0 22px',
          color: COLORS.muted,
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        Stay updated with your meetings, check schedules, and access
        online meeting links from one place.
      </p>

      {/* Meeting Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
          gap: 12,
          marginBottom: 22,
        }}
      >
        {[
          {
            label: 'Total Meetings',
            value: meetings.length,
            icon: <Calendar size={18} />,
            accent: COLORS.blue,
            background: '#F0F2FF',
          },
          {
            label: 'Upcoming',
            value: meetings.filter((meeting) => {
              const date = new Date(meeting.date);
              return (
                date >= now &&
                meeting.status !== 'completed' &&
                meeting.status !== 'cancelled'
              );
            }).length,
            icon: <Clock size={18} />,
            accent: COLORS.green,
            background: '#F2FAF5',
          },
          {
            label: 'Completed',
            value: meetings.filter((meeting) => {
              return (
                new Date(meeting.date) < now ||
                meeting.status === 'completed'
              );
            }).length,
            icon: <CheckCircle2 size={18} />,
            accent: COLORS.amber,
            background: '#FFFCF4',
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              ...baseCardStyle,
              padding: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
                marginBottom: 13,
              }}
            >
              <span
                style={{
                  color: COLORS.muted,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                }}
              >
                {item.label}
              </span>

              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  borderRadius: 9,
                  background: item.background,
                  color: item.accent,
                }}
              >
                {item.icon}
              </span>
            </div>

            <div
              style={{
                color: COLORS.ink,
                fontSize: 29,
                fontWeight: 800,
                letterSpacing: '-1px',
              }}
            >
              {item.value}
            </div>

            <div
              style={{
                marginTop: 5,
                color: COLORS.muted,
                fontSize: 11,
              }}
            >
              Your meeting records
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div
        style={{
          ...baseCardStyle,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 14,
          }}
        >
          {/* Filter Tabs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
            }}
          >
            {(['all', 'upcoming', 'past'] as const).map((tab) => {
              const active = filterType === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterType(tab)}
                  aria-pressed={active}
                  style={{
                    padding: '9px 13px',
                    borderRadius: 7,
                    border: `1px solid ${
                      active ? COLORS.blue : COLORS.mist
                    }`,
                    background: active ? COLORS.blue : '#FFFFFF',
                    color: active ? '#FFFFFF' : COLORS.muted,
                    cursor: 'pointer',
                    fontSize: 11,
                    fontWeight: active ? 700 : 600,
                    transition: 'all 150ms ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab === 'all'
                    ? 'All Meetings'
                    : tab === 'upcoming'
                      ? 'Upcoming'
                      : 'Past Meetings'}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div
            style={{
              position: 'relative',
              flex: '1 1 220px',
              maxWidth: 320,
              minWidth: 0,
            }}
          >
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: COLORS.muted,
                pointerEvents: 'none',
              }}
            />

            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search meetings"
              style={{
                boxSizing: 'border-box',
                width: '100%',
                padding: '10px 12px 10px 36px',
                background: '#FFFFFF',
                border: `1px solid ${COLORS.mist}`,
                borderRadius: 8,
                color: COLORS.ink,
                fontSize: 12,
                outlineColor: COLORS.blue,
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 13,
            color: COLORS.muted,
            fontSize: 11,
          }}
        >
          <Filter size={13} color={COLORS.blue} />
          Showing{' '}
          <strong style={{ color: COLORS.ink }}>
            {filteredMeetings.length}
          </strong>{' '}
          of {meetings.length} meetings
        </div>
      </div>

      {/* Meeting List */}
      {filteredMeetings.length === 0 ? (
        <div
          style={{
            ...baseCardStyle,
            padding: '48px 20px',
            textAlign: 'center',
            borderStyle: 'dashed',
            boxShadow: 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 52,
              height: 52,
              margin: '0 auto 15px',
              borderRadius: 14,
              background: '#F0F2FF',
              color: COLORS.blue,
            }}
          >
            <Video size={25} />
          </div>

          <h3
            style={{
              margin: '0 0 7px',
              color: COLORS.ink,
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: '-0.4px',
            }}
          >
            No meetings found
          </h3>

          <p
            style={{
              maxWidth: 350,
              margin: '0 auto',
              color: COLORS.muted,
              fontSize: 12,
              lineHeight: 1.8,
            }}
          >
            {searchQuery
              ? 'No meetings match your search. Try another keyword or clear your search.'
              : 'There are no meetings available in this view right now.'}
          </p>

          {(searchQuery || filterType !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
              style={{
                marginTop: 17,
                padding: '9px 15px',
                border: 'none',
                borderRadius: 7,
                background: COLORS.blue,
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {filteredMeetings.map((meeting) => {
            const isCancelled = meeting.status === 'cancelled';
            const attStatus =
              meeting.myAttendance?.status || 'not_recorded';

            const isUpcoming =
              new Date(meeting.date) >= now &&
              meeting.status !== 'completed' &&
              !isCancelled;

            const meetingLink = meeting.link
              ? meeting.link.startsWith('http')
                ? meeting.link
                : `https://${meeting.link}`
              : null;

            return (
              <article
                key={meeting._id}
                style={{
                  ...baseCardStyle,
                  padding: '19px',
                  borderColor: isCancelled ? '#F5CDD2' : COLORS.mist,
                  borderLeft: `4px solid ${
                    isCancelled
                      ? COLORS.red
                      : isUpcoming
                        ? COLORS.blue
                        : COLORS.mist
                  }`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {/* Meeting Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 7,
                      }}
                    >
                      {meeting.meeting_id && (
                        <span
                          style={{
                            padding: '5px 8px',
                            borderRadius: 5,
                            background: '#F0F2FF',
                            color: COLORS.blue,
                            fontFamily: 'monospace',
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        >
                          {meeting.meeting_id}
                        </span>
                      )}

                      {isCancelled && (
                        <span
                          style={{
                            padding: '5px 8px',
                            borderRadius: 5,
                            background: '#FDECEE',
                            border: '1px solid #F5CDD2',
                            color: COLORS.red,
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        >
                          Cancelled
                        </span>
                      )}

                      {!isCancelled && isUpcoming && (
                        <span
                          style={{
                            padding: '5px 8px',
                            borderRadius: 5,
                            background: '#E7F6EE',
                            color: COLORS.green,
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        >
                          Upcoming
                        </span>
                      )}
                    </div>

                    <h3
                      style={{
                        margin: '10px 0 5px',
                        color: COLORS.ink,
                        fontSize: 17,
                        lineHeight: 1.4,
                        fontWeight: 800,
                        letterSpacing: '-0.45px',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {meeting.title}
                    </h3>

                    {meeting.purpose && (
                      <p
                        style={{
                          margin: 0,
                          color: COLORS.muted,
                          fontSize: 12,
                          lineHeight: 1.7,
                        }}
                      >
                        {meeting.purpose}
                      </p>
                    )}
                  </div>

                  <div style={{ flexShrink: 0 }}>
                    {isCancelled ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '6px 9px',
                          borderRadius: 6,
                          background: '#F0F1F7',
                          color: COLORS.muted,
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        <AlertCircle size={13} />
                        Exempt
                      </span>
                    ) : (
                      getAttendanceBadge(attStatus)
                    )}
                  </div>
                </div>

                {/* Meeting Details */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: 10,
                    padding: '14px 12px',
                    borderRadius: 9,
                    background: '#F8F9FD',
                    border: '1px solid #ECEEF6',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 9,
                      minWidth: 0,
                    }}
                  >
                    <Calendar
                      size={15}
                      color={COLORS.blue}
                      style={{ flexShrink: 0, marginTop: 2 }}
                    />

                    <div>
                      <div
                        style={{
                          color: COLORS.muted,
                          fontSize: 10,
                          fontWeight: 700,
                          marginBottom: 4,
                        }}
                      >
                        DATE
                      </div>

                      <div
                        style={{
                          color: COLORS.ink,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {formatDate(meeting.date)}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 9,
                      minWidth: 0,
                    }}
                  >
                    <Clock
                      size={15}
                      color={COLORS.blue}
                      style={{ flexShrink: 0, marginTop: 2 }}
                    />

                    <div>
                      <div
                        style={{
                          color: COLORS.muted,
                          fontSize: 10,
                          fontWeight: 700,
                          marginBottom: 4,
                        }}
                      >
                        TIME
                      </div>

                      <div
                        style={{
                          color: COLORS.ink,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {meeting.startTime} – {meeting.endTime}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 9,
                      minWidth: 0,
                    }}
                  >
                    <Video
                      size={15}
                      color={COLORS.blue}
                      style={{ flexShrink: 0, marginTop: 2 }}
                    />

                    <div>
                      <div
                        style={{
                          color: COLORS.muted,
                          fontSize: 10,
                          fontWeight: 700,
                          marginBottom: 4,
                        }}
                      >
                        MEETING TYPE
                      </div>

                      <div
                        style={{
                          color: COLORS.ink,
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'capitalize',
                        }}
                      >
                        {meeting.type || 'General'} Meeting
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agenda */}
                {meeting.agenda && (
                  <div
                    style={{
                      padding: '12px 14px',
                      borderRadius: 8,
                      background: '#FFFFFF',
                      border: `1px solid ${COLORS.mist}`,
                    }}
                  >
                    <div
                      style={{
                        marginBottom: 6,
                        color: COLORS.blue,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: '0.7px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Agenda
                    </div>

                    <p
                      style={{
                        margin: 0,
                        color: COLORS.ink,
                        fontSize: 12,
                        lineHeight: 1.8,
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {meeting.agenda}
                    </p>
                  </div>
                )}

                {/* Description */}
                {meeting.description && (
                  <p
                    style={{
                      margin: 0,
                      color: COLORS.muted,
                      fontSize: 12,
                      lineHeight: 1.8,
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {meeting.description}
                  </p>
                )}

                {/* Venue and Join Link */}
                {(meeting.venue || meetingLink) && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12,
                      paddingTop: 13,
                      borderTop: `1px solid ${COLORS.mist}`,
                    }}
                  >
                    {meeting.venue ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 7,
                          color: COLORS.amber,
                          fontSize: 11,
                          fontWeight: 600,
                          lineHeight: 1.7,
                          minWidth: 0,
                          flex: '1 1 150px',
                        }}
                      >
                        <MapPin
                          size={15}
                          style={{ flexShrink: 0, marginTop: 1 }}
                        />

                        <span style={{ overflowWrap: 'anywhere' }}>
                          {meeting.venue}
                        </span>
                      </div>
                    ) : (
                      <div />
                    )}

                    {meetingLink && (
                      <a
                        href={meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          padding: '10px 14px',
                          borderRadius: 7,
                          background: COLORS.blue,
                          border: `1px solid ${COLORS.blue}`,
                          color: '#FFFFFF',
                          fontSize: 11,
                          fontWeight: 700,
                          textDecoration: 'none',
                          marginLeft: 'auto',
                          transition: 'opacity 150ms ease',
                        }}
                      >
                        <Video size={14} />
                        Join Meeting
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Footer Note */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          marginTop: 20,
          padding: '13px 15px',
          borderRadius: 9,
          background: '#F0F2FF',
          border: '1px solid #DDE2FF',
        }}
      >
        <AlertCircle
          size={16}
          color={COLORS.blue}
          style={{ flexShrink: 0, marginTop: 2 }}
        />

        <p
          style={{
            margin: 0,
            color: COLORS.muted,
            fontSize: 11,
            lineHeight: 1.8,
          }}
        >
          <strong style={{ color: COLORS.ink }}>
            Meeting information
          </strong>
          {' '}— Check the scheduled date, time, venue, and agenda before
          attending. If an online meeting link is provided, use the
          Join Meeting button to open it in a new tab.
        </p>
      </div>
    </div>
  );
}
