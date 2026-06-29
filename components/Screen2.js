'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import StarField from './StarField'
import { EVENT_DATA } from '../lib/data'

export default function Screen2({ ime, onBack, onNext }) {
  const containerRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReduced) return

      // gsap.set hides elements; ctx.revert() restores CSS state (StrictMode safe)
      // Buttons inside .s2-nav are never touched directly — CSS controls their opacity
      gsap.set('.s2-greeting', { opacity: 0, y: 18 })
      gsap.set('.s2-divider',  { opacity: 0, scaleX: 0 })
      gsap.set('.s2-vline',    { scaleY: 0 })
      gsap.set('.s2-animate',  { opacity: 0, y: 10 })
      gsap.set('.s2-nav',      { opacity: 0, y: 8 })

      gsap.timeline({ defaults: { ease: 'power2.out' } })
        .to('.s2-greeting', { opacity: 1, y: 0, duration: 0.65 })
        .to('.s2-divider',  { opacity: 1, scaleX: 1, duration: 0.5,
                              transformOrigin: 'left center' }, '-=0.2')
        .to('.s2-vline',    { scaleY: 1, duration: 0.75,
                              ease: 'power1.inOut',
                              transformOrigin: 'top center' }, '-=0.15')
        // Elements stagger in as the line "draws" down
        .to('.s2-animate',  { opacity: 1, y: 0, duration: 0.38, stagger: 0.1 }, '-=0.5')
        .to('.s2-nav',      { opacity: 1, y: 0, duration: 0.35 }, '-=0.05')
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleBack = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { onBack(); return }
    gsap.to(contentRef.current, {
      opacity: 0, y: 18, duration: 0.35, ease: 'power2.in', onComplete: onBack,
    })
  }

  const handleNext = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { onNext(); return }
    gsap.to(contentRef.current, {
      opacity: 0, y: -22, duration: 0.4, ease: 'power2.in', onComplete: onNext,
    })
  }

  return (
    <div ref={containerRef} className="screen">
      <div className="s1-stars"><StarField /></div>

      <div ref={contentRef} className="screen-content">

        {/* Personalized greeting */}
        <div className="s2-greeting">
          <p className="s2-name-line">
            <span className="s2-name">{ime}</span>,
          </p>
          <p className="s2-invite-text">pozvani ste na proslavu</p>
          <h1 className="s2-event-title">Lukin 1. Rođendan</h1>
          <p className="s2-date">{EVENT_DATA.datum}</p>
        </div>

        {/* Divider */}
        <div className="s2-divider" />

        {/* Timeline grouped by location */}
        <div className="s2-timeline-wrap">
          <div className="s2-vline" />

          {EVENT_DATA.lokacije.map((lok) => (
            <div key={lok.id} className="s2-group">
              <div className="s2-location-label s2-animate">
                {lok.naziv}
                {lok.adresa && <span className="s2-adresa">{lok.adresa}</span>}
              </div>

              {lok.dogadjaji.map((dog) => (
                <div key={dog.id} className="s2-event s2-animate">
                  <span className="s2-dot" />
                  <span className="s2-time">{dog.vreme}</span>
                  <span className="s2-event-name">{dog.naziv}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="nav-buttons s2-nav">
          <button className="btn btn-secondary" onClick={handleBack}>← Nazad</button>
          <button className="btn btn-primary"   onClick={handleNext}>Dalje →</button>
        </div>

      </div>
    </div>
  )
}
