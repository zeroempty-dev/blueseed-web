import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import ScrollReveal from '../components/ScrollReveal'

export default function AboutPage() {
  return (
    <>
      <Nav />
      <section className="page-section">
        <div className="page-card">
          <Link to="/" className="signup-back">← Back</Link>
          <ScrollReveal>
            <h1 className="signup-title">About ZeroEmpty</h1>
            <p className="signup-sub">Digital freight marketplace for zero empty returns.</p>
          </ScrollReveal>
          <div className="page-content">
            <ScrollReveal delay={80}>
              <h2 className="page-heading">Our mission</h2>
              <p className="page-body">
                ZeroEmpty connects Business Associates and Transport Owners directly — eliminating broker dependency and empty return trips. We're building a transparent, efficient freight network where every mile counts.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <h2 className="page-heading">What we do</h2>
              <p className="page-body">
                Business Associates post loads and choose shipment. Transport Owners find loads and fill return trips. Our platform matches supply and demand in real time — no WhatsApp groups, no phone tag, no price manipulation.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={160}>
              <h2 className="page-heading">Why ZeroEmpty</h2>
              <ul className="page-list">
                <li>Direct connections — no brokers in between</li>
                <li>Return load matching — reduce empty miles</li>
                <li>Transparent pricing — fair for everyone</li>
                <li>Verified network — trusted trucks and shippers</li>
                <li>Escrow payments — secure transactions</li>
              </ul>
            </ScrollReveal>
          </div>
          <Link to="/signup" className="cta" style={{ marginTop: '2rem', display: 'inline-block' }}>Get started</Link>
        </div>
      </section>
    </>
  )
}
