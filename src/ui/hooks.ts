import { useEffect, useRef, useState } from 'react'

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

/** True when the system asks for reduced motion (spec FR-22). */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(REDUCED_QUERY).matches
      : false,
  )
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia(REDUCED_QUERY)
    const update = () => setReduced(query.matches)
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])
  return reduced
}

/** Counts a number up (or down) to `target` over `duration` ms; instant when motion is reduced (FR-21, FR-22). */
export function useCountUp(target: number, duration = 900): number {
  const reduced = usePrefersReducedMotion()
  const [shown, setShown] = useState(target)
  const from = useRef(target)

  useEffect(() => {
    if (reduced || from.current === target) {
      from.current = target
      const frame = requestAnimationFrame(() => setShown(target))
      return () => cancelAnimationFrame(frame)
    }
    const start = performance.now()
    const begin = from.current
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(Math.round(begin + (target - begin) * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
      else from.current = target
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      from.current = target
    }
  }, [target, duration, reduced])

  return shown
}

/** True for `ms` after `value` increases — used for brief glows when souls or XP are gained. */
export function useGlowOnIncrease(value: number, ms = 1000): boolean {
  const [glowing, setGlowing] = useState(false)
  const previous = useRef(value)
  useEffect(() => {
    const rose = value > previous.current
    previous.current = value
    if (!rose) return
    const on = setTimeout(() => setGlowing(true), 0)
    const off = setTimeout(() => setGlowing(false), ms)
    return () => {
      clearTimeout(on)
      clearTimeout(off)
    }
  }, [value, ms])
  return glowing
}
