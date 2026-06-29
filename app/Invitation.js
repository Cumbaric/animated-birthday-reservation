'use client'

import { useState } from 'react'
import Screen1 from '../components/Screen1'
import Screen2 from '../components/Screen2'
import Screen3 from '../components/Screen3'
import Screen4 from '../components/Screen4'
import { supabase } from '../lib/supabaseClient'

export default function Invitation() {
  const [currentStep, setCurrentStep] = useState(1)
  const [skipIntro, setSkipIntro] = useState(false)
  const [ime, setIme] = useState('')
  const [prezime, setPrezime] = useState('')
  const [dolazak, setDolazak] = useState(null)
  const [brojOdraslih, setBrojOdraslih] = useState(1)
  const [brojDece, setBrojDece] = useState(0)
  const [poruka, setPoruka] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error: insertError } = await supabase.from('rsvp').insert([{
        ime: ime.trim(),
        prezime: prezime.trim(),
        dolazak: dolazak === true,
        broj_odraslih: dolazak ? brojOdraslih : 0,
        broj_dece: dolazak ? brojDece : 0,
        poruka: poruka.trim() || null,
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

  return (
    <div className="invitation-container">
      {currentStep === 1 && (
        <Screen1
          ime={ime}
          setIme={setIme}
          prezime={prezime}
          setPrezime={setPrezime}
          skipIntro={skipIntro}
          onNext={() => setCurrentStep(2)}
        />
      )}
      {currentStep === 2 && (
        <Screen2
          ime={ime}
          onBack={() => {
            setSkipIntro(true)
            setCurrentStep(1)
          }}
          onNext={() => setCurrentStep(3)}
        />
      )}
      {currentStep === 3 && (
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
          onBack={() => setCurrentStep(2)}
          onSubmit={handleSubmit}
        />
      )}
      {currentStep === 4 && (
        <Screen4 ime={ime} dolazak={dolazak} />
      )}
    </div>
  )
}
