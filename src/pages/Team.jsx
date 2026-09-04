import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useReveal } from '../components/useReveal';
import './Team.css';

const Arrow = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 8h14M8 1l7 7-7 7"/>
  </svg>
);

const LEADERS = [
  {
    initials: 'AS',
    name: 'Amruth S.',
    title: 'Founder & CEO',
    bio: 'Amruth founded Blue Seed with the conviction that the physical world — how goods move, how supply chains work — is ripe for intelligent reinvention. He leads strategy, portfolio direction, and long-term vision across all Blue Seed companies.',
    stats: [
      { label: 'Focus Area', val: 'Logistics, Strategy' },
      { label: 'Based in', val: 'India' },
      { label: 'Portfolio Role', val: 'ZeroEmpty — Founder' },
    ],
  },
  {
    initials: '—',
    name: 'Co-Founder',
    title: 'Chief Operating Officer',
    bio: 'Oversees day-to-day operations across the portfolio, building the systems and teams that allow Blue Seed companies to execute at scale. Deep expertise in operational design and high-performance team building.',
    stats: [
      { label: 'Focus Area', val: 'Operations, Scaling' },
      { label: 'Based in', val: 'India' },
    ],
  },
];

const ADVISORS = [
  {
    initials: '—',
    name: 'Industry Advisor',
    title: 'Logistics & Supply Chain',
    bio: 'Decades of experience scaling freight and logistics operations across South Asia. Provides portfolio companies with unmatched industry access and mentorship.',
  },
  {
    initials: '—',
    name: 'Technology Advisor',
    title: 'Product & Engineering',
    bio: 'Former engineering leader at a top-tier technology company. Advises on product architecture, engineering culture, and building for infrastructure-grade reliability.',
  },
  {
    initials: '—',
    name: 'Investor Advisor',
    title: 'Capital & Governance',
    bio: 'Brings institutional capital experience and governance best practices to the board. Focused on long-term value creation and responsible growth for portfolio companies.',
  },
];

const JOIN_TILES = [
  { role: 'General Inquiry', type: 'Open Application', href: 'mailto:hello@blueseed.co.in' },
  { role: 'Partner / Advisor', type: 'Strategic Role', href: 'mailto:ventures@blueseed.co.in' },
  { role: 'Investor Relations', type: 'Capital & Partnerships', href: 'mailto:ventures@blueseed.co.in' },
];

export default function Team() {
  useReveal();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Navbar forceScrolled />

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <p className="ph-label">Our People</p>
          <h1 className="ph-title">The people<br/>behind <span className="accent">Blue Seed.</span></h1>
        </div>
        <p className="ph-sub">A small, focused group of operators, builders, and thinkers committed to growing transformative companies from the ground up.</p>
      </div>

      {/* LEADERSHIP */}
      <div className="team-section">
        <p className="ts-label">Founders &amp; Leadership</p>
        {LEADERS.map((l, i) => (
          <div key={l.name} className={`leader-row reveal rd${i}`}>
            <div className="lr-left">
              <div className="lr-avatar">{l.initials}</div>
              <div>
                <div className="lr-name">{l.name}</div>
                <div className="lr-title-tag">{l.title}</div>
              </div>
            </div>
            <div className="lr-right">
              <p className="lr-bio">{l.bio}</p>
              {l.stats.map(s => (
                <div key={s.label}>
                  <div className="lr-stat-label">{s.label}</div>
                  <div className="lr-stat-val">{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ADVISORS */}
      <div className="team-section">
        <p className="ts-label">Advisors &amp; Board</p>
        <div className="advisor-grid">
          {ADVISORS.map((a, i) => (
            <div key={a.name} className={`advisor-card reveal rd${i}`}>
              <div className="ac-avatar">{a.initials}</div>
              <div className="ac-name">{a.name}</div>
              <div className="ac-title">{a.title}</div>
              <p className="ac-bio">{a.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* JOIN */}
      <div className="join-section">
        <div>
          <h2 className="join-title">Want to help us<br/>build the <span className="accent">next one?</span></h2>
          <p className="join-body">We're always looking for operators, builders, and thinkers who want to work on hard problems at the intersection of technology and physical infrastructure.</p>
        </div>
        <div className="join-right">
          {JOIN_TILES.map(t => (
            <a key={t.role} href={t.href} className="join-tile">
              <div>
                <div className="jt-role">{t.role}</div>
                <div className="jt-type">{t.type}</div>
              </div>
              <Arrow />
            </a>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="team-footer">
        <div className="f-logo">Blue<span>Seed</span></div>
        <div className="f-copy">© 2026 Blue Seed Holdings. All rights reserved.</div>
        <div className="f-links">
          <Link to="/">Home</Link>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </footer>
    </>
  );
}
