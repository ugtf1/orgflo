import React from 'react';
import { BarChart3, TrendingUp, DollarSign, CalendarCheck, ShieldCheck, Download } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';
import { useData } from '../context/DataContext';

export const AnalyticsPage: React.FC = () => {
  const { members, transactions, settings } = useData();

  const totalDuesPaid = members.reduce((sum, m) => sum + m.duesPaid, 0);
  const totalDuesOwed = members.reduce((sum, m) => sum + m.duesOwed, 0);

  // Calculate gross total sum of all recorded transactions across all categories
  const grossRecordedSum = transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);

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

  // Dynamic monthly aggregate across all categories
  interface CategoryBreakdown {
    Dues: number;
    Donation: number;
    'Special Levy': number;
    'Event Fee': number;
    [key: string]: number;
  }

  const monthlyCategoryMap: Record<string, CategoryBreakdown> = {};
  MONTHS_LIST.forEach((m) => {
    monthlyCategoryMap[m.short] = {
      Dues: 0,
      Donation: 0,
      'Special Levy': 0,
      'Event Fee': 0
    };
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
    if (monthShort && monthlyCategoryMap[monthShort]) {
      const cat = tx.type || 'Dues';
      const currentCatVal = monthlyCategoryMap[monthShort][cat] || 0;
      monthlyCategoryMap[monthShort][cat] = currentCatVal + Number(tx.amount || 0);
    }
  });

  // Calculate monthly data with category breakdown & Total sum of all recorded transactions
  const monthlyData = MONTHS_LIST.slice(0, 8).map((m) => {
    const cats = monthlyCategoryMap[m.short];
    const totalSum = (cats['Dues'] || 0) + (cats['Donation'] || 0) + (cats['Special Levy'] || 0) + (cats['Event Fee'] || 0);
    return {
      month: m.short,
      Dues: cats['Dues'] || 0,
      Donation: cats['Donation'] || 0,
      'Special Levy': cats['Special Levy'] || 0,
      'Event Fee': cats['Event Fee'] || 0,
      'Total Sum': totalSum
    };
  });

  // Calculate payment method distribution dynamically from recorded transactions
  const paymentMethodCounts: Record<string, number> = {};
  transactions.forEach((tx) => {
    const method = tx.paymentMethod || 'Mobile Money';
    paymentMethodCounts[method] = (paymentMethodCounts[method] || 0) + Number(tx.amount || 0);
  });

  const paymentMethodData = Object.keys(paymentMethodCounts).map((method) => ({
    name: method,
    value: paymentMethodCounts[method]
  }));

  const COLORS = ['#0e3d26', '#196a43', '#529671', '#88c99e'];

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
            GROSS RECORDED TRANSACTIONS SUM
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
            {settings.currency}{grossRecordedSum.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#137333', marginTop: '4px', fontWeight: '600' }}>
            Total sum of all category transactions
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

      {/* Monthly Visual Chart: Total Sum of All Recorded Transactions (All Categories) */}
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
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>
              Monthly Visual: Total Sum of Recorded Transactions (All Categories)
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Aggregating Dues, Donations, Special Levies, and Event Fees per month dynamically from ledger
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyData}>
              <XAxis dataKey="month" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip formatter={(value: any, name: any) => [`${settings.currency}${Number(value).toLocaleString()}`, name]} />
              <Legend />
              <Bar dataKey="Dues" stackId="a" fill="#0e3d26" radius={[0, 0, 4, 4]} />
              <Bar dataKey="Donation" stackId="a" fill="#196a43" />
              <Bar dataKey="Special Levy" stackId="a" fill="#529671" />
              <Bar dataKey="Event Fee" stackId="a" fill="#88c99e" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="Total Sum" stroke="#000000" strokeWidth={3} dot={{ r: 5, fill: '#0e3d26' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Channels & Monthly Balance Summary */}
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
            Volume by Payment Channel
          </h3>

          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={paymentMethodData} cx="50%" cy="50%" outerRadius={75} label dataKey="value">
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => `${settings.currency}${Number(val).toLocaleString()}`} />
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
              <span style={{ color: 'var(--text-muted)' }}>Opening Reserve Balance</span>
              <span style={{ fontWeight: '700', color: 'var(--primary)' }}>$5,000.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Recorded Transactions Sum</span>
              <span style={{ fontWeight: '700', color: '#137333' }}>+${grossRecordedSum.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ color: 'var(--text-muted)' }}>Operational Expenses</span>
              <span style={{ fontWeight: '700', color: '#c5221f' }}>-$4,200.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary)' }}>
              <span>Current Reserve Balance</span>
              <span>${(5000 + grossRecordedSum - 4200).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
