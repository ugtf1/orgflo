import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/orgflogo.png';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, quickLogin } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('pass123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = login(username, password);
    if (res.success) {
      if (res.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/member');
      }
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  const handleQuickRole = (role: 'admin' | 'member') => {
    quickLogin(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/member');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-gradient)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        style={{
          maxWidth: '440px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '28px',
          padding: '40px 36px',
          boxShadow: '0 20px 50px rgba(14, 61, 38, 0.12)',
          border: '1px solid #e5eee7'
        }}
      >
        {/* Brand Header */}
        <div
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginBottom: '32px'
          }}
        >
          <img
            src={logoImage}
            alt="ORGFLO"
            style={{
              height: '85px',
              maxWidth: '280px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.6rem',
            fontWeight: '800',
            color: 'var(--primary)',
            textAlign: 'center',
            marginBottom: '8px'
          }}
        >
          Welcome Back
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', textAlign: 'center', marginBottom: '28px' }}>
          Log in to access your organization workspace
        </p>

        {/* Quick Demo Access Bar */}
        <div
          style={{
            background: '#f0f7f2',
            borderRadius: '16px',
            padding: '14px',
            marginBottom: '28px',
            border: '1px dashed var(--accent-lime)'
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ⚡ 1-Click Demo Login Credentials
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => handleQuickRole('admin')}
              style={{
                background: 'var(--primary)',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <ShieldCheck size={14} /> Admin
            </button>
            <button
              onClick={() => handleQuickRole('member')}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                color: 'var(--primary)',
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <UserCheck size={14} /> Member
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: '#fce8e6',
              color: '#c5221f',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
              Username or Email
            </label>
            <div style={{ position: 'relative' }}>
              <UserIcon
                size={18}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin or member"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '12px',
                  border: '1.5px solid #dbe6dd',
                  fontSize: '0.95rem',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#777', marginTop: '4px' }}>
              Demo: <b>admin</b> or <b>member</b>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="pass123"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '12px',
                  border: '1.5px solid #dbe6dd',
                  fontSize: '0.95rem',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#777', marginTop: '4px' }}>
              Demo Password: <b>pass123</b>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '8px', fontSize: '1rem' }}
          >
            Sign In to OrgFlow
          </button>
        </form>
      </div>
    </div>
  );
};
