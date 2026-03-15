const features = [
  { icon: '🚚', title: 'Return load matching', desc: 'Reduce empty trips. Truck goes Bangalore → Chennai, finds a load back to Bangalore.' },
  { icon: '📋', title: 'Load discovery', desc: 'Transport Owners find available loads quickly. No more WhatsApp groups or phone calls.' },
  { icon: '✓', title: 'Verified network', desc: 'Trusted network. Verified Business Associates, verified Transport Owners, verified loads.' },
]

export default function ProductSection() {
  return (
    <section>
      <h2 className="section-title">All that you<br />deserve. And some more.</h2>
      <p className="section-body">
        Business Associates: Post loads and choose shipment. Every load reaches Transport Owners directly. Transport Owners: Find loads for every trip. Return load matching eliminates empty miles. Transparency. Efficiency. Fair pricing.
      </p>
      <div className="product-showcase">
        <div className="product-img">
          <img src="https://images.unsplash.com/photo-1687226675098-82bfca59e5ba?auto=format&fit=crop&w=800&q=80" alt="Tata truck ready to ship" />
        </div>
        <div className="product-content">
          <h3 className="section-title">Post. Choose. Ship.</h3>
          <p className="section-body">
            Business Associates post loads and choose the right shipment. Transport Owners find loads and fill return trips. Escrow payments for security. Route optimization. Upgrade your freight operations. Bit by bit.
          </p>
        </div>
      </div>
      <div className="features">
        {features.map((f) => (
          <div key={f.title} className="feature">
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
