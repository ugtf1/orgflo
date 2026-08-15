import React, { useState } from 'react';
import { CreditCard, Download, Plus, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const MemberTransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const { members, transactions, addTransaction, settings } = useData();

  const currentMember = members.find((m) => m.id === user?.memberId || m.email === user?.email) || members[1];
  const myTxs = transactions.filter((t) => t.memberId === currentMember?.id);

  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState('50');
  const [payMethod, setPayMethod] = useState<'Mobile Money' | 'Card' | 'Bank Transfer'>('Mobile Money');
  const [successReceipt, setSuccessReceipt] = useState<any>(null);

  const handlePayDues = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember) return;

    const newTx = addTransaction({
      memberId: currentMember.id,
      memberName: currentMember.name,
      type: 'Dues',
      amount: parseFloat(payAmount) || 50,
      status: 'Paid',
      paymentMethod: payMethod,
      notes: `Direct Member Online Payment via ${payMethod}`
    });

    setSuccessReceipt(newTx);
    setShowPayModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
            My Dues & Payment Ledger
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            View your payment receipts, pay outstanding monthly dues, and export statements.
          </p>
        </div>

        <button onClick={() => setShowPayModal(true)} className="btn-primary" style={{ padding: '12px 26px' }}>
          <CreditCard size={18} /> Pay Dues Now
        </button>
      </div>

      {successReceipt && (
        <div
          style={{
            background: '#e6f4ea',
            border: '1.5px solid #a8dab5',
            borderRadius: '18px',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ color: '#137333', fontWeight: '800', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} /> Payment Successful!
            </div>
            <div style={{ fontSize: '0.88rem', color: '#2b5438', marginTop: '4px' }}>
              Receipt <b>{successReceipt.receiptNumber}</b> for {settings.currency}{successReceipt.amount} has been logged.
            </div>
          </div>
          <button
            onClick={() => setSuccessReceipt(null)}
            style={{ background: 'none', color: '#137333', fontWeight: '700', fontSize: '0.85rem' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Ledger Table */}
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
          Personal Payment Records
        </h3>

        {myTxs.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No payment records found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eef4f0', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Receipt #</th>
                  <th style={{ padding: '12px 14px' }}>Type</th>
                  <th style={{ padding: '12px 14px' }}>Amount</th>
                  <th style={{ padding: '12px 14px' }}>Payment Channel</th>
                  <th style={{ padding: '12px 14px' }}>Date</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {myTxs.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f0f5f1' }}>
                    <td style={{ padding: '14px 14px', fontWeight: '700', color: 'var(--primary)' }}>{t.receiptNumber}</td>
                    <td style={{ padding: '14px 14px' }}>{t.type}</td>
                    <td style={{ padding: '14px 14px', fontWeight: '700', color: '#137333' }}>
                      {settings.currency}{t.amount}
                    </td>
                    <td style={{ padding: '14px 14px', color: '#555' }}>{t.paymentMethod}</td>
                    <td style={{ padding: '14px 14px', color: '#555' }}>{t.date}</td>
                    <td style={{ padding: '14px 14px' }}>
                      <span className="badge badge-active">{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pay Dues Modal */}
      {showPayModal && (
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
                Pay Monthly Dues
              </h3>
              <button onClick={() => setShowPayModal(false)} style={{ background: 'none', fontSize: '1.2rem', color: '#888' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePayDues} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                  Member Name
                </label>
                <input
                  type="text"
                  disabled
                  value={currentMember?.name || ''}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#f5f5f5', border: '1px solid #ddd' }}
                />
              </div>

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
                  Select Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
                >
                  <option value="Mobile Money">Mobile Money (Direct to Cell)</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '10px', fontSize: '1rem' }}
              >
                Confirm & Pay Dues
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
