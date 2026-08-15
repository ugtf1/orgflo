import React, { useState } from 'react';
import { Settings, RefreshCw, Save, CheckCircle2, ShieldCheck, Mail, Phone, DollarSign } from 'lucide-react';
import { useData } from '../context/DataContext';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDemoData } = useData();

  const [orgName, setOrgName] = useState(settings.orgName);
  const [orgTagline, setOrgTagline] = useState(settings.orgTagline);
  const [monthlyDues, setMonthlyDues] = useState(settings.monthlyDues.toString());
  const [annualDues, setAnnualDues] = useState(settings.annualDues.toString());
  const [currency, setCurrency] = useState(settings.currency);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      orgName,
      orgTagline,
      monthlyDues: parseFloat(monthlyDues) || 50,
      annualDues: parseFloat(annualDues) || 500,
      currency,
      contactEmail,
      contactPhone
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
          Organization Settings & Demo Controls
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Customize organization parameters, dues rates, and reset demo data.
        </p>
      </div>

      {savedMsg && (
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
          <CheckCircle2 size={18} /> Settings successfully updated!
        </div>
      )}

      {/* Settings Form Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid #e8f0ea'
        }}
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            General Profile
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                Organization Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                Organization Tagline
              </label>
              <input
                type="text"
                value={orgTagline}
                onChange={(e) => setOrgTagline(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
              />
            </div>
          </div>

          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)', borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: '10px' }}>
            Dues & Currency Rates
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                Currency Symbol
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                Monthly Dues ({currency})
              </label>
              <input
                type="number"
                value={monthlyDues}
                onChange={(e) => setMonthlyDues(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                Annual Dues ({currency})
              </label>
              <input
                type="number"
                value={annualDues}
                onChange={(e) => setAnnualDues(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
              />
            </div>
          </div>

          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)', borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: '10px' }}>
            Contact & Support Info
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                Support Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                Support Phone
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #dce8df', outline: 'none' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: 'fit-content', padding: '12px 28px', marginTop: '10px' }}
          >
            <Save size={16} /> Save Configuration
          </button>
        </form>
      </div>

      {/* Reset Demo Data Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          border: '1.5px solid #fcdad7'
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', color: '#c5221f', marginBottom: '8px' }}>
          Reset Demo Workspace
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
          Restores all members, transactions, meetings, and dues records back to the original clean demo dataset.
        </p>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all demo data?')) {
              resetDemoData();
              alert('Demo dataset reset successfully!');
            }
          }}
          style={{
            background: '#fce8e6',
            color: '#c5221f',
            padding: '10px 20px',
            borderRadius: '9999px',
            fontWeight: '700',
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RefreshCw size={16} /> Reset All Demo Data
        </button>
      </div>
    </div>
  );
};
