const quickFeatures = [
  { title: 'Post loads', desc: 'Business Associates find trucks directly' },
  { title: 'Choose shipment', desc: 'Select the right truck for your load' },
  { title: 'Return load matching', desc: 'Fill empty return trips' },
  { title: 'Verified network', desc: 'Trusted trucks and Business Associates' },
]

export default function StorySection() {
  return (
    <section className="story-section compact">
      <h2 className="section-title">THE ROAD FREIGHT<br />PROBLEM.</h2>
      <p className="section-body">
        The road freight industry is highly fragmented and dependent on brokers. Business Associates depend on brokers to find trucks. Transport Owners depend on brokers to find loads. Brokers charge high commissions. Trucks often return empty. Pricing and load information is not transparent.
      </p>
      <p className="section-body">
        ZeroEmpty changes this. We build a digital freight network that directly connects Business Associates and Transport Owners. No price manipulation. No delayed payments. Just transparent, efficient matching.
      </p>
      <div className="quick-features">
        {quickFeatures.map((item) => (
          <div key={item.title}>
            <strong>{item.title}</strong>
            <br />
            <span>{item.desc}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
