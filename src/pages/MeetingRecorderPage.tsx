import React, { useState } from 'react';
import { CalendarCheck, Users, CheckCircle2, XCircle, Clock, MapPin, Plus, Edit, X } from 'lucide-react';
import { useData } from '../context/DataContext';

export const MeetingRecorderPage: React.FC = () => {
  const { meetings, members, updateAttendance } = useData();
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(meetings[0]?.id || null);

  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
          Meeting & Attendance Tracker
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Log meeting sessions, record member RSVPs, and track attendance percentages.
        </p>
      </div>

      {/* Meetings List Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {meetings.map((mtg) => {
          const isSelected = mtg.id === selectedMeetingId;
          return (
            <div
              key={mtg.id}
              onClick={() => setSelectedMeetingId(mtg.id)}
              style={{
                background: isSelected ? 'var(--accent-mint)' : '#ffffff',
                border: isSelected ? '2px solid var(--primary)' : '1px solid #e8f0ea',
                borderRadius: '20px',
                padding: '20px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className={`badge ${mtg.status === 'Completed' ? 'badge-active' : 'badge-pending'}`}>
                  {mtg.status}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>{mtg.date}</span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
                {mtg.title}
              </h3>

              <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: '#555', marginBottom: '14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> {mtg.time}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {mtg.location}
                </span>
              </div>

              {mtg.status === 'Completed' && (
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.78rem', fontWeight: '700' }}>
                  <span style={{ color: '#137333' }}>{mtg.presentCount} Present</span>
                  <span style={{ color: '#c5221f' }}>{mtg.absentCount} Absent</span>
                  <span style={{ color: '#b06000' }}>{mtg.excusedCount} Excused</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Attendance Detail & Marking Sheet */}
      {selectedMeeting && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e8f0ea'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
                Attendance Roll Call: {selectedMeeting.title}
              </h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Click Present / Absent / Excused for each member to update attendance live.
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eef4f0', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Member</th>
                  <th style={{ padding: '12px 14px' }}>Department</th>
                  <th style={{ padding: '12px 14px' }}>Role</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Mark Attendance</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const status = selectedMeeting.attendanceRecords[m.id] || 'Absent';
                  return (
                    <tr key={m.id} style={{ borderBottom: '1px solid #f0f5f1' }}>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: 'var(--primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                            alt={m.name}
                            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                          />
                          <span>{m.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#555' }}>{m.department}</td>
                      <td style={{ padding: '12px 14px', color: '#555' }}>{m.role}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => updateAttendance(selectedMeeting.id, m.id, 'Present')}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              background: status === 'Present' ? '#137333' : '#e6f4ea',
                              color: status === 'Present' ? '#ffffff' : '#137333'
                            }}
                          >
                            Present
                          </button>

                          <button
                            onClick={() => updateAttendance(selectedMeeting.id, m.id, 'Absent')}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              background: status === 'Absent' ? '#c5221f' : '#fce8e6',
                              color: status === 'Absent' ? '#ffffff' : '#c5221f'
                            }}
                          >
                            Absent
                          </button>

                          <button
                            onClick={() => updateAttendance(selectedMeeting.id, m.id, 'Excused')}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              background: status === 'Excused' ? '#b06000' : '#fef7e0',
                              color: status === 'Excused' ? '#ffffff' : '#b06000'
                            }}
                          >
                            Excused
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
