import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ forceScrolled = false }) {
  const [scrolled, setScrolled] = useState(forceScrolled);
  useEffect(() => {
    if (forceScrolled) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [forceScrolled]);

  const s = scrolled || forceScrolled;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 56px', height: 68,
      background: s ? 'rgba(253,252,250,0.95)' : 'transparent',
      borderBottom: s ? '1px solid var(--cream-dk)' : '1px solid transparent',
      backdropFilter: s ? 'blur(16px)' : 'none',
      transition: 'all 0.4s ease',
    }}>
      <Link to="/" style={{
        fontFamily: 'var(--sans)', fontSize: '1rem', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: '#000', textDecoration: 'none',
        fontVariationSettings: "'opsz' 12",
        display: 'inline-flex', alignItems: 'center',
      }}>
        Blue<span style={{ color: 'var(--blue)' }}>Seed</span>
      </Link>

      <ul style={{ display: 'flex', gap: 40, listStyle: 'none', alignItems: 'center' }}>
        {[
          { label: 'Companies', href: '/#companies' },
          { label: 'Mission',   href: '/#mission' },
        ].map(item => (
          <li key={item.label}>
            <a href={item.href} style={{
              fontSize: '0.78rem', letterSpacing: '0.06em',
              color: 'var(--ink-soft)', textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--ink)'}
            onMouseLeave={e => e.target.style.color = 'var(--ink-soft)'}
            >{item.label}</a>
          </li>
        ))}
        <li>
          <Link to="/team" style={{
            fontSize: '0.78rem', letterSpacing: '0.06em',
            color: 'var(--ink-soft)', textDecoration: 'none', transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--ink)'}
          onMouseLeave={e => e.target.style.color = 'var(--ink-soft)'}
          >Team</Link>
        </li>
        <li>
          <a href="/#contact" style={{
            padding: '9px 22px', background: 'var(--navy)', color: 'var(--cream)',
            fontSize: '0.74rem', letterSpacing: '0.1em', textDecoration: 'none',
            transition: 'background 0.2s', display: 'inline-block',
          }}
          onMouseEnter={e => e.target.style.background = 'var(--navy-mid)'}
          onMouseLeave={e => e.target.style.background = 'var(--navy)'}
          >Investors</a>
        </li>
      </ul>
    </nav>
  );
}
