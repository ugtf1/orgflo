import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Grid,
  CreditCard,
  BarChart3,
  CalendarCheck,
  Settings,
  LogOut,
  UserCheck,
  ShieldCheck,
  Menu,
  X,
  Bell,
  Search,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import logoImage from '../assets/orgflogodb.png';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { settings } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const adminNavItems = [
    { label: 'Overview', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Member Directory', path: '/admin/members', icon: <Users size={18} /> },
    { label: 'Pivot View', path: '/admin/pivot', icon: <Grid size={18} /> },
    { label: 'Transactions', path: '/admin/transactions', icon: <CreditCard size={18} /> },
    { label: 'Financial Analytics', path: '/admin/analytics', icon: <BarChart3 size={18} /> },
    { label: 'Meeting Tracker', path: '/admin/meetings', icon: <CalendarCheck size={18} /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> }
  ];

  const memberNavItems = [
    { label: 'Member Portal', path: '/member', icon: <LayoutDashboard size={18} /> },
    { label: 'My Dues & History', path: '/member/transactions', icon: <CreditCard size={18} /> },
    { label: 'My Account', path: '/member/account', icon: <UserCheck size={18} /> },
    { label: 'Settings', path: '/member/settings', icon: <Settings size={18} /> }
  ];

  const navItems = isAdmin ? adminNavItems : memberNavItems;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f8f5' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '260px',
          background: '#0e3d26',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 90,
          boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
        }}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              cursor: 'pointer',
              marginBottom: '32px',
              paddingLeft: '4px'
            }}
          >
            <img
              src={logoImage}
              alt="ORGFLO"
              style={{
                height: '75px',
                maxWidth: '210px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
            <div style={{ fontSize: '0.7rem', color: '#9bb8a6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {isAdmin ? 'Admin Console' : 'Member Portal'}
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '0.92rem',
                    color: isActive ? 'var(--primary)' : '#c3ded0',
                    background: isActive ? 'var(--accent-mint)' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Card & Public Landing Link */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px', borderTop: '1px solid #195235' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: '#d4ebd9',
              padding: '10px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}
          >
            <Home size={16} /> Landing Page
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#092d1c',
              padding: '12px',
              borderRadius: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt="user"
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.name || 'User'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#8fb89e', textTransform: 'capitalize' }}>
                  {user?.role}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              style={{
                background: 'none',
                color: '#ff9999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px'
              }}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header
          style={{
            height: '70px',
            background: '#ffffff',
            borderBottom: '1px solid #e2ece4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 80
          }}
        >
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
              {settings.orgName} Workspace
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{settings.orgTagline}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Role indicator pill */}
            <span
              style={{
                background: isAdmin ? '#e6f4ea' : '#e8f0fe',
                color: isAdmin ? '#137333' : '#1a73e8',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isAdmin ? <ShieldCheck size={14} /> : <UserCheck size={14} />}
              {isAdmin ? 'ADMIN ROLE' : 'MEMBER ROLE'}
            </span>

            <button
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#f4f8f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}
            >
              <Bell size={18} />
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main style={{ padding: '32px', flex: 1 }}>{children}</main>
      </div>
    </div>
  );
};
