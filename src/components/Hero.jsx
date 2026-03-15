import { Link } from 'react-router-dom'
import { useHeroScrollProgress } from '../hooks/useHeroScrollProgress'

export default function Hero() {
  const progress = useHeroScrollProgress()

  const scale = 1 + progress * 0.6
  const contentY = progress * 180
  const contentOpacity = 1 - progress * 0.9

  return (
    <section className="hero">
      <div
        className="hero-bg"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: '40% 50%',
        }}
      />
      <div
        className="content"
        style={{
          transform: `translateY(${contentY}px)`,
          opacity: contentOpacity,
        }}
      >
        <h1>ZERO EMPTY<br />RETURNS.</h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#crafted" className="cta">Learn more</a>
          <Link to="/demo" className="cta cta-outline">Take a look</Link>
        </div>
      </div>
    </section>
  )
}
