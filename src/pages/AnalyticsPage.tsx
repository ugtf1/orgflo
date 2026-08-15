import React from 'react';
import { BarChart3, TrendingUp, DollarSign, CalendarCheck, ShieldCheck, Download } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useData } from '../context/DataContext';

export const AnalyticsPage: React.FC = () => {
  const { members, transactions, settings } = useData();

  const totalDuesPaid = members.reduce((sum, m) => sum + m.duesPaid, 0);
  const totalDuesOwed = members.reduce((sum, m) => sum + m.duesOwed, 0);
  const totalRevenue = totalDuesPaid;

  const monthlyBreakdown = [
    { month: 'Jan', Dues: 1850, Donations: 400, Levies: 200 },
    { month: 'Feb', Dues: 2200, Donations: 150, Levies: 300 },
    { month: 'Mar', Dues: 1950, Donations: 600, Levies: 100 },
    { month: 'Apr', Dues: 2800, Donations: 300, Levies: 450 },
    { month: 'May', Dues: 3100, Donations: 200, Levies: 250 },
    { month: 'Jun', Dues: 2600, Donations: 800, Levies: 500 },
    { month: 'Jul', Dues: 3400, Donations: 100, Levies: 300 },
    { month: 'Aug', Dues: 4100, Donations: 500, Levies: 600 }
  ];

  const paymentMethodData = [
    { name: 'Mobile Money', value: 55 },
    { name: 'Bank Transfer', value: 30 },
    { name: 'Card', value: 15 }
  ];

  const COLORS = ['#0e3d26', '#196a43', '#529671'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
          Financial Reports & Analytics
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Deep-dive visual reporting for organization revenue streams and payment metrics.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e8f0ea' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>
            GROSS YTD REVENUE
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
            {settings.currency}{totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#137333', marginTop: '4px', fontWeight: '600' }}>
            ↑ 24.5% year-over-year
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e8f0ea' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>
            COLLECTION EFFICIENCY
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
            {((totalDuesPaid / (totalDuesPaid + totalDuesOwed || 1)) * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#137333', marginTop: '4px', fontWeight: '600' }}>
            Target: 90%+
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e8f0ea' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>
            RECEIVABLE BALANCES
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#b06000' }}>
            {settings.currency}{totalDuesOwed.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#b06000', marginTop: '4px', fontWeight: '600' }}>
            Pending member collections
          </div>
        </div>
      </div>

      {/* Stacked Revenue Chart */}
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
          Revenue Sources Breakdown (Monthly)
        </h3>

        <div style={{ width: '100%', height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyBreakdown}>
              <XAxis dataKey="month" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip formatter={(v) => `$${v}`} />
              <Legend />
              <Bar dataKey="Dues" stackId="a" fill="#0e3d26" radius={[0, 0, 4, 4]} />
              <Bar dataKey="Donations" stackId="a" fill="#196a43" />
              <Bar dataKey="Levies" stackId="a" fill="#88c99e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Channels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
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
            Payment Channels Used (%)
          </h3>

          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={paymentMethodData} cx="50%" cy="50%" outerRadius={75} label dataKey="value">
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `${val}%`} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

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
            Monthly Balance Manager Summary
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ color: 'var(--text-muted)' }}>Opening Balance (Jan 2026)</span>
              <span style={{ fontWeight: '700', color: 'var(--primary)' }}>$5,000.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Dues & Collections</span>
              <span style={{ fontWeight: '700', color: '#137333' }}>+${totalDuesPaid.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ color: 'var(--text-muted)' }}>Operational Expenses</span>
              <span style={{ fontWeight: '700', color: '#c5221f' }}>-$4,200.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary)' }}>
              <span>Current Reserve Balance</span>
              <span>${(5000 + totalDuesPaid - 4200).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
