import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  Users,
  Award,
  BookOpen,
  Stethoscope,
  Briefcase,
  ChevronRight,
  X,
  Menu,
  CheckCircle2,
  Mail,
  PhoneCall,
  Sparkles,
  ExternalLink,
  Lock,
  Compass
} from 'lucide-react';

import assocHero from '../assets/assoc_hero.jpg';
import assocDance from '../assets/assoc_dance.jpg';
import assocGala from '../assets/assoc_gala.jpg';
import assocService from '../assets/assoc_service.jpg';
import assocElders from '../assets/assoc_elders.jpg';
import logoImage from '../assets/orgflogo-cropped.png';

export const AssociationHomePage: React.FC = () => {
  const navigate = useNavigate();

  // Modals state
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>('Fundraiser 2025');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Donation form state
  const [donationAmount, setDonationAmount] = useState('100');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donationSuccess, setDonationSuccess] = useState(false);

  // RSVP form state
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpGuests, setRsvpGuests] = useState('1');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterJoined, setNewsletterJoined] = useState(false);

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDonationSuccess(true);
    setTimeout(() => {
      setDonationSuccess(false);
      setShowDonateModal(false);
      setDonorName('');
      setDonorEmail('');
    }, 2000);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSuccess(true);
    setTimeout(() => {
      setRsvpSuccess(false);
      setShowRsvpModal(false);
      setRsvpName('');
      setRsvpEmail('');
    }, 2000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterJoined(true);
      setTimeout(() => {
        setNewsletterJoined(false);
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <div className="assoc-page">
      {/* Top Banner */}
      <div className="assoc-top-banner">
        <span>Welcome to <strong>The Progressive Union Organization, Michigan Chapter</strong></span>
        <div className="banner-links">
          <button onClick={() => navigate('/admin')} className="banner-portal-link">
            <Lock size={13} /> Admin Portal
          </button>
          <button onClick={() => navigate('/login')} className="banner-portal-link">
            <Users size={13} /> Member Login
          </button>
          <button onClick={() => navigate('/')} className="banner-portal-link">
            <Compass size={13} /> OrgFlo Home
          </button>
        </div>
      </div>

      {/* Main Header / Nav */}
      <header className="assoc-header">
        <div className="assoc-header-inner">
          <div className="assoc-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="brand-crest">
              <span className="crest-icon">🌴</span>
            </div>
            <div className="brand-text">
              <span className="brand-title">PUOM</span>
              <span className="brand-subtitle">MICHIGAN CHAPTER</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="assoc-nav-desktop">
            <a href="#about">About Us</a>
            <a href="#events">Events</a>
            <a href="#efforts">Our Impact</a>
            <a href="#join">Community</a>
            <button onClick={() => navigate('/')} className="nav-orgflo-badge">
              Powered by OrgFlo <ExternalLink size={12} />
            </button>
          </nav>

          <div className="assoc-nav-actions">
            <button className="btn-donate" onClick={() => setShowDonateModal(true)}>
              <Heart size={16} fill="currentColor" /> Donate
            </button>
            <a href="#join" className="btn-join-nav">
              Join Community
            </a>
            <button
              className="assoc-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="assoc-mobile-menu">
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About Us</a>
            <a href="#events" onClick={() => setMobileMenuOpen(false)}>Events</a>
            <a href="#efforts" onClick={() => setMobileMenuOpen(false)}>Our Impact</a>
            <a href="#join" onClick={() => setMobileMenuOpen(false)}>Community</a>
            <div className="mobile-drawer-divider" />
            <button onClick={() => { setMobileMenuOpen(false); navigate('/admin'); }} className="mobile-drawer-btn">
              Admin Portal
            </button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="mobile-drawer-btn">
              Member Login
            </button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/'); }} className="mobile-drawer-btn accent">
              OrgFlo Landing Page
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="assoc-hero-section">
        <div className="assoc-hero-container">
          <div className="assoc-hero-card">
            <div className="assoc-hero-image-wrapper">
              <img src={assocHero} alt="The Progressive Union Organization Members" className="assoc-hero-img" />
              <div className="hero-overlay-gradient" />
              <div className="hero-text-overlay">
                <h1 className="hero-org-title">The Progressive Union Organization</h1>
                <h2 className="hero-org-location">Michigan Chapter</h2>
                <div className="hero-pill-badge">
                  <span>PROMOTING CULTURE, UNITY & LOVE</span>
                </div>
                <div className="hero-cta-buttons">
                  <a href="#about" className="assoc-btn-white">
                    Learn More <ChevronRight size={16} />
                  </a>
                  <button className="assoc-btn-gold" onClick={() => setShowDonateModal(true)}>
                    <Heart size={16} fill="currentColor" /> Support Our Union
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Continuous Moving Photo Gallery Marquee */}
      <section className="assoc-marquee-section">
        <div className="marquee-header">
          
          <span>VIBRANT CULTURAL HERITAGE & COMMUNITY LIFE</span>
          
        </div>
        <div className="marquee-track">
          <div className="marquee-content">
            <div className="marquee-item"><img src={assocHero} alt="Members in Matching Attire" /><span className="marquee-tag">Aso-Ebi Regalia</span></div>
            <div className="marquee-item"><img src={assocDance} alt="Cultural Dance Celebration" /><span className="marquee-tag">Cultural Dance</span></div>
            <div className="marquee-item"><img src={assocGala} alt="Annual Fundraiser Gala" /><span className="marquee-tag">Gala Night</span></div>
            <div className="marquee-item"><img src={assocService} alt="Community Volunteers" /><span className="marquee-tag">Volunteers</span></div>
            <div className="marquee-item"><img src={assocElders} alt="Executive Leadership Council" /><span className="marquee-tag">Council Elders</span></div>
            {/* Duplicate for seamless infinite loop */}
            <div className="marquee-item"><img src={assocHero} alt="Members in Matching Attire" /><span className="marquee-tag">Aso-Ebi Regalia</span></div>
            <div className="marquee-item"><img src={assocDance} alt="Cultural Dance Celebration" /><span className="marquee-tag">Cultural Dance</span></div>
            <div className="marquee-item"><img src={assocGala} alt="Annual Fundraiser Gala" /><span className="marquee-tag">Gala Night</span></div>
            <div className="marquee-item"><img src={assocService} alt="Community Volunteers" /><span className="marquee-tag">Volunteers</span></div>
            <div className="marquee-item"><img src={assocElders} alt="Executive Leadership Council" /><span className="marquee-tag">Council Elders</span></div>
          </div>
        </div>
      </section>

      {/* Banner Strip */}
      <div className="assoc-strip-banner">
        <img src={assocHero} alt="Matching outfits banner" className="strip-banner-img" />
      </div>

      {/* About Section */}
      <section id="about" className="assoc-about-section">
        <div className="assoc-section-container">
          <div className="about-grid">
            <div className="about-image-col">
              <div className="about-img-frame">
                <img src={assocElders} alt="PUOM Elders and Council Members" />
                <div className="about-badge-floating">
                  <Award size={22} />
                  <div>
                    <strong>25+ Years</strong>
                    <span>Preserving Culture</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-text-col">
              <span className="assoc-section-tag">WHO WE ARE</span>
              <h2>United in Culture, Empowered by Brotherhood</h2>
              <p>
                The <strong>The Progressive Union Organization (PUOM) Michigan Chapter</strong> is a socio-cultural organization
                dedicated to preserving rich heritage, traditions, and values while fostering
                unbreakable unity, economic advancement, and social welfare among members in Michigan and abroad.
              </p>
              <div className="about-stats-grid">
                <div className="stat-box">
                  <span className="stat-number">350+</span>
                  <span className="stat-label">Active Families</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">$150K+</span>
                  <span className="stat-label">Community Grants Raised</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Volunteer Led</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Events Grid */}
      <section id="events" className="assoc-events-section">
        <div className="assoc-section-container">
          <div className="section-header-center">
            <h2>Our Latest Events</h2>
            <p>We're active to serve our community</p>
          </div>

          <div className="latest-events-grid">
            {/* Card 1 */}
            <div className="event-card-green">
              <div className="event-card-img-wrap">
                <img src={assocService} alt="PUOM 5K Walk" />
              </div>
              <div className="event-card-body">
                <h3>PUOM 5K</h3>
                <p>
                  Join us for our annual PUOM 5K walk and health awareness day. Bringing together members for wellness, sports education, and community bond.
                </p>
                <button
                  className="assoc-btn-card"
                  onClick={() => {
                    setSelectedEvent('PUOM 5K');
                    setShowRsvpModal(true);
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="event-card-green">
              <div className="event-card-img-wrap">
                <img src={assocGala} alt="Fundraiser 2025 Gala" />
              </div>
              <div className="event-card-body">
                <h3>Fundraiser 2025</h3>
                <p>
                  A grand night of cultural excellence, keynote speeches, awards, and auctions supporting our healthcare and vocational outreach programs.
                </p>
                <button
                  className="assoc-btn-card"
                  onClick={() => {
                    setSelectedEvent('Fundraiser Gala 2025');
                    setShowRsvpModal(true);
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Spotlight (Flyer Card) */}
      <section className="assoc-spotlight-section">
        <div className="assoc-section-container">
          <div className="spotlight-header">
            <h2>Upcoming Events</h2>
          </div>

          <div className="spotlight-card-grid">
            <div className="spotlight-flyer-col">
              <div className="flyer-card">
                <div className="flyer-header">
                  <div className="flyer-logo">
                    <span>🌴 PUOM FUNDRAISER</span>
                  </div>
                  <h3>Transforming Lives in Michigan & Beyond</h3>
                </div>
                <div className="flyer-image-box">
                  <img src={assocDance} alt="Community Fundraiser Spotlight" />
                  <div className="flyer-badge">ANNUAL FLAGSHIP EVENT</div>
                </div>
                <div className="flyer-details-list">
                  <div className="flyer-detail-item">
                    <CheckCircle2 size={16} color="#0d5638" />
                    <span>Healthcare & Medical Outreach</span>
                  </div>
                  <div className="flyer-detail-item">
                    <CheckCircle2 size={16} color="#0d5638" />
                    <span>Youth Education & Scholarships</span>
                  </div>
                  <div className="flyer-detail-item">
                    <CheckCircle2 size={16} color="#0d5638" />
                    <span>Emergency Relief Fund</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="spotlight-info-col">
              <h3>The Progressive Union Organization Michigan Fundraiser</h3>
              <p>
                Join us for an inspiring evening dedicated to raising funds for our 2025 initiatives, including youth scholarships, healthcare outreach, community welfare, and empowerment programs in Michigan.
              </p>
              <p className="spotlight-subtext">
                Your presence and support will bring us closer to securing a better future for our people. Let us build together!
              </p>

              <div className="spotlight-meta-box">
                <div className="meta-row">
                  <Calendar size={18} className="meta-icon" />
                  <div>
                    <strong>Date & Time</strong>
                    <span>Saturday, October 18, 2025 &bull; 6:00 PM EST</span>
                  </div>
                </div>
                <div className="meta-row">
                  <MapPin size={18} className="meta-icon" />
                  <div>
                    <strong>Venue</strong>
                    <span>Southfield Civic Center Hall, 26000 Evergreen Rd, Southfield, MI 48076</span>
                  </div>
                </div>
              </div>

              <div className="spotlight-action-bar">
                <button
                  className="btn-spotlight-primary"
                  onClick={() => {
                    setSelectedEvent('The Progressive Union Organization Michigan Fundraiser');
                    setShowRsvpModal(true);
                  }}
                >
                  RSVP & Get Tickets <ArrowRight size={18} />
                </button>
                <button
                  className="btn-spotlight-secondary"
                  onClick={() => setShowDonateModal(true)}
                >
                  Make a Donation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Empowering Through Our Efforts (4 Pillars) */}
      <section id="efforts" className="assoc-efforts-section">
        <div className="assoc-section-container">
          <div className="efforts-header">
            <h2>Empowering Our People Through Our Efforts.</h2>
            <p>Where unity meets action for our community</p>
          </div>

          <div className="efforts-grid">
            <div className="effort-card">
              <div className="effort-img-wrap">
                <img src={assocService} alt="Healthcare outreach" />
                <div className="effort-overlay">
                  <Stethoscope size={24} className="effort-icon" />
                  <h4>Healthcare</h4>
                </div>
              </div>
            </div>

            <div className="effort-card">
              <div className="effort-img-wrap">
                <img src={assocElders} alt="Education initiatives" />
                <div className="effort-overlay">
                  <BookOpen size={24} className="effort-icon" />
                  <h4>Education</h4>
                </div>
              </div>
            </div>

            <div className="effort-card">
              <div className="effort-img-wrap">
                <img src={assocHero} alt="Community development" />
                <div className="effort-overlay">
                  <Users size={24} className="effort-icon" />
                  <h4>Community</h4>
                </div>
              </div>
            </div>

            <div className="effort-card">
              <div className="effort-img-wrap">
                <img src={assocGala} alt="Vocation and empowerment" />
                <div className="effort-overlay">
                  <Briefcase size={24} className="effort-icon" />
                  <h4>Vocation</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moving Circle Avatars / Join The Community */}
      <section id="join" className="assoc-join-section">
        {/* Animated Avatar Rings */}
        <div className="circle-avatars-bg">
          <div className="avatar-ring-item pos-1"><img src={assocHero} alt="Member avatar" /></div>
          <div className="avatar-ring-item pos-2"><img src={assocDance} alt="Member avatar" /></div>
          <div className="avatar-ring-item pos-3"><img src={assocGala} alt="Member avatar" /></div>
          <div className="avatar-ring-item pos-4"><img src={assocService} alt="Member avatar" /></div>
          <div className="avatar-ring-item pos-5"><img src={assocElders} alt="Member avatar" /></div>
          <div className="avatar-ring-item pos-6"><img src={assocHero} alt="Member avatar" /></div>
          <div className="avatar-ring-item pos-7"><img src={assocDance} alt="Member avatar" /></div>
          <div className="avatar-ring-item pos-8"><img src={assocGala} alt="Member avatar" /></div>
        </div>

        <div className="assoc-section-container relative-z">
          <div className="join-card-box">
            <h2>Join The Community</h2>
            <p>Get instant member updates, event access, and our portal platform.</p>

            <form onSubmit={handleNewsletterSubmit} className="join-form">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <button type="submit" className="btn-join-submit">
                {newsletterJoined ? '✓ Joined!' : 'REGISTER NOW'}
              </button>
            </form>

            <div className="join-subtext">
              Already a member?{' '}
              <button onClick={() => navigate('/login')} className="link-inline">
                Login to Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="assoc-footer">
        <div className="assoc-footer-container">
          <div className="footer-brand-col">
            <div className="assoc-brand light">
              <div className="brand-crest">
                <span className="crest-icon">🌴</span>
              </div>
              <div className="brand-text">
                <span className="brand-title">PUOM</span>
                <span className="brand-subtitle">MICHIGAN CHAPTER</span>
              </div>
            </div>
            <p className="footer-tagline">Promoting Culture, Unity & Love across Michigan and beyond.</p>
          </div>

          <div className="footer-nav-col">
            <h4>Quick Links</h4>
            <a href="#about">About Us</a>
            <a href="#events">Upcoming Events</a>
            <a href="#efforts">Our Impact</a>
            <a href="#join">Membership</a>
          </div>

          <div className="footer-contact-col">
            <h4>Contact Info</h4>
            <p><Mail size={16} /> info@ugtf.org</p>
            <p><PhoneCall size={16} /> +1 (248) 376-4669</p>
            <p><MapPin size={16} /> Michigan, United States</p>
          </div>

          <div className="footer-orgflo-col">
            <h4>Management System</h4>
            <p>Powered by <strong>OrgFlo</strong> for seamless dues, attendance, and member records.</p>
            <button onClick={() => navigate('/admin')} className="btn-footer-portal">
              Access Admin Workspace
            </button>
          </div>
        </div>

        <div className="assoc-footer-bottom">
          <p>&copy; {new Date().getFullYear()} The Progressive Union Organization, Michigan Chapter. All Rights Reserved.</p>
        </div>
      </footer>

      {/* DONATE MODAL */}
      {showDonateModal && (
        <div className="assoc-modal-backdrop" onClick={() => setShowDonateModal(false)}>
          <div className="assoc-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowDonateModal(false)}>
              <X size={20} />
            </button>
            <div className="modal-header-icon">
              <Heart size={28} color="#0d5638" fill="#d8f3dc" />
            </div>
            <h3>Support PUOM Michigan</h3>
            <p>Your contribution directly funds community outreach, youth scholarships, and cultural preservation.</p>

            {donationSuccess ? (
              <div className="modal-success-box">
                <CheckCircle2 size={48} color="#0d5638" />
                <h4>Thank You for Your Generosity!</h4>
                <p>Your support makes a real difference in our community.</p>
              </div>
            ) : (
              <form onSubmit={handleDonateSubmit} className="modal-form">
                <div className="amount-options-grid">
                  {['25', '50', '100', '250', '500'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`amt-btn ${donationAmount === amt ? 'active' : ''}`}
                      onClick={() => setDonationAmount(amt)}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <div className="form-group">
                  <label>Donor Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Ovie Oghenekaro"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="donor@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-modal-submit">
                  Proceed with ${donationAmount} Donation
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* RSVP MODAL */}
      {showRsvpModal && (
        <div className="assoc-modal-backdrop" onClick={() => setShowRsvpModal(false)}>
          <div className="assoc-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowRsvpModal(false)}>
              <X size={20} />
            </button>
            <div className="modal-header-icon">
              <Calendar size={28} color="#0d5638" />
            </div>
            <h3>RSVP for {selectedEvent}</h3>
            <p>Secure your attendance and tickets for this flagship community event.</p>

            {rsvpSuccess ? (
              <div className="modal-success-box">
                <CheckCircle2 size={48} color="#0d5638" />
                <h4>RSVP Confirmed!</h4>
                <p>We've reserved your ticket. Check your email for event details.</p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="modal-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Onome Akpobome"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="onome@example.com"
                    value={rsvpEmail}
                    onChange={(e) => setRsvpEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Number of Guests</label>
                  <select
                    value={rsvpGuests}
                    onChange={(e) => setRsvpGuests(e.target.value)}
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 Persons</option>
                    <option value="3">3 Persons</option>
                    <option value="4">4+ Persons (Family Package)</option>
                  </select>
                </div>

                <button type="submit" className="btn-modal-submit">
                  Confirm RSVP Registration
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
