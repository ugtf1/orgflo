import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  CreditCard,
  Layers,
  LineChart,
  Mail,
  MapPin,
  MoreVertical,
  Package,
  PhoneCall,
  Send,
  ShieldCheck,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import boardImage from '../assets/board.png';
import phoneImage from '../assets/phone.png';
import logoImage from '../assets/orgflogo-cropped.png';
import dbLogoImage from '../assets/orgflogodb.png';

const features = [
  {
    icon: Users,
    title: 'Member Directory',
    desc: 'Manage member information, contact details, and roles in one searchable, easy-to-use directory.'
  },
  {
    icon: Package,
    title: 'Attendance Tracking',
    desc: 'Track meeting attendance, monitor participation, and generate attendance records effortlessly.'
  },
  {
    icon: CreditCard,
    title: 'Financial Records',
    desc: 'Monitor dues, payment balances, income and expense from one centralized dashboard.'
  },
  {
    icon: ShoppingCart,
    title: 'Shopping Cart Payment System',
    desc: 'Payment system for events and raffle tickets, donations and merchandise like shirts, hats and association attire.'
  },
  {
    icon: Layers,
    title: 'Meeting Recording',
    desc: 'Store member data, meeting records, and important documents securely in the cloud.'
  },
  {
    icon: BarChart3,
    title: 'Reports & Analytics',
    desc: 'View attendance, payments, and organization performance through simple visual reports.'
  }
];

const faqs = [
  {
    q: 'Can we import existing members?',
    a: "Yes. You can easily import your existing members using a CSV file or Google Sheets, so there's no need to add everyone manually."
  },
  {
    q: 'Does ORGFLO track dues?',
    a: 'Yes. ORGFLO tracks dues, partial payments, balances, receipts, and payment history from one dashboard.'
  },
  {
    q: 'Can multiple admins manage one organization?',
    a: 'Yes. Multiple admins can help manage members, meetings, attendance, and reports with shared access.'
  },
  {
    q: 'Is our data secure?',
    a: 'Organization data is protected with authenticated access, role-aware screens, and a centralized record system.'
  },
  {
    q: 'Can members access the platform?',
    a: 'Yes. Members can access their own portal to view payments, account details, and relevant organization updates.'
  }
];

const AvatarStack = () => (
  <div className="avatar-stack" aria-label="Organized members">
    {['#b97046', '#123a5a', '#d7a778', '#465e4c'].map((color, index) => (
      <span key={color} style={{ background: color, zIndex: 4 - index }}>
        {['A', 'J', 'M', 'S'][index]}
      </span>
    ))}
  </div>
);

