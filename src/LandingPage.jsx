import Nav from './components/Nav'
import Hero from './components/Hero'
import Crafted from './components/Crafted'
import StorySection from './components/StorySection'
import ProductSection from './components/ProductSection'
import FeelTheOdds from './components/FeelTheOdds'
import TrustSection from './components/TrustSection'
import Footer from './components/Footer'

export default function LandingPage() {
  return (
    <>
      <Nav />
      <Hero />
      <Crafted />
      <StorySection />
      <ProductSection />
      <FeelTheOdds />
      <TrustSection />
      <Footer />
    </>
  )
}
