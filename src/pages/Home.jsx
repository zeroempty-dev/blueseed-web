import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useReveal } from '../components/useReveal';
import './Home.css';

export default function Home() {
  useReveal();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Holding Company · Est. 2026</p>
          <p className="hero-lede">Every audacious dream starts at the root.</p>
          <h1 className="hero-title">
            We plant the<br/>
            seeds of <em>execution.</em>
          </h1>
          <div className="hero-actions">
            <a href="#companies" className="hero-btn-primary">Our Companies</a>
            <a href="#contact" className="hero-btn-ghost">Get in Touch →</a>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-line"/>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {Array(3).fill(['Logistics','Infrastructure','Sustainability','Freight Tech','Patient Capital','Supply Chain']).flat().map((t, i) => (
            <span key={i} className="marquee-item">{t} <span className="marquee-dot">·</span></span>
          ))}
        </div>
      </div>

      {/* ── STATEMENT ── */}
      <section className="statement-section">
        <div className="statement-inner reveal">
          <p className="statement-label">Our Belief</p>
          <h2 className="statement-text">
            The companies that matter most are never the loudest ones
            <span className="statement-coda">in the room.</span>
          </h2>
        </div>
      </section>

      {/* ── COMPANIES ── */}
      <section id="companies" className="companies-section">
        <div className="companies-top reveal">
          <h2 className="section-heading-inline">
            What we've <span className="accent">built.</span>
          </h2>
        </div>
        <div className="company-card reveal rd1">
          <div className="cc-left">
            <div className="cc-badge">ZE</div>
            <div className="cc-meta">
              <span className="cc-num">01</span>
              <span className="cc-sector">Logistics & Freight</span>
            </div>
          </div>
          <div className="cc-body">
            <h3 className="cc-name">ZeroEmpty</h3>
            <p className="cc-desc">Intelligent freight matching and routing — connecting cargo owners with carriers through real-time visibility, smarter capacity utilization, and zero wasted runs.</p>
          </div>
          <div className="cc-right">
            <a href="https://zeroempty.in/" target="_blank" rel="noopener noreferrer" className="cc-link">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 11h14M11 4l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section id="mission" className="mission-section">
        <div className="mission-header reveal">
          <h2 className="section-heading-inline">
            Why we <span className="accent">exist.</span>
          </h2>
        </div>
        <div className="pillars-grid">
          {[
            { n: '01', title: 'Patient Capital', body: 'We think in decades. We give founders the runway to build with conviction — not under the pressure of quarterly returns.' },
            { n: '02', title: 'Infrastructure Focus', body: 'The best businesses become platforms others depend on. We back companies solving problems at infrastructure scale.' },
            { n: '03', title: 'Sustainable by Default', body: 'Commercial success and environmental responsibility are not trade-offs. Every company we build is held to both standards.' },
          ].map((p, i) => (
            <div key={p.n} className={`pillar-block reveal rd${i+1}`}>
              <div className="pillar-num">{p.n}</div>
              <h3 className="pillar-title">{p.title}</h3>
              <p className="pillar-body">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NUMBERS ── */}
      <section className="numbers-section">
        <div className="numbers-grid">
          {[
            { val: '01',   sub: 'Portfolio',    label: 'Companies' },
            { val: '2026', sub: 'Year',          label: 'Founded' },
            { val: '∞',    sub: 'Potential in',  label: 'Every Seed' },
          ].map((n, i) => (
            <div key={n.label} className={`num-card reveal rd${i}`}>
              <div className="num-value">{n.val}</div>
              <div className="num-sub">{n.sub}</div>
              <div className="num-label">{n.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="contact-section">
        <div className="contact-inner">
          <div>
            <p className="section-label reveal">Get in Touch</p>
            <h2 className="contact-heading reveal rd1">Built for<br/><em>the long game.</em></h2>
            <p className="contact-body reveal rd2">Founders with bold ideas, investors seeking patient returns, potential partners — we want to hear from you.</p>
            <div className="contact-ctas reveal rd2">
              <a href="mailto:hello@blueseed.co.in" className="hero-btn-primary">Reach Out</a>
              <a href="mailto:ventures@blueseed.co.in" className="hero-btn-ghost">Investor Relations →</a>
            </div>
          </div>
          <div className="contact-right reveal rd2">
            <img className="seed-img" src="/seed-sketch.png" alt="Hand-sketched seed sprouting into a sapling" />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="f-logo">Blue<span>Seed</span></div>
        <div className="f-copy">© 2026 Blue Seed Holdings. All rights reserved.</div>
        <div className="f-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </footer>
    </>
  );
}
