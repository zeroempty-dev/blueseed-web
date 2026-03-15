import { useEffect, useState } from 'react'

/**
 * Returns scroll progress (0–1) through a section as it scrolls through the viewport.
 * 0 = section just entering from bottom, 1 = section scrolled past top.
 * When section is in view, ensures minimum progress so content is visible.
 */
export function useSectionScrollProgress(sectionRef) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const section = sectionRef?.current
    if (!section) return

    const updateProgress = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const inView = rect.top < vh && rect.bottom > 0
      const start = vh
      const end = -rect.height
      const range = start - end
      let p = 0
      if (range > 0) {
        p = 1 - (rect.top - end) / range
        p = Math.min(1, Math.max(0, p))
      }
      if (inView && p < 0.3) p = 0.3
      setProgress(p)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [sectionRef])

  return progress
}
