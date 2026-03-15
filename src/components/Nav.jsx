import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="nav">
      <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>ZeroEmpty</Link>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/about" className="nav-link" style={{ textDecoration: 'none' }}>About</Link>
        <Link to="/contact" className="nav-link" style={{ textDecoration: 'none' }}>Contact us</Link>
        <Link to="/demo" className="nav-cta" style={{ textDecoration: 'none' }}>Take a look</Link>
        <Link to="/signup" className="nav-cta" style={{ textDecoration: 'none' }}>Get started</Link>
      </div>
    </nav>
  )
}
