import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/globals.css';

export default function TermsPage() {
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
        <h1 style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--ink)', marginBottom: 48 }}>Terms of Use</h1>

        {[
          { title: 'Acceptance of Terms', body: 'By accessing or using the Blue Seed Holdings website (blueseed.co.in), you agree to be bound by these Terms of Use. If you do not agree, please do not use this site.' },
          { title: 'Intellectual Property', body: 'All content on this website — including text, graphics, logos, and design — is the property of Blue Seed Holdings and is protected by applicable intellectual property laws. You may not reproduce or distribute any content without our prior written consent.' },
          { title: 'Disclaimer', body: 'This website is provided for informational purposes only. Blue Seed Holdings makes no representations or warranties of any kind, express or implied, about the completeness or accuracy of the information on this site.' },
          { title: 'Limitation of Liability', body: 'To the fullest extent permitted by law, Blue Seed Holdings shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website.' },
          { title: 'Changes to Terms', body: 'We reserve the right to modify these Terms of Use at any time. Continued use of the website after changes constitutes acceptance of the revised terms.' },
          { title: 'Contact', body: 'For questions about these Terms, please contact us at hello@blueseed.co.in.' },
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
