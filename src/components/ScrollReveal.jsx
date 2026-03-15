import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * Wraps content and reveals it with a fade-in-up animation when scrolled into view.
 * Inspired by Royal Enfield-style scroll-driven reveals.
 */
export default function ScrollReveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <Tag
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'scroll-reveal--visible' : ''} ${className}`.trim()}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

/**
 * Container for staggered reveal of children. Add class "revealed" when in viewport.
 */
export function ScrollRevealStagger({ children, className = '', as: Tag = 'div' }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <Tag
      ref={ref}
      className={`scroll-reveal-stagger ${isVisible ? 'revealed' : ''} ${className}`.trim()}
    >
      {children}
    </Tag>
  )
}
