import { useState, useEffect, useCallback, useRef } from 'react'
import { getTimelineState, TimelineState } from './timeline'

const TOTAL_SCROLL_HEIGHT = 12000

export function useTimeline() {
  const [state, setState] = useState<TimelineState>(() => getTimelineState(0))
  const rafRef = useRef<number>(0)

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const scrollY = window.scrollY || window.pageYOffset
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0
      setState(getTimelineState(progress))
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [handleScroll])

  return { state, scrollHeight: TOTAL_SCROLL_HEIGHT }
}
