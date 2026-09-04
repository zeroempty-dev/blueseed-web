import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/globals.css';

export default function PrivacyPage() {
  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 56px', height: 68,
        background: 'rgba(253,252,250,0.95)',
        borderBottom: '1px solid var(--cream-dk)',
        backdropFilter: 'blur(16px)',
      }}>
        <Link to="/" style={{
          fontFamily: 'var(--sans)', fontSize: '1rem', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#000', textDecoration: 'none',
        }}>
          Blue<span style={{ color: 'var(--blue)' }}>Seed</span>
        </Link>
      </nav>

      <div style={{ paddingTop: 120, paddingBottom: 80, paddingLeft: 80, paddingRight: 80, maxWidth: 800, margin: '0 auto' }}>
        <p style={{ fontSize: '0.68rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 24 }}>Legal</p>
        <h1 style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--ink)', marginBottom: 48 }}>Privacy Policy</h1>

        {[
          { title: 'Information We Collect', body: 'We collect information you provide directly to us, such as when you contact us via email or submit an inquiry through our website. This may include your name, email address, and the content of your message.' },
          { title: 'How We Use Your Information', body: 'We use the information we collect to respond to your inquiries, communicate with you about our companies and initiatives, and improve our services. We do not sell or share your personal information with third parties for marketing purposes.' },
          { title: 'Data Retention', body: 'We retain personal information for as long as necessary to fulfil the purposes for which it was collected, or as required by applicable law.' },
          { title: 'Security', body: 'We implement reasonable technical and organizational measures to protect your personal information against unauthorized access, loss, or misuse.' },
          { title: 'Contact Us', body: 'If you have questions about this Privacy Policy or our data practices, please contact us at Contact@blueseed.co.in.' },
        ].map(s => (
          <div key={s.title} style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--sans)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 12, letterSpacing: '-0.01em' }}>{s.title}</h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--ink-mid)' }}>{s.body}</p>
          </div>
        ))}

        <p style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', marginTop: 60 }}>Last updated: September 2026</p>
      </div>

      <footer style={{ background: 'var(--navy)', padding: '44px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Link to="/" style={{ fontFamily: 'var(--sans)', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(238,238,246,0.6)', textDecoration: 'none' }}>
          Blue<span style={{ color: 'var(--gold)' }}>Seed</span>
        </Link>
        <div style={{ fontSize: '0.7rem', color: 'rgba(238,238,246,0.2)' }}>© 2026 Blue Seed Holdings. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 28 }}>
          <Link to="/privacy" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(238,238,246,0.2)', textDecoration: 'none' }}>Privacy</Link>
          <Link to="/terms" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(238,238,246,0.2)', textDecoration: 'none' }}>Terms</Link>
        </div>
      </footer>
    </>
  );
}
