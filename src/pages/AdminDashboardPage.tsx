import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CalendarCheck,
  Plus,
  ArrowUpRight,
  Download,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';
import { useData } from '../context/DataContext';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { members, transactions, meetings, settings } = useData();

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'Active').length;
  const totalDuesPaid = members.reduce((sum, m) => sum + m.duesPaid, 0);
  const totalDuesOwed = members.reduce((sum, m) => sum + m.duesOwed, 0);

  // Month definition list
  const MONTHS_LIST = [
    { full: 'January', short: 'Jan' },
    { full: 'February', short: 'Feb' },
    { full: 'March', short: 'Mar' },
    { full: 'April', short: 'Apr' },
    { full: 'May', short: 'May' },
    { full: 'June', short: 'Jun' },
    { full: 'July', short: 'Jul' },
    { full: 'August', short: 'Aug' },
    { full: 'September', short: 'Sep' },
    { full: 'October', short: 'Oct' },
    { full: 'November', short: 'Nov' },
    { full: 'December', short: 'Dec' }
  ];

  // Dynamically calculate total sum of all recorded transactions (all categories) on a monthly basis
  const monthlySumMap: Record<string, number> = {};
  MONTHS_LIST.forEach((m) => {
    monthlySumMap[m.short] = 0;
  });

  transactions.forEach((tx) => {
    let monthShort = '';
    if (tx.month) {
      const found = MONTHS_LIST.find(
        (m) => m.full.toLowerCase() === tx.month.toLowerCase() || m.short.toLowerCase() === tx.month.toLowerCase()
      );
      if (found) monthShort = found.short;
    }
    if (!monthShort && tx.date) {
      const d = new Date(tx.date);
      if (!isNaN(d.getTime())) {
        monthShort = MONTHS_LIST[d.getMonth()].short;
      }
    }
    if (monthShort && monthlySumMap[monthShort] !== undefined) {
      monthlySumMap[monthShort] += Number(tx.amount || 0);
    }
  });

  const monthlyData = MONTHS_LIST.slice(0, 8).map((m) => ({
    month: m.short,
    totalSum: monthlySumMap[m.short],
    amount: monthlySumMap[m.short]
  }));

  const COLORS = ['#0e3d26', '#196a43', '#529671', '#88c99e', '#b7e4c7'];

  const deptCounts = members.reduce((acc: Record<string, number>, m) => {
    acc[m.department] = (acc[m.department] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(deptCounts).map((dept) => ({
    name: dept,
    value: deptCounts[dept]
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0e3d26 0%, #165637 100%)',
          borderRadius: '24px',
          padding: '32px 36px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(14, 61, 38, 0.15)'
        }}
      >
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' }}>
            Admin Overview & Analytics
          </h2>
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
            Real-time insights for member engagement, dues collections, and attendance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/admin/members')}
            style={{
              background: 'var(--accent-mint)',
              color: 'var(--primary)',
              padding: '10px 20px',
              borderRadius: '9999px',
              fontWeight: '700',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} /> Manage Members
          </button>
          <button
            onClick={() => navigate('/admin/transactions')}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '9999px',
              fontWeight: '700',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CreditCard size={16} /> Dues Ledger
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e8f0ea' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Directory Members
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e6f4ea', color: '#137333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
            {totalMembers}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#137333', fontWeight: '600' }}>
            {activeMembers} Active • {totalMembers - activeMembers} Pending/Alumni
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e8f0ea' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Dues Collected
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e6f4ea', color: '#137333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
            {settings.currency}{totalDuesPaid.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#137333', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> +18.4% this year
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e8f0ea' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Outstanding Dues
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef7e0', color: '#b06000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#b06000', marginBottom: '4px' }}>
            {settings.currency}{totalDuesOwed.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#b06000', fontWeight: '600' }}>
            {members.filter((m) => m.duesOwed > 0).length} members pending payment
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e8f0ea' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Attendance Rate
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e6f4ea', color: '#137333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
            91.6%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#137333', fontWeight: '600' }}>
            {meetings.length} Recorded Meetings
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Revenue Area Chart */}
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
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)' }}>
                Monthly Total Sum of All Recorded Transactions
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Visualizing total sum across all categories (Dues, Donations, Levies, Event Fees) per month
              </span>
            </div>
            <button
              onClick={() => navigate('/admin/analytics')}
              style={{ background: 'none', color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Full Analytics <ArrowUpRight size={16} />
            </button>
          </div>

          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0e3d26" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0e3d26" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip formatter={(value: any) => [`${settings.currency}${Number(value).toLocaleString()}`, 'Total Sum (All Categories)']} />
                <Area type="monotone" dataKey="totalSum" stroke="#0e3d26" strokeWidth={3} fillOpacity={1} fill="url(#colorArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Pie Chart */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e8f0ea'
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
            Departments
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Member distribution by unit</span>

          <div style={{ width: '100%', height: '180px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
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
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)' }}>
              Recent Dues & Payment Ledger
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest transactions logged</span>
          </div>
          <button
            onClick={() => navigate('/admin/transactions')}
            className="btn-outline"
            style={{ padding: '6px 16px', fontSize: '0.82rem' }}
          >
            View All Ledger
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eef4f0', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Receipt / TXN</th>
                <th style={{ padding: '12px 16px' }}>Member</th>
                <th style={{ padding: '12px 16px' }}>Type</th>
                <th style={{ padding: '12px 16px' }}>Amount</th>
                <th style={{ padding: '12px 16px' }}>Method</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #f0f5f1' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--primary)' }}>
                    {tx.receiptNumber}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: '600' }}>{tx.memberName}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{tx.type}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--primary)' }}>
                    {settings.currency}{tx.amount}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{tx.paymentMethod}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{tx.date}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      className={`badge ${
                        tx.status === 'Paid' ? 'badge-active' : tx.status === 'Pending' ? 'badge-pending' : 'badge-overdue'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
