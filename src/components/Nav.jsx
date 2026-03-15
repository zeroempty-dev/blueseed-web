import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="nav">
      <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>ZeroEmpty</Link>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Link to="/demo" className="nav-cta" style={{ textDecoration: 'none' }}>Take a look</Link>
        <a href="#download" className="nav-cta" style={{ textDecoration: 'none' }}>Get started</a>
      </div>
    </nav>
  )
}
