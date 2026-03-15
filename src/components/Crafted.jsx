export default function Crafted() {
  return (
    <section id="crafted">
      <p className="section-tag">Crafted for the</p>
      <h2 className="section-title">Digital freight network</h2>
      <p className="section-body">
        ZeroEmpty is a digital freight marketplace that directly connects Business Associates and Transport Owners. Post loads, choose shipment, find trucks — or find loads for your fleet. We eliminate broker dependency while improving truck utilization and logistics efficiency.
      </p>
      <div className="img-section">
        <div className="img-card">
          <img src="https://images.unsplash.com/photo-1711942179703-fce59b6afac6?auto=format&fit=crop&w=800&q=80" alt="Modern semi truck" />
          <span className="caption">Zero empty miles. Every return trip filled.</span>
        </div>
        <div className="img-card">
          <img src="https://images.unsplash.com/photo-1754437954174-9662c997b661?auto=format&fit=crop&w=800&q=80" alt="Modern Hyundai XCIENT truck" />
          <span className="caption">Direct load matching. No brokers in between.</span>
        </div>
      </div>
      <a href="#download" className="cta" style={{ marginTop: '2rem' }}>Get started</a>
    </section>
  )
}
