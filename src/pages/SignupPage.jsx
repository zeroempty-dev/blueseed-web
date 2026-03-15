import { useState } from 'react'
import { Link } from 'react-router-dom'

const PERSONAS = [
  { id: 'business', label: 'Business Associate', desc: 'Post loads and choose shipment', icon: '🏢' },
  { id: 'transport', label: 'Transport Owner', desc: 'Find loads for your fleet', icon: '🚛' },
]

export default function SignupPage() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [contactType, setContactType] = useState('email') // 'email' | 'phone'
  const [persona, setPersona] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !contact.trim() || !persona) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="signup-page">
        <div className="signup-card signup-success">
          <div className="signup-success-icon">✓</div>
          <h2>Thank you!</h2>
          <p>We've received your details. Our team will get in touch soon.</p>
          <Link to="/" className="cta">Back to home</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="signup-page">
      <div className="signup-card">
        <Link to="/" className="signup-back">← Back</Link>
        <h1 className="signup-title">Get started</h1>
        <p className="signup-sub">Join ZeroEmpty — zero empty returns.</p>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="signup-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="signup-field">
            <label>Contact</label>
            <div className="signup-contact-toggle">
              <button
                type="button"
                className={contactType === 'email' ? 'active' : ''}
                onClick={() => setContactType('email')}
              >
                Email
              </button>
              <button
                type="button"
                className={contactType === 'phone' ? 'active' : ''}
                onClick={() => setContactType('phone')}
              >
                Phone
              </button>
            </div>
            <input
              type={contactType === 'email' ? 'email' : 'tel'}
              placeholder={contactType === 'email' ? 'you@example.com' : '+91 98765 43210'}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>

          <div className="signup-field">
            <label>I am a</label>
            <div className="signup-personas">
              {PERSONAS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`signup-persona ${persona === p.id ? 'active' : ''}`}
                  onClick={() => setPersona(p.id)}
                >
                  <span className="signup-persona-icon">{p.icon}</span>
                  <span className="signup-persona-label">{p.label}</span>
                  <span className="signup-persona-desc">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="cta signup-submit">
            Get started
          </button>
        </form>
      </div>
    </section>
  )
}
