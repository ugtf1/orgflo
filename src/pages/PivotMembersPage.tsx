import React, { useState } from 'react';
import { Grid, Download, Search, Filter } from 'lucide-react';
import { useData } from '../context/DataContext';

export const PivotMembersPage: React.FC = () => {
  const { members, settings } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'duesPaid' | 'duesOwed' | 'joinDate'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = members
    .filter(
      (m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.memberCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        return sortAsc
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      }
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

  const exportCSV = () => {
    const headers = ['Member Code', 'Name', 'Email', 'Phone', 'Department', 'Role', 'Status', 'Dues Paid', 'Dues Owed', 'Join Date'];
    const rows = filtered.map((m) => [
      m.memberCode,
      `"${m.name}"`,
      m.email,
      m.phone,
      `"${m.department}"`,
      `"${m.role}"`,
      m.status,
      m.duesPaid,
      m.duesOwed,
      m.joinDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `orgflow_members_pivot_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
            Pivot Table & Directory Matrix
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Spreadsheet view with dynamic sorting, filtering, and CSV report exports.
          </p>
        </div>

        <button onClick={exportCSV} className="btn-primary" style={{ padding: '10px 22px' }}>
          <Download size={18} /> Export Pivot CSV
        </button>
      </div>

      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid #e8f0ea'
        }}
      >
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Quick search matrix..."
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
      </div>

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
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f4f8f5', color: 'var(--primary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px', border: '1px solid #e1eae3' }}>Code</th>
                <th
                  onClick={() => {
                    setSortField('name');
                    setSortAsc(!sortAsc);
                  }}
                  style={{ padding: '12px 14px', border: '1px solid #e1eae3', cursor: 'pointer' }}
                >
                  Name {sortField === 'name' ? (sortAsc ? '▲' : '▼') : ''}
                </th>
                <th style={{ padding: '12px 14px', border: '1px solid #e1eae3' }}>Department</th>
                <th style={{ padding: '12px 14px', border: '1px solid #e1eae3' }}>Role</th>
                <th
                  onClick={() => {
                    setSortField('duesPaid');
                    setSortAsc(!sortAsc);
                  }}
                  style={{ padding: '12px 14px', border: '1px solid #e1eae3', cursor: 'pointer' }}
                >
                  Dues Paid {sortField === 'duesPaid' ? (sortAsc ? '▲' : '▼') : ''}
                </th>
                <th
                  onClick={() => {
                    setSortField('duesOwed');
                    setSortAsc(!sortAsc);
                  }}
                  style={{ padding: '12px 14px', border: '1px solid #e1eae3', cursor: 'pointer' }}
                >
                  Dues Owed {sortField === 'duesOwed' ? (sortAsc ? '▲' : '▼') : ''}
                </th>
                <th style={{ padding: '12px 14px', border: '1px solid #e1eae3' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td style={{ padding: '10px 14px', border: '1px solid #e1eae3', fontWeight: '700' }}>{m.memberCode}</td>
                  <td style={{ padding: '10px 14px', border: '1px solid #e1eae3', fontWeight: '600' }}>{m.name}</td>
                  <td style={{ padding: '10px 14px', border: '1px solid #e1eae3' }}>{m.department}</td>
                  <td style={{ padding: '10px 14px', border: '1px solid #e1eae3' }}>{m.role}</td>
                  <td style={{ padding: '10px 14px', border: '1px solid #e1eae3', fontWeight: '700', color: '#137333' }}>
                    {settings.currency}{m.duesPaid}
                  </td>
                  <td style={{ padding: '10px 14px', border: '1px solid #e1eae3', fontWeight: '700', color: m.duesOwed > 0 ? '#c5221f' : '#555' }}>
                    {settings.currency}{m.duesOwed}
                  </td>
                  <td style={{ padding: '10px 14px', border: '1px solid #e1eae3' }}>
                    <span className={`badge badge-${m.status.toLowerCase()}`}>{m.status}</span>
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
