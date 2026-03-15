import ScrollReveal, { ScrollRevealStagger } from './ScrollReveal'

const trustItems = [
  { value: '15M+', label: 'Loads matched' },
  { value: '4.9/5', label: 'App Store' },
  { value: '4.9/5', label: 'Play Store' },
]

export default function TrustSection() {
  return (
    <section>
      <ScrollReveal>
        <h2 className="section-title">Your data isn't our business.<br />Keeping it safe is.</h2>
      </ScrollReveal>
      <ScrollReveal delay={150}>
        <p className="section-body">
          All your load data, truck details, and transactions are encrypted and secured. Escrow payments protect both Business Associates and Transport Owners. Verified trucks. Verified loads. Verified network. There's no room for fraud because we didn't leave any. Complete security. No asterisks.
        </p>
      </ScrollReveal>
      <ScrollRevealStagger className="trust-bar" as="div">
        {trustItems.map((item) => (
          <div key={item.label} className="trust-item">
            <div className="trust-value">{item.value}</div>
            <div className="trust-label">{item.label}</div>
          </div>
        ))}
      </ScrollRevealStagger>
      <ScrollReveal delay={500}>
        <p className="section-body" style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
          Trusted by Business Associates and Transport Owners across India — the proof writes itself
        </p>
      </ScrollReveal>
    </section>
  )
}
