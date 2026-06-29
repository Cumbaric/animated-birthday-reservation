'use client'

import { EVENT_DATA } from '../lib/data'

/*
  Screen2 — pozdrav i tajmlajna.
  GSAP je uklonjen: kamera u Invitation.js je sada primarni vizuelni efekat tranzicije.
  Sav sadržaj (pozdrav, s2-vline, tajmlajna po lokacijama) je sačuvan netaknut.
  StarField je uklonjen — WorldBackground pokriva cel svet zvezdama.
*/
export default function Screen2({ ime, onBack, onNext }) {
  return (
    <div className="screen">
      <div className="screen-content">

        {/* Personalizovani pozdrav */}
        <div className="s2-greeting">
          <p className="s2-name-line">
            <span className="s2-name">{ime}</span>,
          </p>
          <p className="s2-invite-text">pozvani ste na proslavu</p>
          <h1 className="s2-event-title">Lukin 1. Rođendan</h1>
          <p className="s2-date">{EVENT_DATA.datum}</p>
        </div>

        {/* Dekorativni separator */}
        <div className="s2-divider" />

        {/* Tajmlajna grupisana po lokacijama */}
        <div className="s2-timeline-wrap">
          <div className="s2-vline" />

          {EVENT_DATA.lokacije.map((lok) => (
            <div key={lok.id} className="s2-group">
              <div className="s2-location-label">
                {lok.naziv}
                {lok.adresa && <span className="s2-adresa">{lok.adresa}</span>}
              </div>

              {lok.dogadjaji.map((dog) => (
                <div key={dog.id} className="s2-event">
                  <span className="s2-dot" />
                  <span className="s2-time">{dog.vreme}</span>
                  <span className="s2-event-name">{dog.naziv}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Navigacija */}
        <div className="nav-buttons">
          <button className="btn btn-secondary" onClick={onBack}>← Nazad</button>
          <button className="btn btn-primary"   onClick={onNext}>Dalje →</button>
        </div>

      </div>
    </div>
  )
}
