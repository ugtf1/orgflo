import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Trash2,
  Edit,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const MemberDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { members, addMember, deleteMember, settings } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New member form state
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<'MEMBER' | 'ADMIN'>('MEMBER');
  const [status, setStatus] = useState<'Active' | 'Pending'>('Active');
  const [duesOwed, setDuesOwed] = useState('50');

  // Format phone for display: (XXX) XXX-XXXX
  const formatPhoneInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(raw);
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.memberCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || m.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      alert('Please enter a valid 10-digit US phone number.');
      return;
    }
    const fullPhone = `+1${phoneNumber}`;
    const fullName = `${fName.trim()} ${lName.trim()}`;
    addMember({
      name: fullName,
      email,
      phone: fullPhone,
      department: '',
      role: role === 'ADMIN' ? 'Admin' : 'Member',
      status,
      joinDate: new Date().toISOString().split('T')[0],
      duesOwed: parseFloat(duesOwed) || 0,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150`,
      address: address.trim() || undefined,
    });

    // Reset form
    setFName('');
    setLName('');
    setEmail('');
    setPhoneNumber('');
    setAddress('');
    setRole('MEMBER');
    setStatus('Active');
    setDuesOwed('50');
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
            Member Directory
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Manage active members, roles, contact details, and dues status.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ padding: '10px 22px' }}
        >
          <Plus size={18} /> Add New Member
        </button>
      </div>

      {/* Filter and Search Bar */}
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
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Search by name, email, or code..."
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={16} color="var(--primary)" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none', fontSize: '0.88rem' }}
          >
            <option value="All">All Departments</option>
            <option value="Executive Board">Executive Board</option>
            <option value="Finance & Operations">Finance & Operations</option>
            <option value="Events & Programs">Events & Programs</option>
            <option value="Technology">Technology</option>
            <option value="Membership Care">Membership Care</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none', fontSize: '0.88rem' }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Alumni">Alumni</option>
          </select>
        </div>
      </div>

      {/* Members Grid/Table */}
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
              <tr style={{ borderBottom: '2px solid #eef4f0', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Member</th>
                <th style={{ padding: '12px 16px' }}>Code</th>
                <th style={{ padding: '12px 16px' }}>Department</th>
                <th style={{ padding: '12px 16px' }}>Role</th>
                <th style={{ padding: '12px 16px' }}>Dues Paid</th>
                <th style={{ padding: '12px 16px' }}>Dues Owed</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f0f5f1' }}>
                  <td data-label="Member" style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={m.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: '700', color: 'var(--primary)' }}>{m.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Code" style={{ padding: '14px 16px', fontWeight: '600', color: '#555' }}>{m.memberCode}</td>
                  <td data-label="Department" style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{m.department}</td>
                  <td data-label="Role" style={{ padding: '14px 16px', fontWeight: '600' }}>{m.role}</td>
                  <td data-label="Dues Paid" style={{ padding: '14px 16px', fontWeight: '700', color: '#137333' }}>
                    {settings.currency}{m.duesPaid}
                  </td>
                  <td data-label="Dues Owed" style={{ padding: '14px 16px', fontWeight: '700', color: m.duesOwed > 0 ? '#c5221f' : '#555' }}>
                    {settings.currency}{m.duesOwed}
                  </td>
                  <td data-label="Status" style={{ padding: '14px 16px' }}>
                    <span className={`badge badge-${m.status.toLowerCase()}`}>{m.status}</span>
                  </td>
                  <td data-label="Actions" style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => navigate(`/admin/members/${m.id}`)}
                        style={{ background: '#eef6f0', color: 'var(--primary)', padding: '6px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => deleteMember(m.id)}
                        style={{ background: '#fce8e6', color: '#c5221f', padding: '6px 10px', borderRadius: '8px', fontSize: '0.8rem' }}
                        title="Delete member"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
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
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
                Add New Member
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', fontSize: '1.2rem', color: '#888' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateMember} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* First Name & Last Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel"
                    value={fName}
                    onChange={(e) => setFName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vance"
                    value={lName}
                    onChange={(e) => setLName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="samuel@orgflow.com (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
                />
              </div>

              {/* Phone Number with US Country Code */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #dce8df',
                      background: '#f4f8f5',
                      fontSize: '0.92rem',
                      fontWeight: '700',
                      color: 'var(--primary)',
                      whiteSpace: 'nowrap',
                      userSelect: 'none',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>🇺🇸</span> +1
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="(555) 000-1111"
                    value={formatPhoneInput(phoneNumber)}
                    onChange={handlePhoneChange}
                    maxLength={16}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none', letterSpacing: '0.5px' }}
                  />
                </div>
                {phoneNumber.length > 0 && phoneNumber.length < 10 && (
                  <span style={{ fontSize: '0.75rem', color: '#c0392b', marginTop: '4px', display: 'block' }}>
                    Enter a 10-digit phone number
                  </span>
                )}
              </div>

              {/* Address */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                  Address
                </label>
                <input
                  type="text"
                  placeholder="123 Main St, Detroit, MI (optional)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
                />
              </div>

              {/* Role & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'MEMBER' | 'ADMIN')}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none', background: '#fff' }}
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Active' | 'Pending')}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none', background: '#fff' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Monthly Dues */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                  Monthly Dues ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={duesOwed}
                  onChange={(e) => setDuesOwed(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '12px' }}
              >
                Create Member Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
