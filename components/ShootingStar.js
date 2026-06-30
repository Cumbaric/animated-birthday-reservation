'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function ShootingStar() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.set(el, { opacity: 0 })

    let timerId
    let currentTl

    const fire = () => {
      const startX  = 10 + Math.random() * 60   // 10–70% od leve strane
      const startY  = 3  + Math.random() * 30   // 3–33% od vrha (4H sloj → sekcije 1–2)
      const angle   = 16 + Math.random() * 26   // 16–42° ispod horizontale
      const trailPx = 100 + Math.random() * 70  // dužina repa 100–170px
      const travel  = 180 + Math.random() * 100 // put 180–280px

      const rad = angle * Math.PI / 180
      const vx  = Math.cos(rad) * travel
      const vy  = Math.sin(rad) * travel

      gsap.set(el, {
        left:    `${startX}%`,
        top:     `${startY}%`,
        width:   trailPx,
        x: 0, y: 0,
        rotate:  angle,
        opacity: 0,
      })

      currentTl = gsap.timeline()
        .to(el, { opacity: 1, duration: 0.06, ease: 'none' })
        .to(el, { x: vx, y: vy, duration: 0.58, ease: 'power2.in' }, 0)
        .to(el, { opacity: 0, duration: 0.22, ease: 'power1.in' }, 0.36)

      timerId = setTimeout(fire, (8 + Math.random() * 7) * 1000)
    }

    timerId = setTimeout(fire, (2 + Math.random() * 5) * 1000)

    return () => {
      clearTimeout(timerId)
      if (currentTl) currentTl.kill()
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position:        'absolute',
        height:          '1.5px',
        background:      'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 28%, rgba(255,255,255,0.88) 82%, #FFF8E0 100%)',
        borderRadius:    '2px',
        transformOrigin: 'left center',
        boxShadow:       '0 0 3px 1px rgba(255, 255, 255, 0.35)',
        pointerEvents:   'none',
        willChange:      'transform, opacity',
      }}
    />
  )
}
