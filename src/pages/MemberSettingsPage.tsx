import React, { useState } from 'react';
import { Settings, Lock, Bell, CheckCircle2 } from 'lucide-react';

export const MemberSettingsPage: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '650px' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
          Member Security & Notifications
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Configure notification alerts and security options.
        </p>
      </div>

      {saved && (
        <div
          style={{
            background: '#e6f4ea',
            color: '#137333',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={18} /> Preferences updated!
        </div>
      )}

      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid #e8f0ea'
        }}
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            Notification Preferences
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: '700', color: 'var(--primary)' }}>Email Dues Receipts & Alerts</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Receive immediate digital receipts upon payment</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: '700', color: 'var(--primary)' }}>SMS Meeting Reminders</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Receive text updates for general meetings & RSVPs</div>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
            />
          </div>

          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)', borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: '10px' }}>
            Password & Security
          </h3>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
              Current Password
            </label>
            <input
              type="password"
              defaultValue="pass123"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: 'fit-content', padding: '12px 28px', marginTop: '10px' }}
          >
            Update Security Settings
          </button>
        </form>
      </div>
    </div>
  );
};
