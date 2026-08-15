import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Plus,
  X
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const MemberDetailViewPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { members, transactions, meetings, addTransaction, settings } = useData();

  const member = members.find((m) => m.id === memberId);
  const memberTxs = transactions.filter((t) => t.memberId === memberId);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payAmount, setPayAmount] = useState('50');
  const [payType, setPayType] = useState<'Dues' | 'Donation' | 'Special Levy'>('Dues');
  const [payMethod, setPayMethod] = useState<'Mobile Money' | 'Card' | 'Bank Transfer'>('Mobile Money');

  if (!member) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Member Not Found</h2>
        <button onClick={() => navigate('/admin/members')} className="btn-primary" style={{ marginTop: '16px' }}>
          Back to Directory
        </button>
      </div>
    );
  }

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction({
      memberId: member.id,
      memberName: member.name,
      type: payType,
      amount: parseFloat(payAmount) || 0,
      status: 'Paid',
      paymentMethod: payMethod,
      notes: `Recorded payment for ${member.name}`
    });
    setShowPaymentModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Back Navigation */}
      <button
        onClick={() => navigate('/admin/members')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          color: 'var(--primary)',
          fontWeight: '700',
          fontSize: '0.92rem'
        }}
      >
        <ArrowLeft size={18} /> Back to Member Directory
      </button>

      {/* Profile Header Banner */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid #e8f0ea',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
            alt={member.name}
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-mint)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
                {member.name}
              </h2>
              <span className={`badge badge-${member.status.toLowerCase()}`}>{member.status}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '2px' }}>
              {member.role} • {member.department} ({member.memberCode})
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.85rem', color: '#555' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} /> {member.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} /> {member.phone}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowPaymentModal(true)}
          className="btn-primary"
          style={{ padding: '12px 24px' }}
        >
          <Plus size={18} /> Record Payment
        </button>
      </div>

      {/* Dues Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e8f0ea' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
            TOTAL DUES PAID
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#137333' }}>
            {settings.currency}{member.duesPaid.toLocaleString()}
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e8f0ea' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
            OUTSTANDING BALANCE
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: member.duesOwed > 0 ? '#c5221f' : 'var(--primary)' }}>
            {settings.currency}{member.duesOwed.toLocaleString()}
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e8f0ea' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
            MEMBERSHIP SINCE
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)' }}>
            {member.joinDate}
          </div>
        </div>
      </div>

      {/* Transactions History Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid #e8f0ea'
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '16px' }}>
          Transaction & Dues Ledger
        </h3>

        {memberTxs.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            No payments recorded yet for this member.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eef4f0', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Receipt #</th>
                <th style={{ padding: '10px 14px' }}>Type</th>
                <th style={{ padding: '10px 14px' }}>Amount</th>
                <th style={{ padding: '10px 14px' }}>Method</th>
                <th style={{ padding: '10px 14px' }}>Date</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {memberTxs.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f0f5f1' }}>
                  <td style={{ padding: '12px 14px', fontWeight: '700', color: 'var(--primary)' }}>{t.receiptNumber}</td>
                  <td style={{ padding: '12px 14px' }}>{t.type}</td>
                  <td style={{ padding: '12px 14px', fontWeight: '700', color: '#137333' }}>
                    {settings.currency}{t.amount}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#555' }}>{t.paymentMethod}</td>
                  <td style={{ padding: '12px 14px', color: '#555' }}>{t.date}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className="badge badge-active">{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '440px',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)' }}>
                Record Payment for {member.name}
              </h3>
              <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', fontSize: '1.2rem', color: '#888' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                  Amount ({settings.currency})
                </label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                  Payment Type
                </label>
                <select
                  value={payType}
                  onChange={(e) => setPayType(e.target.value as any)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
                >
                  <option value="Dues">Dues</option>
                  <option value="Donation">Donation</option>
                  <option value="Special Levy">Special Levy</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                  Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
                >
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px' }}
              >
                Submit Payment Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
