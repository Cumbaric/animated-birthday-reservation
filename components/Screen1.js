'use client'

import { useState } from 'react'

/*
  Screen1 — unos imena.
  GSAP je uklonjen: kamera u Invitation.js je sada primarni vizuelni efekat tranzicije.
  Validacija, isFilled logika i pulse animacija dugmeta — sve sačuvano.
  StarField je uklonjen — WorldBackground pokriva cel svet zvezdama.
*/
export default function Screen1({ ime, setIme, prezime, setPrezime, onNext }) {
  const [validationError, setValidationError] = useState('')

  const isFilled = ime.trim().length > 0 && prezime.trim().length > 0

  const handleNext = () => {
    if (!ime.trim() || !prezime.trim()) {
      setValidationError('Molimo unesite i ime i prezime.')
      return
    }
    setValidationError('')
    onNext()
  }

  return (
    <div className="screen screen--s1">
      <div className="screen-content">
        <p className="s1-badge">✦ POZIVNICA ✦</p>
        <h1 className="s1-title">Lukin 1. Rođendan</h1>
        <p className="s1-subtitle">Luka Popović · 09.08.2026.</p>

        <div className="form-group">
          <label htmlFor="ime">Ime</label>
          <input
            id="ime"
            type="text"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
            placeholder="Vaše ime"
          />
        </div>

        <div className="form-group">
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
          className={`btn btn-primary${isFilled ? ' pulse' : ''}`}
          onClick={handleNext}
          disabled={!isFilled}
        >
          Dalje →
        </button>
      </div>
    </div>
  )
}
