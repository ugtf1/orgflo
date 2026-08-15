import React, { useState } from 'react';
import { CreditCard, Download, Search, Plus, Filter, X } from 'lucide-react';
import { useData } from '../context/DataContext';

export const TransactionsPage: React.FC = () => {
  const { transactions, members, addTransaction, settings } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [amount, setAmount] = useState('50');
  const [type, setType] = useState<'Dues' | 'Donation' | 'Special Levy' | 'Event Fee'>('Dues');
  const [status, setStatus] = useState<'Paid' | 'Pending' | 'Overdue'>('Paid');
  const [paymentMethod, setPaymentMethod] = useState<'Mobile Money' | 'Card' | 'Bank Transfer' | 'Cash'>('Mobile Money');
  const [notes, setNotes] = useState('');

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesType = typeFilter === 'All' || t.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find((m) => m.id === selectedMemberId);
    if (!mem) return;

    addTransaction({
      memberId: mem.id,
      memberName: mem.name,
      type,
      amount: parseFloat(amount) || 0,
      status,
      paymentMethod,
      notes
    });

    setShowAddModal(false);
  };

  const exportCSV = () => {
    const headers = ['Receipt #', 'TXN ID', 'Member', 'Type', 'Amount', 'Method', 'Date', 'Status', 'Notes'];
    const rows = filtered.map((t) => [
      t.receiptNumber,
      t.transactionId,
      `"${t.memberName}"`,
      t.type,
      t.amount,
      t.paymentMethod,
      t.date,
      t.status,
      `"${t.notes || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `orgflow_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
            Financial Ledger & Dues
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Comprehensive log of all dues collected, donations, special levies, and receipts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={exportCSV} className="btn-secondary" style={{ padding: '10px 20px' }}>
            <Download size={16} /> Export CSV
          </button>

          <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ padding: '10px 22px' }}>
            <Plus size={18} /> Record New Entry
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid #e8f0ea'
        }}
      >
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Search by member, receipt, or txn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              borderRadius: '10px',
              border: '1.5px solid #dce8df',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none', fontSize: '0.88rem' }}
        >
          <option value="All">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none', fontSize: '0.88rem' }}
        >
          <option value="All">All Types</option>
          <option value="Dues">Dues</option>
          <option value="Donation">Donation</option>
          <option value="Special Levy">Special Levy</option>
          <option value="Event Fee">Event Fee</option>
        </select>
      </div>

      {/* Ledger Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid #e8f0ea'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eef4f0', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Receipt #</th>
                <th style={{ padding: '12px 16px' }}>Member</th>
                <th style={{ padding: '12px 16px' }}>Type</th>
                <th style={{ padding: '12px 16px' }}>Amount</th>
                <th style={{ padding: '12px 16px' }}>Method</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f0f5f1' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--primary)' }}>{t.receiptNumber}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '600' }}>{t.memberName}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{t.type}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: '#137333' }}>
                    {settings.currency}{t.amount}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#555' }}>{t.paymentMethod}</td>
                  <td style={{ padding: '14px 16px', color: '#555' }}>{t.date}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge badge-${t.status.toLowerCase()}`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record New Transaction Modal */}
      {showAddModal && (
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
              maxWidth: '460px',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)' }}>
                Record Financial Entry
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', fontSize: '1.2rem', color: '#888' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTx} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                  Select Member
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.memberCode})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
                  >
                    <option value="Dues">Dues</option>
                    <option value="Donation">Donation</option>
                    <option value="Special Levy">Special Levy</option>
                    <option value="Event Fee">Event Fee</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                    Amount ({settings.currency})
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                    Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
                  >
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                  Notes / Description
                </label>
                <input
                  type="text"
                  placeholder="Optional memo..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px' }}
              >
                Log Entry to Ledger
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
