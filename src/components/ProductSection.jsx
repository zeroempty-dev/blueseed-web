import ScrollReveal, { ScrollRevealStagger } from './ScrollReveal'
import { TruckIcon, ClipboardIcon, ShieldCheckIcon } from './FeatureIcons'

const features = [
  { Icon: TruckIcon, title: 'Return load matching', desc: 'Reduce empty trips. Truck goes Bangalore → Chennai, finds a load back to Bangalore.' },
  { Icon: ClipboardIcon, title: 'Load discovery', desc: 'Transport Owners find available loads quickly. No more WhatsApp groups or phone calls.' },
  { Icon: ShieldCheckIcon, title: 'Verified network', desc: 'Trusted network. Verified Business Associates, verified Transport Owners, verified loads.' },
]

export default function ProductSection() {
  return (
    <section>
      <ScrollReveal>
        <h2 className="section-title">All that you<br />deserve. And some more.</h2>
      </ScrollReveal>
      <ScrollReveal delay={150}>
        <p className="section-body">
          Business Associates: Post loads and choose shipment. Every load reaches Transport Owners directly. Transport Owners: Find loads for every trip. Return load matching eliminates empty miles. Transparency. Efficiency. Fair pricing.
        </p>
      </ScrollReveal>
      <ScrollRevealStagger className="product-showcase" as="div">
        <div className="product-img">
          <img src="https://images.unsplash.com/photo-1720811559337-c59b75acc4de?auto=format&fit=crop&w=800&q=80" alt="Modern semi truck freight" />
        </div>
        <div className="product-content">
          <h3 className="section-title">Post. Choose. Ship.</h3>
          <p className="section-body">
            Business Associates post loads and choose the right shipment. Transport Owners find loads and fill return trips. Escrow payments for security. Route optimization. Upgrade your freight operations. Bit by bit.
          </p>
        </div>
      </ScrollRevealStagger>
      <ScrollRevealStagger className="features" as="div">
        {features.map((f) => (
          <div key={f.title} className="feature">
            <div className="feature-icon">
              <f.Icon />
            </div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </ScrollRevealStagger>
    </section>
  )
}
