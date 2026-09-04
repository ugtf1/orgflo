import React, { useState } from 'react';
import { Calendar, UserCheck, Sparkles, ChevronLeft, ChevronRight, Award, Plus, X, Search, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MeetingHostingPage: React.FC = () => {
  const { hostingSchedule, members, assignHostMember } = useData();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [modalMonth, setModalMonth] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Find user member match
  const userMember = members.find((m) => m.email === user?.email || m.id === user?.memberId);
  const userHostingMonth = hostingSchedule.find(
    (h) => h.year === selectedYear && (h.hostMemberId === userMember?.id || h.hostMemberName.toLowerCase().includes(user?.name.toLowerCase() || '___'))
  );

  const handleOpenAssignModal = (month: string) => {
    if (!isAdmin) return;
    const existing = hostingSchedule.find((h) => h.year === selectedYear && h.month === month);
    setModalMonth(month);
    setSelectedMemberId(existing?.hostMemberId || members[0]?.id || '');
    setNotes(existing?.notes || '');
  };

  const handleSaveHost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalMonth || !selectedMemberId) return;

    const host = members.find((m) => m.id === selectedMemberId);
    if (host) {
      assignHostMember(selectedYear, modalMonth, host.id, host.name, notes);
    }
    setModalMonth(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner & Year Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
            Monthly Meeting Hosting Schedule
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Host member assignments and monthly organization responsibilities for cultural & tribal meetings.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#ffffff', padding: '6px 16px', borderRadius: '14px', border: '1px solid #e8f0ea', boxShadow: 'var(--shadow-sm)' }}>
          <button
            onClick={() => setSelectedYear((y) => y - 1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--primary)' }}
            aria-label="Previous Year"
          >
            <ChevronLeft size={20} />
          </button>
          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)', minWidth: '60px', textAlign: 'center' }}>
            {selectedYear}
          </span>
          <button
            onClick={() => setSelectedYear((y) => y + 1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--primary)' }}
            aria-label="Next Year"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Member Celebratory Banner */}
      {userHostingMonth && (
        <div
          style={{
            background: 'linear-gradient(135deg, #0e3d26 0%, #1e5e3a 100%)',
            color: '#ffffff',
            borderRadius: '20px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 8px 24px rgba(14, 61, 38, 0.2)'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#e6f4ea',
              color: '#0e3d26',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Award size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9bb8a6', fontWeight: '700' }}>
              Your Hosting Assignment
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '4px 0 2px 0' }}>
              You are assigned to host the {userHostingMonth.month} {selectedYear} Meeting!
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#c3ded0', margin: 0 }}>
              Notes: {userHostingMonth.notes || 'Monthly host responsibilities & cultural refreshment setup.'}
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Search host member name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '12px',
              border: '1px solid #d0e0d5',
              fontSize: '0.88rem',
              outline: 'none',
              background: '#ffffff'
            }}
          />
        </div>
        <div style={{ fontSize: '0.85rem', color: '#555', fontWeight: '600' }}>
          Showing 12 Months for {selectedYear}
        </div>
      </div>

      {/* 12-Month Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {MONTHS.map((month) => {
          const assignment = hostingSchedule.find((h) => h.year === selectedYear && h.month === month);
          const hostMember = assignment ? members.find((m) => m.id === assignment.hostMemberId || m.name === assignment.hostMemberName) : null;
          const isUserHost = userHostingMonth?.month === month;
          const matchesSearch = !searchTerm || assignment?.hostMemberName.toLowerCase().includes(searchTerm.toLowerCase());

          if (!matchesSearch) return null;

          return (
            <div
              key={month}
              style={{
                background: isUserHost ? '#f0f9f3' : '#ffffff',
                border: isUserHost ? '2px solid #0e3d26' : '1px solid #e2ece4',
                borderRadius: '18px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isUserHost ? '0 4px 16px rgba(14, 61, 38, 0.12)' : 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div>
                {/* Month Tag & Host Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)' }}>
                    {month} {selectedYear}
                  </span>
                  {isUserHost && (
                    <span
                      style={{
                        background: '#0e3d26',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Sparkles size={12} /> Your Hosting
                    </span>
                  )}
                </div>

                {/* Host Member Profile Box */}
                {assignment ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f5f8f5', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
                    <img
                      src={hostMember?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={assignment.hostMemberName}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {assignment.hostMemberName}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#555' }}>
                        {hostMember?.role || 'Assigned Host'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#fcfcfc', border: '1px dashed #c0d4c8', padding: '16px', borderRadius: '12px', textAlign: 'center', marginBottom: '12px', color: '#888', fontSize: '0.84rem' }}>
                    No host assigned yet
                  </div>
                )}

                {/* Notes & Date info */}
                {assignment?.notes && (
                  <div style={{ fontSize: '0.82rem', color: '#444', marginBottom: '12px', background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #eee' }}>
                    <strong>Note:</strong> {assignment.notes}
                  </div>
                )}
              </div>

              {/* Card Action Button */}
              {isAdmin && (
                <button
                  onClick={() => handleOpenAssignModal(month)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #195235',
                    background: '#ffffff',
                    color: '#0e3d26',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <UserCheck size={15} /> {assignment ? 'Reassign Host' : 'Assign Host'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Admin Assign Modal */}
      {modalMonth && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '16px' }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '440px', borderRadius: '20px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
                Assign Host: {modalMonth} {selectedYear}
              </h3>
              <button onClick={() => setModalMonth(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveHost} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
                  Select Host Member
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #c0d4c8',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  required
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.department} - {m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
                  Hosting Event Notes / Cultural Theme
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heritage Cultural Refreshments & Youth Host"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #c0d4c8',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setModalMonth(null)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #ccc',
                    background: '#ffffff',
                    color: '#555',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#0e3d26',
                    color: '#ffffff',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default MeetingHostingPage;
