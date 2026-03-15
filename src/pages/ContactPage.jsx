import { useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import ScrollReveal from '../components/ScrollReveal'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return
    setSubmitted(true)
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  if (submitted) {
    return (
      <>
        <Nav />
        <section className="page-section">
          <div className="page-card signup-success">
            <div className="signup-success-icon">✓</div>
            <h2>Message sent!</h2>
            <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
            <Link to="/" className="cta">Back to home</Link>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Nav />
      <section className="page-section">
        <div className="page-card">
          <Link to="/" className="signup-back">← Back</Link>
          <ScrollReveal>
            <h1 className="signup-title">Contact us</h1>
            <p className="signup-sub">Have questions? We'd love to hear from you.</p>
          </ScrollReveal>

          <div className="contact-info">
            <ScrollReveal delay={80}>
              <div className="contact-item">
                <span className="contact-label">Email</span>
                <a href="mailto:support@zeroempty.com" className="contact-link">support@zeroempty.com</a>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="contact-item">
                <span className="contact-label">Phone</span>
                <a href="tel:+9118002100008" className="contact-link">1800 210 0008</a>
              </div>
            </ScrollReveal>
          </div>

          <form onSubmit={handleSubmit} className="signup-form" style={{ marginTop: '2rem' }}>
            <div className="signup-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="signup-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="signup-field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className="signup-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Your message..."
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
                className="contact-textarea"
              />
            </div>
            <button type="submit" className="cta" style={{ width: '100%' }}>Send message</button>
          </form>
        </div>
      </section>
    </>
  )
}
