import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import ScrollReveal from '../components/ScrollReveal'
import { Target, Compass, AlertCircle, Zap, TrendingUp, MapPin } from 'lucide-react'

const journeyItems = [
  {
    label: '01',
    title: 'Our Vision',
    icon: Target,
    desc: 'A world where every truck returns full — zero empty miles, zero wasted capacity, zero broker dependency. We envision a freight network that connects supply and demand with transparency and efficiency.',
  },
  {
    label: '02',
    title: 'Our Mission',
    icon: Compass,
    desc: 'To democratize freight logistics by connecting Business Associates and Transport Owners directly. We eliminate broker dependency, reduce empty return trips, and build a transparent marketplace where every mile counts.',
  },
  {
    label: '03',
    title: 'What We Solve',
    icon: AlertCircle,
    desc: 'The road freight industry is fragmented and broker-dependent. Business Associates struggle to find trucks. Transport Owners lose money on empty returns. Brokers charge high commissions. Pricing is opaque. We solve all of this.',
  },
  {
    label: '04',
    title: 'Our Approach',
    icon: Zap,
    desc: 'Direct load matching, real-time discovery, and return trip optimization. Business Associates post loads and choose shipment. Transport Owners find loads for every trip. No WhatsApp groups. No phone tag. No price manipulation.',
  },
  {
    label: '05',
    title: 'Our Impact',
    icon: TrendingUp,
    desc: 'Verified network. Escrow payments. Transparent pricing. Return load matching that fills empty miles. We\'re building trust between shippers and transporters — one load at a time.',
  },
  {
    label: '06',
    title: 'The Road Ahead',
    icon: MapPin,
    desc: 'Expanding across India. Predictive load matching. Route optimization. API integrations for enterprise. We\'re building the future of freight — and we\'re just getting started.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Nav />
      <section className="page-section page-section--about">
        <div className="about-intro">
          <Link to="/" className="signup-back">← Back</Link>
          <ScrollReveal>
            <h1 className="signup-title">About ZeroEmpty</h1>
            <p className="signup-sub">Digital freight marketplace for zero empty returns.</p>
          </ScrollReveal>
        </div>

        <div className="journey-section">
          <ScrollReveal>
            <h2 className="journey-heading">Our Journey</h2>
            <p className="journey-sub">
              From a fragmented freight industry to a connected digital network — where every mile counts
            </p>
          </ScrollReveal>

          <div className="journey-roadmap">
            <div className="journey-timeline-line" aria-hidden="true" />
            {journeyItems.map((item, i) => {
              const Icon = item.icon
              const isLeft = i % 2 === 0
              return (
                <ScrollReveal key={item.label} delay={i * 100} className={`scroll-reveal--block journey-reveal--${isLeft ? 'left' : 'right'}`}>
                  <div className={`journey-node journey-node--${isLeft ? 'left' : 'right'}`}>
                    <div className="journey-node-card">
                      <div className="journey-node-icon">
                        <Icon size={24} strokeWidth={2} />
                      </div>
                      <span className="journey-node-label">{item.label}</span>
                      <h3 className="journey-node-title">{item.title}</h3>
                      <p className="journey-node-desc">{item.desc}</p>
                    </div>
                    <div className="journey-node-dot" />
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>

        <div className="about-cta">
          <Link to="/signup" className="cta">Get started</Link>
        </div>
      </section>
    </>
  )
}
