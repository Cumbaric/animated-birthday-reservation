export default function Screen4({ ime, dolazak }) {
  return (
    <div className="screen">
      <div className="screen-content screen-content--centered">
        {dolazak ? (
          <>
            <h1>Vidimo se, {ime}!</h1>
            <p>Jedva čekamo da vas vidimo na proslavi.</p>
          </>
        ) : (
          <>
            <h1>Hvala, {ime}!</h1>
            <p>Zahvaljujemo vam što ste nas obavestili. Biće nam žao bez vas.</p>
          </>
        )}
        <div className="animation-placeholder">ANIMACIJA OVDE</div>
      </div>
    </div>
  )
}
