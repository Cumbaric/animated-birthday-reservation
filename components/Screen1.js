'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import StarField from './StarField'

export default function Screen1({ ime, setIme, prezime, setPrezime, onNext, skipIntro }) {
  const [validationError, setValidationError] = useState('')
  const [isExiting, setIsExiting] = useState(false)
  const containerRef = useRef(null)
  const contentRef = useRef(null)

  const isFilled = ime.trim().length > 0 && prezime.trim().length > 0

  useEffect(() => {
    // Skip entrance animation when user navigates back from Screen 2
    if (skipIntro) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReduced) return

      // gsap.set() hides elements immediately inside the context.
      // ctx.revert() restores them to their CSS state, so StrictMode double-fire is safe.
      // Button opacity is intentionally NOT touched — CSS always controls it.
      gsap.set('.s1-stars',    { opacity: 0 })
      gsap.set('.s1-badge',    { opacity: 0, y: -10 })
      gsap.set('.s1-title',    { opacity: 0, y: 22, scale: 0.93 })
      gsap.set('.s1-subtitle', { opacity: 0, y: 10 })
      gsap.set('.s1-field',    { opacity: 0, y: 14 })
      gsap.set('.s1-btn',      { y: 10 })

      gsap.timeline({ defaults: { ease: 'power2.out' } })
        .to('.s1-stars',    { opacity: 1, duration: 1.8 })
        .to('.s1-badge',    { opacity: 1, y: 0, duration: 0.5 }, '-=0.9')
        .to('.s1-title',    { opacity: 1, y: 0, scale: 1, duration: 0.7 }, '-=0.2')
        .to('.s1-subtitle', { opacity: 1, y: 0, duration: 0.45 }, '-=0.3')
        .to('.s1-field',    { opacity: 1, y: 0, duration: 0.4, stagger: 0.13 }, '-=0.2')
        // Only animate y on the button — opacity stays CSS-controlled
        .to('.s1-btn',      { y: 0, duration: 0.35, clearProps: 'transform' }, '-=0.1')
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleNext = () => {
    if (!ime.trim() || !prezime.trim()) {
      setValidationError('Molimo unesite i ime i prezime.')
      return
    }
    setValidationError('')

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      onNext()
      return
    }

    setIsExiting(true)
    gsap.to(contentRef.current, {
      opacity: 0,
      y: -26,
      duration: 0.42,
      ease: 'power2.in',
      onComplete: onNext,
    })
  }

  return (
    <div ref={containerRef} className="screen screen--s1">
      <div className="s1-stars">
        <StarField />
      </div>

      <div ref={contentRef} className="screen-content">
        <p className="s1-badge">✦ POZIVNICA ✦</p>
        <h1 className="s1-title">Lukin 1. Rođendan</h1>
        <p className="s1-subtitle">Luka Popović · 09.08.2026.</p>

        <div className="s1-field form-group">
          <label htmlFor="ime">Ime</label>
          <input
            id="ime"
            type="text"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
            placeholder="Vaše ime"
          />
        </div>

        <div className="s1-field form-group">
          <label htmlFor="prezime">Prezime</label>
          <input
            id="prezime"
            type="text"
            value={prezime}
            onChange={(e) => setPrezime(e.target.value)}
            placeholder="Vaše prezime"
          />
        </div>

        {validationError && <p className="error">{validationError}</p>}

        <button
          className={`btn btn-primary s1-btn${isFilled && !isExiting ? ' pulse' : ''}`}
          onClick={handleNext}
          disabled={!isFilled || isExiting}
        >
          Dalje →
        </button>
      </div>
    </div>
  )
}
