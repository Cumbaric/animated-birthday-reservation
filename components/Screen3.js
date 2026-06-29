'use client'

export default function Screen3({
  dolazak,
  setDolazak,
  brojOdraslih,
  setBrojOdraslih,
  brojDece,
  setBrojDece,
  poruka,
  setPoruka,
  loading,
  error,
  onBack,
  onSubmit,
}) {
  const canSubmit = dolazak !== null && !loading

  return (
    <div className="screen">
      <div className="screen-content">
        <h1>Potvrda dolaska</h1>

        <div className="rsvp-choice">
          <button
            className={`btn-choice${dolazak === true ? ' btn-choice--active' : ''}`}
            onClick={() => setDolazak(true)}
          >
            Dolazim
          </button>
          <button
            className={`btn-choice${dolazak === false ? ' btn-choice--active' : ''}`}
            onClick={() => setDolazak(false)}
          >
            Ne dolazim
          </button>
        </div>

        {dolazak === true && (
          <div className="attendance-details">
            <div className="form-group">
              <label htmlFor="odrasli">Broj odraslih</label>
              <input
                id="odrasli"
                type="number"
                min="0"
                value={brojOdraslih}
                onChange={(e) => setBrojOdraslih(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="deca">Broj dece</label>
              <input
                id="deca"
                type="number"
                min="0"
                value={brojDece}
                onChange={(e) => setBrojDece(Number(e.target.value))}
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="poruka">Poruka (opciono)</label>
          <textarea
            id="poruka"
            value={poruka}
            onChange={(e) => setPoruka(e.target.value)}
            placeholder="Ostavi poruku ili želju za Luku..."
            rows={4}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="nav-buttons">
          <button className="btn btn-secondary" onClick={onBack} disabled={loading}>
            ← Nazad
          </button>
          <button
            className="btn btn-primary"
            onClick={onSubmit}
            disabled={!canSubmit}
          >
            {loading ? 'Šalje se...' : 'Pošalji potvrdu'}
          </button>
        </div>
      </div>
    </div>
  )
}