const LogoMark = () => (
  <img className="brand-logo-image" src={logoImage} alt="ORGFLO Logo" />
);

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { quickLogin } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const handleDemoClick = (role: 'admin' | 'member') => {
    quickLogin(role);
    navigate(role === 'admin' ? '/admin' : '/member');
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <button className="landing-brand" onClick={() => navigate('/')} aria-label="Go to ORGFLOW home">
          <LogoMark />
        </button>
        <nav className="landing-nav" aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/association">Association Page 🌴</a>
          <button onClick={() => setShowDemoModal(true)}>Demo</button>
          <button className="nav-demo" onClick={() => setShowDemoModal(true)}>
            Try Demo Now
          </button>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <h1>The Digital Platform For Your Organization.</h1>
            <p>Everything your organization needs to manage meetings and members in one place.</p>
            <div className="hero-action-row">
              <div className="phone-stage">
                <img src={phoneImage} alt="OrgFlow mobile dashboard in hand" />
              </div>
              <button className="hero-demo-btn" onClick={() => setShowDemoModal(true)}>
                Get Demo Access
                <span>
                  <Send size={18} fill="currentColor" />
                </span>
              </button>
            </div>
          </div>

          <div className="hero-visual" aria-label="OrgFlow dashboard preview">
            <div className="hero-card stat-card">
              <div>
                <strong>12k</strong>
                <span>Happy Members</span>
              </div>
              <Users size={34} />
            </div>

            <div className="hero-card members-card">
              <div>
                <strong>Organized Members</strong>
                <span>11:00 - 01:30</span>
              </div>
              <AvatarStack />
            </div>

            <div className="hero-card highlight-card">
              <h3>PUOM Highlight</h3>
              <dl>
                <div>
                  <dt>Avg.Members Rating</dt>
                  <dd><TrendingUp size={14} /> 8.8/10</dd>
                </div>
                <div>
                  <dt>Avg. Pending Payments</dt>
                  <dd className="warn"><TrendingDown size={14} /> 748</dd>
                </div>
                <div>
                  <dt>Avg. Revenue Earnings</dt>
                  <dd><TrendingUp size={14} /> $4.500</dd>
                </div>
                <div>
                  <dt>Avg. Lead Distribution</dt>
                  <dd><TrendingUp size={14} /> %92</dd>
                </div>
              </dl>
            </div>

            <div className="hero-card hello-card">
              <h3>Hello there,</h3>
              <p>What would you like to explore today?</p>
              <div>
                <span className="admin-avatar">A</span>
                <strong>Admin</strong>
                <small>Michigan, USA</small>
                <time>July 27, 2023</time>
              </div>
            </div>
          </div>
        </section>

        <section className="pain-section" id="about">
          <div className="pain-visual">
            <div className="member-card">
              <div>
                <strong>Member Details</strong>
                <span>10M</span>
                <span>1H</span>
                <span className="pill">1D</span>
              </div>
              <p>Raffle <em>+ %2.78</em></p>
              <strong>$201.56</strong>
              <p>Dues <em className="negative">- %1.34</em></p>
              <strong>$64.33</strong>
            </div>
            <div className="revenue-card">
              <MoreVertical size={18} />
              <strong>$16,248.50</strong>
              <span>New Members This Month</span>
              <div><span style={{ width: '44%' }} /> <small>44%</small></div>
              <div><span style={{ width: '96%' }} /> <small>96%</small></div>
            </div>
          </div>

          <div className="pain-copy">
            <h2>Still Managing Everything with Paper and Spreadsheets?</h2>
            <p>Keeping track of members, attendance, payments, meeting minutes, and announcements shouldn't be stressful.</p>
            <strong>Pain Points</strong>
            <ul>
              <li><Check size={16} /> Attendance gets lost</li>
              <li><Check size={16} /> Payment records become confusing</li>
              <li><Check size={16} /> Member information is scattered</li>
            </ul>
            <button className="small-cta" onClick={() => setShowDemoModal(true)}>
              Get Free Trial <ArrowUpRight size={17} />
            </button>
          </div>
        </section>

        <section className="features-section" id="features">
          <h2>Powerful Features Designed for Modern Organizations</h2>
          <div className="features-grid">
            {features.map(({ icon: Icon, title, desc }) => (
              <article key={title} className="feature-card">
                <span><Icon size={23} /></span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="steps-section">
          <div className="steps-image">
            <img src={boardImage} alt="Organization team reviewing dashboard" />
          </div>
          <div className="steps-copy">
            <h2>Getting Started is Easy</h2>
            <p>Start managing your organization in just a few simple steps.</p>
            {[
              { title: 'Create organization page.', desc: 'Set up your organization in minutes with basic details.', icon: UserCheck },
              { title: 'Add Members', desc: 'Import or add member information into one central directory.', icon: Users },
              { title: 'Monitor Dues & Reports', desc: 'Track payments and access clear reports anytime.', icon: LineChart }
            ].map(({ title, desc, icon: Icon }, index) => (
              <div className="step-row" key={title}>
                <span className={index === 0 ? 'filled' : ''}><Icon size={22} /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="faq-section" id="faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <article className="faq-item" key={faq.q}>
                  <button onClick={() => setOpenFaq(isOpen ? null : index)}>
                    <span><ChevronDown size={24} /></span>
                    <strong>{faq.q}</strong>
                  </button>
                  {isOpen && <p>{faq.a}</p>}
                </article>
              );
            })}
          </div>
        </section>

        <section className="bottom-cta">
          <h2>Ready to Simplify Your Organization's <span>Workflow?</span></h2>
          <p>Simplify member management, meetings, attendance, and payments.</p>
          <button onClick={() => setShowDemoModal(true)}>Get Started</button>
        </section>
      </main>

      <footer className="landing-footer">
        <p>Simplifying organization management.</p>
        <address>
          <span><Mail size={18} /> info@ugtf.org</span>
          <span><PhoneCall size={18} /> +1 (248) 376-4669</span>
          <span><MapPin size={18} /> Michigan, United State</span>
        </address>
      </footer>

      {showDemoModal && (
        <div className="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-title">
          <div className="demo-panel">
            <button className="modal-close" onClick={() => setShowDemoModal(false)} aria-label="Close demo modal">
              <X size={20} />
            </button>
            <img
              src={dbLogoImage}
              alt="ORGFLO Logo"
              style={{
                height: '70px',
                width: 'auto',
                objectFit: 'contain',
                marginBottom: '18px'
              }}
            />
            <h2 id="demo-title">Select Demo Role</h2>
            <p>Experience ORGFLOW with pre-seeded demo data.</p>
            <button onClick={() => handleDemoClick('admin')}>Login as Admin <ArrowUpRight size={18} /></button>
            <button onClick={() => handleDemoClick('member')}>Login as Member <ArrowUpRight size={18} /></button>
          </div>
        </div>
      )}
    </div>
  );
};
