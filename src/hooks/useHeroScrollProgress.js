import { useEffect, useState } from 'react'

/**
 * Returns scroll progress (0–1) through the hero section.
 * 0 = at top, 1 = scrolled past hero.
 * Drives zoom-in to the O and content scroll-down effect.
 */
export function useHeroScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = null
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const heroHeight = window.innerHeight
        const maxScroll = heroHeight * 1.5
        const p = Math.min(1, Math.max(0, scrollY / maxScroll))
        setProgress(p)
        raf = null
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return progress
}
