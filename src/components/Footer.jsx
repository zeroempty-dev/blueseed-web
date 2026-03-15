import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <section id="get-started" className="footer">
      <h2 className="footer-tagline">ZeroEmpty</h2>
      <p className="footer-sub">
        Like all good things in life, earning a ZeroEmpty membership is not easy; but the possibility of unlocking a greater future — whether you're a Business Associate posting loads or a Transport Owner filling trips — zero empty returns, transparent pricing, direct connections — makes the effort worthwhile.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/signup" className="cta">Get started</Link>
        <Link to="/demo" className="cta cta-outline">Take a look</Link>
      </div>
    </section>
  )
}
