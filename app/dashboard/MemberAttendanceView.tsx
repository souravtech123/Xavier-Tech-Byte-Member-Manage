
'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Calendar,
  Filter,
  TrendingUp,
  Award,
  Clock,
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

const STATUS_STYLES: Record<
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

export default function MemberAttendanceView({
  meetings = [],
  stats,
  cardStyle,
  sectionHeader,
}: {
  meetings: any[];
  stats: {
    eligibleMeetings: number;
    attended: number;
    absent: number;
    excused: number;
    percentage: number;
  };
  cardStyle: React.CSSProperties;
  sectionHeader: (
    icon: React.ReactNode,
    label: string,
    color: string
  ) => React.ReactNode;
}) {
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'present' | 'absent' | 'excused'
  >('all');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredList = meetings.filter((meeting) => {
    const status = meeting.myAttendance?.status || 'not_recorded';

    if (statusFilter !== 'all' && status !== statusFilter) {
      return false;
    }

    if (startDate) {
      const date = new Date(meeting.date);
      const start = new Date(`${startDate}T00:00:00`);

      if (date < start) return false;
    }

    if (endDate) {
      const date = new Date(meeting.date);
      const end = new Date(`${endDate}T23:59:59.999`);

      if (date > end) return false;
    }

    return true;
  });

  const percentage = stats?.percentage ?? 100;

  const percentageColor =
    percentage >= 75
      ? COLORS.green
      : percentage >= 50
        ? COLORS.amber
        : COLORS.red;

  const cardBase: React.CSSProperties = {
    ...cardStyle,
    background: '#FFFFFF',
    border: `1px solid ${COLORS.mist}`,
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(15,18,38,0.025)',
  };

  const getStatusBadge = (
    status: string,
    isCancelled: boolean
  ) => {
    if (isCancelled) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 9px',
            borderRadius: 6,
            background: '#F0F1F7',
            border: `1px solid ${COLORS.mist}`,
            color: COLORS.muted,
            fontSize: 11,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          <AlertCircle size={12} />
          Cancelled · Exempt
        </span>
      );
    }

    const style = STATUS_STYLES[status] || STATUS_STYLES.not_recorded;

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
          padding: '5px 10px',
          borderRadius: 6,
          background: style.background,
          border: `1px solid ${style.border}`,
          color: style.color,
          fontSize: 11,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
      >
        {icon}
        {label}
      </span>
    );
  };

  const statCard = (
    label: string,
    value: string | number,
    description: string,
    accent: string,
    icon: React.ReactNode,
    background = '#FFFFFF'
  ) => (
    <div
      style={{
        ...cardBase,
        padding: '17px 16px',
        minWidth: 0,
        background,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            color: COLORS.muted,
            fontSize: 10,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.7px',
            lineHeight: 1.5,
          }}
        >
          {label}
        </span>

        <span
          style={{
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            borderRadius: 8,
            background: `${accent}12`,
            color: accent,
          }}
        >
          {icon}
        </span>
      </div>

      <div
        style={{
          fontSize: 29,
          fontWeight: 800,
          letterSpacing: '-1.2px',
          color: accent,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>

      <p
        style={{
          margin: '8px 0 0',
          color: COLORS.muted,
          fontSize: 11,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
    </div>
  );

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1000,
        color: COLORS.ink,
      }}
    >
      {/* Section Heading */}
      {sectionHeader(
        <CheckCircle2
          size={18}
          color={COLORS.blue}
        />,
        'My Attendance',
        COLORS.blue
      )}

      <div
        style={{
          marginTop: 8,
          marginBottom: 22,
          color: COLORS.muted,
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        Track your meeting participation, review attendance records,
        and monitor your overall attendance rate.
      </div>

      {/* Attendance Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}
      >
        {/* Overall Rate */}
        <div
          style={{
            ...cardBase,
            padding: '17px 16px',
            background: '#F0F2FF',
            borderColor: '#D9DEFF',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              marginBottom: 14,
            }}
          >
            <span
              style={{
                color: COLORS.muted,
                fontSize: 10,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.7px',
              }}
            >
              Overall Rate
            </span>

            <TrendingUp size={18} color={COLORS.blue} />
          </div>

          <div
            style={{
              color: percentageColor,
              fontSize: 31,
              fontWeight: 800,
              letterSpacing: '-1.2px',
              lineHeight: 1.1,
            }}
          >
            {percentage}%
          </div>

          <div
            style={{
              height: 5,
              marginTop: 15,
              overflow: 'hidden',
              borderRadius: 10,
              background: '#DDE0F0',
            }}
          >
            <div
              style={{
                width: `${Math.min(100, Math.max(0, percentage))}%`,
                height: '100%',
                borderRadius: 10,
                background: percentageColor,
                transition: 'width 250ms ease',
              }}
            />
          </div>

          <p
            style={{
              margin: '9px 0 0',
              color: COLORS.muted,
              fontSize: 11,
            }}
          >
            Your current attendance
          </p>
        </div>

        {statCard(
          'Evaluated Meetings',
          stats?.eligibleMeetings ?? 0,
          'Concluded sessions',
          COLORS.ink,
          <Calendar size={17} />
        )}

        {statCard(
          'Attended',
          stats?.attended ?? 0,
          'Marked present',
          COLORS.green,
          <CheckCircle2 size={17} />,
          '#F5FBF7'
        )}

        {statCard(
          'Absences',
          stats?.absent ?? 0,
          'Marked absent',
          COLORS.red,
          <XCircle size={17} />,
          '#FFF8F8'
        )}

        {statCard(
          'Excused',
          stats?.excused ?? 0,
          'Exempt from rate',
          COLORS.amber,
          <Award size={17} />,
          '#FFFCF4'
        )}
      </div>

      {/* History Section Heading */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              color: COLORS.ink,
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: '-0.5px',
            }}
          >
            Attendance History
          </h3>

          <p
            style={{
              margin: '5px 0 0',
              color: COLORS.muted,
              fontSize: 12,
            }}
          >
            Review and filter your meeting records.
          </p>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '7px 10px',
            borderRadius: 7,
            background: '#FFFFFF',
            border: `1px solid ${COLORS.mist}`,
            color: COLORS.muted,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          <Filter size={13} color={COLORS.blue} />
          {filteredList.length} records
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          ...cardBase,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* Status Filter */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
            }}
          >
            {(
              ['all', 'present', 'absent', 'excused'] as const
            ).map((tab) => {
              const active = statusFilter === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  aria-pressed={active}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 7,
                    border: `1px solid ${
                      active ? COLORS.blue : COLORS.mist
                    }`,
                    background: active ? COLORS.blue : '#FFFFFF',
                    color: active ? '#FFFFFF' : COLORS.muted,
                    cursor: 'pointer',
                    fontSize: 11,
                    fontWeight: active ? 700 : 600,
                    textTransform: 'capitalize',
                    transition: 'all 150ms ease',
                  }}
                >
                  {tab === 'all' ? 'All Records' : tab}
                </button>
              );
            })}
          </div>

          {/* Date Range */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
              color: COLORS.muted,
              fontSize: 11,
            }}
          >
            <label
              htmlFor="attendance-start-date"
              style={{ fontWeight: 700 }}
            >
              From
            </label>

            <input
              id="attendance-start-date"
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(event) => setStartDate(event.target.value)}
              style={{
                width: 135,
                maxWidth: '100%',
                padding: '8px 9px',
                borderRadius: 7,
                background: '#FFFFFF',
                border: `1px solid ${COLORS.mist}`,
                color: COLORS.ink,
                fontSize: 11,
                outlineColor: COLORS.blue,
                colorScheme: 'light',
              }}
            />

            <label
              htmlFor="attendance-end-date"
              style={{ fontWeight: 700 }}
            >
              To
            </label>

            <input
              id="attendance-end-date"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
              style={{
                width: 135,
                maxWidth: '100%',
                padding: '8px 9px',
                borderRadius: 7,
                background: '#FFFFFF',
                border: `1px solid ${COLORS.mist}`,
                color: COLORS.ink,
                fontSize: 11,
                outlineColor: COLORS.blue,
                colorScheme: 'light',
              }}
            />

            {(startDate || endDate) && (
              <button
                type="button"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                style={{
                  padding: '7px 3px',
                  background: 'transparent',
                  border: 'none',
                  color: COLORS.blue,
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div
        style={{
          ...cardBase,
          overflow: 'hidden',
          padding: 0,
        }}
      >
        {filteredList.length === 0 ? (
          <div
            style={{
              padding: '48px 20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                margin: '0 auto 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                background: '#F0F2FF',
                color: COLORS.blue,
              }}
            >
              <Calendar size={22} />
            </div>

            <h4
              style={{
                margin: '0 0 7px',
                color: COLORS.ink,
                fontSize: 15,
                fontWeight: 800,
              }}
            >
              No attendance records found
            </h4>

            <p
              style={{
                maxWidth: 330,
                margin: '0 auto',
                color: COLORS.muted,
                fontSize: 12,
                lineHeight: 1.7,
              }}
            >
              No meeting records match your selected filters. Try
              changing the status or date range.
            </p>

            {(statusFilter !== 'all' || startDate || endDate) && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  setStartDate('');
                  setEndDate('');
                }}
                style={{
                  marginTop: 16,
                  padding: '9px 14px',
                  borderRadius: 7,
                  border: 'none',
                  background: COLORS.blue,
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                minWidth: 650,
                borderCollapse: 'collapse',
                fontSize: 12,
                textAlign: 'left',
              }}
            >
              <thead>
                <tr
                  style={{
                    background: '#F8F9FD',
                    borderBottom: `1px solid ${COLORS.mist}`,
                    color: COLORS.muted,
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                  }}
                >
                  <th style={{ padding: '14px 16px' }}>
                    Date & Time
                  </th>

                  <th style={{ padding: '14px 16px' }}>
                    Meeting
                  </th>

                  <th style={{ padding: '14px 16px' }}>
                    Type
                  </th>

                  <th
                    style={{
                      padding: '14px 16px',
                      textAlign: 'right',
                    }}
                  >
                    Your Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredList.map((meeting) => {
                  const isCancelled = meeting.status === 'cancelled';
                  const attStatus =
                    meeting.myAttendance?.status || 'not_recorded';

                  return (
                    <tr
                      key={meeting._id}
                      style={{
                        borderBottom: `1px solid #ECEEF6`,
                      }}
                    >
                      <td
                        style={{
                          padding: '15px 16px',
                          color: COLORS.ink,
                          whiteSpace: 'nowrap',
                          verticalAlign: 'middle',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          {new Date(meeting.date).toLocaleDateString(
                            'en-IN',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            marginTop: 5,
                            color: COLORS.muted,
                            fontSize: 10,
                          }}
                        >
                          <Clock size={11} />
                          {meeting.startTime} – {meeting.endTime}
                        </div>
                      </td>

                      <td
                        style={{
                          padding: '15px 16px',
                          verticalAlign: 'middle',
                        }}
                      >
                        <div
                          style={{
                            color: COLORS.ink,
                            fontWeight: 700,
                            fontSize: 12,
                            lineHeight: 1.5,
                          }}
                        >
                          {meeting.title}
                        </div>

                        <div
                          style={{
                            marginTop: 5,
                            color: COLORS.blue,
                            fontFamily: 'monospace',
                            fontSize: 10,
                          }}
                        >
                          {meeting.meeting_id}
                        </div>
                      </td>

                      <td
                        style={{
                          padding: '15px 16px',
                          color: COLORS.muted,
                          textTransform: 'capitalize',
                          verticalAlign: 'middle',
                        }}
                      >
                        {meeting.type || '—'}
                      </td>

                      <td
                        style={{
                          padding: '15px 16px',
                          textAlign: 'right',
                          verticalAlign: 'middle',
                        }}
                      >
                        {getStatusBadge(attStatus, isCancelled)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Attendance Policy */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          marginTop: 18,
          padding: '16px',
          borderRadius: 10,
          background: '#F0F2FF',
          border: '1px solid #DDE2FF',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            background: '#FFFFFF',
            color: COLORS.blue,
          }}
        >
          <AlertCircle size={17} />
        </div>

        <div>
          <div
            style={{
              marginBottom: 5,
              color: COLORS.ink,
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            Attendance Policy
          </div>

          <p
            style={{
              margin: 0,
              color: COLORS.muted,
              fontSize: 11,
              lineHeight: 1.8,
            }}
          >
            Attendance rate is computed dynamically as{' '}
            <code
              style={{
                padding: '2px 5px',
                borderRadius: 4,
                background: '#FFFFFF',
                color: COLORS.blue,
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              (Present / Evaluated Meetings) × 100
            </code>
            . Cancelled meetings, future sessions, and unrecorded
            meetings are excluded from the calculation. Excused
            absences do not penalize your attendance score.
          </p>
        </div>
      </div>
    </div>
  );
}
