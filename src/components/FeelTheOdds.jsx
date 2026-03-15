import ScrollReveal, { ScrollRevealStagger } from './ScrollReveal'

export default function FeelTheOdds() {
  return (
    <section>
      <ScrollReveal>
        <h2 className="section-title">Feel the odds fall<br />in your favor</h2>
      </ScrollReveal>
      <ScrollReveal delay={150}>
        <p className="section-body">
          Supply and demand exist — Transport Owner in Salem, load from Business Associate in Erode — but they never connect. ZeroEmpty digitally matches them. Business Associates post and choose. Transport Owners discover. Predictive load matching. Instant discovery. No more missed opportunities.
        </p>
      </ScrollReveal>
      <ScrollRevealStagger className="img-section img-section--wide" as="div">
        <div className="img-card img-card--wide">
          <img 
            src="https://images.unsplash.com/photo-1769697756411-63c1bb2d7031?auto=format&fit=crop&w=800&q=80" 
            alt="Modern truck logistics"
            loading="lazy"
          />
          <span className="caption">Every mile. Every load. Matched.</span>
        </div>
      </ScrollRevealStagger>
    </section>
  )
}
