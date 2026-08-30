import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
  ArrowRight,
  Sparkles,
  Download,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const MemberDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { members, transactions, meetings, settings } = useData();

  const currentMember = members.find((m) => m.id === user?.memberId || m.email === user?.email) || members[1];
  const myTxs = transactions.filter((t) => t.memberId === currentMember?.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Banner */}
      <div
        className="dash-welcome-banner"
        style={{
          background: 'linear-gradient(135deg, #0e3d26 0%, #165637 100%)',
          borderRadius: '24px',
          padding: '32px 36px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 10px 30px rgba(14, 61, 38, 0.15)'
        }}
      >
        <div>
          <div style={{ fontSize: '0.85rem', color: '#a7d6b6', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
            MEMBER PORTAL
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' }}>
            Welcome back, {currentMember?.name}!
          </h2>
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
            {currentMember?.role} • {currentMember?.department} ({currentMember?.memberCode})
          </p>
        </div>

        <div className="dash-banner-actions">
          <button
            onClick={() => navigate('/member/transactions')}
            style={{
              background: 'var(--accent-mint)',
              color: 'var(--primary)',
              padding: '12px 24px',
              borderRadius: '9999px',
              fontWeight: '800',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%'
            }}
          >
            <CreditCard size={18} /> Pay Dues / View Ledger
          </button>
        </div>
      </div>

      {/* Dues Cards Grid */}
      <div className="dash-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e8f0ea' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
            TOTAL DUES PAID
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#137333' }}>
            {settings.currency}{currentMember?.duesPaid.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#137333', marginTop: '4px', fontWeight: '600' }}>
            ✓ Account up to date
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e8f0ea' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
            DUES OUTSTANDING
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: (currentMember?.duesOwed || 0) > 0 ? '#c5221f' : 'var(--primary)' }}>
            {settings.currency}{currentMember?.duesOwed.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: (currentMember?.duesOwed || 0) > 0 ? '#c5221f' : '#137333', marginTop: '4px', fontWeight: '600' }}>
            {(currentMember?.duesOwed || 0) > 0 ? 'Pending monthly payment' : 'No balance owed'}
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e8f0ea' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
            MEMBERSHIP STATUS
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
            <span className={`badge badge-${currentMember?.status.toLowerCase()}`}>{currentMember?.status}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Joined on {currentMember?.joinDate}
          </div>
        </div>
      </div>

      {/* Content Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recent Personal Transactions */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e8f0ea'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>
              My Recent Payments
            </h3>
            <button
              onClick={() => navigate('/member/transactions')}
              style={{ background: 'none', color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem' }}
            >
              View All →
            </button>
          </div>

          {myTxs.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No payment history recorded yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eef4f0', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Receipt #</th>
                  <th style={{ padding: '10px 12px' }}>Type</th>
                  <th style={{ padding: '10px 12px' }}>Amount</th>
                  <th style={{ padding: '10px 12px' }}>Date</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {myTxs.slice(0, 4).map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f0f5f1' }}>
                    <td data-label="Receipt #" style={{ padding: '12px', fontWeight: '700', color: 'var(--primary)' }}>{t.receiptNumber}</td>
                    <td data-label="Type" style={{ padding: '12px', color: '#555' }}>{t.type}</td>
                    <td data-label="Amount" style={{ padding: '12px', fontWeight: '700', color: '#137333' }}>
                      {settings.currency}{t.amount}
                    </td>
                    <td data-label="Date" style={{ padding: '12px', color: '#555' }}>{t.date}</td>
                    <td data-label="Status" style={{ padding: '12px' }}>
                      <span className="badge badge-active">{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Upcoming Meetings & Announcements */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e8f0ea'
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '16px' }}>
            Upcoming Organization Events
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {meetings.map((m) => (
              <div key={m.id} style={{ background: '#f4f9f5', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '0.78rem', color: '#137333', fontWeight: '700', textTransform: 'uppercase' }}>
                  {m.date} at {m.time}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary)', margin: '4px 0' }}>
                  {m.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#555' }}>📍 {m.location}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
