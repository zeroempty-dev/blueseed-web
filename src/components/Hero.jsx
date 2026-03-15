import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="hero">
      <div className="content">
        <h1>ZERO EMPTY<br />RETURNS.</h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#crafted" className="cta">Learn more</a>
          <Link to="/demo" className="cta cta-outline">Take a look</Link>
        </div>
      </div>
    </section>
  )
}
