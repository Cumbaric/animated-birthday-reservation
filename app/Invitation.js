'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import Screen1 from '../components/Screen1'
import Screen2 from '../components/Screen2'
import Screen3 from '../components/Screen3'
import Screen4 from '../components/Screen4'
import WorldBackground from '../components/WorldBackground'
import { supabase } from '../lib/supabaseClient'

export default function Invitation() {
  // ── State ── (identičan sa prethodnom verzijom)
  const [currentStep, setCurrentStep] = useState(1)
  const [ime, setIme]           = useState('')
  const [prezime, setPrezime]   = useState('')
  const [dolazak, setDolazak]   = useState(null)
  const [brojOdraslih, setBrojOdraslih] = useState(1)
  const [brojDece, setBrojDece]         = useState(0)
  const [poruka, setPoruka]     = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const worldRef    = useRef(null)
  const currentStepRef = useRef(currentStep)

  // Sinhronizacija ref-a sa state-om (za resize handler koji nema pristup closure state-u)
  currentStepRef.current = currentStep

  // ── Kamera: pomera svet po Y osi kad se menja korak ──
  useEffect(() => {
    const world = worldRef.current
    if (!world) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targetY = -(currentStep - 1) * window.innerHeight

    if (prefersReduced) {
      gsap.set(world, { y: targetY })
      return
    }

    const tween = gsap.to(world, {
      y: targetY,
      duration: 1.25,
      ease: 'power2.inOut',
      overwrite: true,
    })

    return () => tween.kill()
  }, [currentStep])

  // ── Resize: resinhronizuj kameru kad se promeni visina viewporta (keyboard, rotacija) ──
  useEffect(() => {
    const world = worldRef.current
    if (!world) return

    const handleResize = () => {
      gsap.set(world, { y: -(currentStepRef.current - 1) * window.innerHeight })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ── Supabase insert ── (identičan sa prethodnom verzijom, netaknut)
  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error: insertError } = await supabase.from('rsvp').insert([{
        ime:           ime.trim(),
        prezime:       prezime.trim(),
        dolazak:       dolazak === true,
        broj_odraslih: dolazak ? brojOdraslih : 0,
        broj_dece:     dolazak ? brojDece : 0,
        poruka:        poruka.trim() || null,
      }])
      if (insertError) throw insertError
      setCurrentStep(4)
    } catch (err) {
      console.error('Supabase greška:', err)
      setError('Došlo je do greške. Pokušajte ponovo.')
    } finally {
      setLoading(false)
    }
  }

  // ── Navigacija ── overwrite: true u gsap.to garantuje da brzi klikovi ne blokiraju
  const goTo = (step) => setCurrentStep(step)

  return (
    <div className="world-viewport">
      <div ref={worldRef} className="world">

        {/* Kontinuirani pejzaž — pozadina za sve sekcije */}
        <WorldBackground />

        {/*
          Sekcija 1 — noćno nebo, unos imena
          inert: kad sekcija nije aktivna, sadržaj je van fokusa i nije tab-dostupan
        */}
        <section
          className="world-section world-section--1"
          aria-label="Unos imena"
          inert={currentStep !== 1 ? true : undefined}
        >
          <Screen1
            ime={ime}
            setIme={setIme}
            prezime={prezime}
            setPrezime={setPrezime}
            onNext={() => goTo(2)}
          />
        </section>

        {/* Sekcija 2 — sumrak, detalji proslave */}
        <section
          className="world-section world-section--2"
          aria-label="Detalji proslave"
          inert={currentStep !== 2 ? true : undefined}
        >
          <Screen2
            ime={ime}
            onBack={() => goTo(1)}
            onNext={() => goTo(3)}
          />
        </section>

        {/* Sekcija 3 — zalazak, RSVP forma (Supabase insert) */}
        <section
          className="world-section world-section--3"
          aria-label="Potvrda dolaska"
          inert={currentStep !== 3 ? true : undefined}
        >
          <Screen3
            dolazak={dolazak}
            setDolazak={setDolazak}
            brojOdraslih={brojOdraslih}
            setBrojOdraslih={setBrojOdraslih}
            brojDece={brojDece}
            setBrojDece={setBrojDece}
            poruka={poruka}
            setPoruka={setPoruka}
            loading={loading}
            error={error}
            onBack={() => goTo(2)}
            onSubmit={handleSubmit}
          />
        </section>

        {/* Sekcija 4 — zlatna savana, zahvalnica */}
        <section
          className="world-section world-section--4"
          aria-label="Zahvalnica"
          inert={currentStep !== 4 ? true : undefined}
        >
          <Screen4 ime={ime} dolazak={dolazak} />
        </section>

      </div>
    </div>
  )
}
