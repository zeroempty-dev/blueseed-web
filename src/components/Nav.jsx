import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = (
    <>
      <Link to="/about" className="nav-link" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>About</Link>
      <Link to="/contact" className="nav-link" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Contact us</Link>
      <Link to="/demo" className="nav-cta" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Take a look</Link>
      <Link to="/signup" className="nav-cta" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Get started</Link>
    </>
  )

  return (
    <nav className="nav">
      <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>ZeroEmpty</Link>
      <div className="nav-desktop" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {navLinks}
      </div>
      <button
        type="button"
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className={menuOpen ? 'nav-toggle-bar nav-toggle-bar--open' : 'nav-toggle-bar'} />
        <span className={menuOpen ? 'nav-toggle-bar nav-toggle-bar--open' : 'nav-toggle-bar'} />
        <span className={menuOpen ? 'nav-toggle-bar nav-toggle-bar--open' : 'nav-toggle-bar'} />
      </button>
      <div className={`nav-mobile ${menuOpen ? 'nav-mobile--open' : ''}`}>
        {navLinks}
      </div>
    </nav>
  )
}
