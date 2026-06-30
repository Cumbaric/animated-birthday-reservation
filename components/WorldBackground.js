import styles from './WorldBackground.module.css'
import ShootingStar from './ShootingStar'

/*
  Deterministic LCG — isti rezultat na serveru i klijentu, bez hydration mismatch-a.
  Seed 99 → zvezde | Seed 77 → svici (ne preklapaju se ni sa StarField seed 42)
*/
function makeLCG(seed) {
  let s = seed >>> 0
  return () => {
    s = ((s * 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

/* ── Zvezde ── */
const rand = makeLCG(99)

const BASE_OPACITY = { bright: 1.0, medium: 0.85, small: 0.75, tiny: 0.5 }

const WORLD_STARS = Array.from({ length: 200 }, (_, i) => {
  const r = rand()
  const rawTop = rand()
  const topPct = Math.pow(rawTop, 1.7) * 62

  const category =
    r > 0.955 ? 'bright'
    : r > 0.82 ? 'medium'
    : r > 0.5  ? 'small'
    :             'tiny'

  const size =
    category === 'bright' ? 3.0 + rand() * 1.2
    : category === 'medium' ? 1.9 + rand() * 0.9
    : category === 'small'  ? 1.1 + rand() * 0.7
    :                          0.6 + rand() * 0.5

  const fade = topPct < 38
    ? 1
    : Math.max(0.04, 1 - ((topPct - 38) / 24))

  const starOpacity = (BASE_OPACITY[category] * fade).toFixed(3)

  return {
    id: i,
    top: topPct,
    left: rand() * 100,
    size,
    category,
    starOpacity,
    delay: rand() * 7,
    dur: 2 + rand() * 3.5,
  }
})

/* ── Svici ── */
const ffrand = makeLCG(77)

/*
  12 svičeva u donjem delu sveta (sekcije 3–4 = top: 50–87% visine sveta).
  Koordinate su deterministički generisane — isti raspored server + klient.
  Animacija se oslanja na CSS custom properties postavljene inline.
*/
const FIREFLIES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  top:     50 + ffrand() * 37,       // 50–87% sveta (sekcije 3–4)
  left:     4 + ffrand() * 88,       // 4–92% širine
  size:     2 + ffrand() * 2.5,      // 2–4.5px
  dur:    3.5 + ffrand() * 2.5,      // 3.5–6s period
  delay:       ffrand() * 7,         // 0–7s offset → desinhronizirani
  fx:    (ffrand() - 0.5) * 22,      // ±11px horizontalni drift
  fy:    (ffrand() - 0.5) * 14,      // ±7px vertikalni drift
  opacity: 0.45 + ffrand() * 0.45,   // 0.45–0.90 osnovna providnost
}))

export default function WorldBackground() {
  return (
    <>
      {/* Sloj 1: gradijentno nebo — najdublji, statičan */}
      <div className={styles.layerGradient} aria-hidden="true" />

      {/* Sloj 2: zvezde + zvezda padalica — GSAP animira Y (paralaks) */}
      <div
        className={styles.layerStars}
        aria-hidden="true"
        data-parallax="stars"
      >
        {WORLD_STARS.map((star) => (
          <div
            key={star.id}
            className={`${styles.star} ${styles[star.category] ?? ''}`}
            style={{
              top:    `${star.top.toFixed(2)}%`,
              left:   `${star.left.toFixed(2)}%`,
              width:  `${star.size.toFixed(2)}px`,
              height: `${star.size.toFixed(2)}px`,
              '--delay':        `${star.delay.toFixed(2)}s`,
              '--dur':          `${star.dur.toFixed(2)}s`,
              '--star-opacity': star.starOpacity,
            }}
          />
        ))}
        <ShootingStar />
      </div>

      {/* Sloj 3: lebdeći svici — topla zona, sekcije 3–4 */}
      <div className={styles.layerFireflies} aria-hidden="true">
        {FIREFLIES.map((f) => (
          <div
            key={f.id}
            className={styles.firefly}
            style={{
              top:    `${f.top.toFixed(2)}%`,
              left:   `${f.left.toFixed(2)}%`,
              width:  `${f.size.toFixed(2)}px`,
              height: `${f.size.toFixed(2)}px`,
              '--ff-dur':      `${f.dur.toFixed(2)}s`,
              '--ff-delay':    `${f.delay.toFixed(2)}s`,
              '--fx':          `${f.fx.toFixed(1)}px`,
              '--fy':          `${f.fy.toFixed(1)}px`,
              '--fly-opacity': f.opacity.toFixed(2),
            }}
          />
        ))}
      </div>

      {/* Sloj 4: sunce + silhueta savane — fiksiran uz dno sveta */}
      <div className={styles.layerSavanna} aria-hidden="true">
        {/*
          Sunce mora biti PRE SavannaScene u DOM-u da bi SVG teren
          (kasniji u DOM-u = viši z-order) prekrio donju poluvičku sunca.
          Centar sunca je na visini terena (~25% od dna layerSavanna).
        */}
        <div className={styles.sunWrap}>
          <div className={styles.sunGlow} />
          <div className={styles.sunDisc} />
        </div>
        <SavannaScene />
      </div>
    </>
  )
}

function SavannaScene() {
  return (
    <svg
      className={styles.savannaSvg}
      viewBox="0 0 1440 320"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Tlo — talasasta linija terena */}
      <path
        d="M0 258
           Q120 242 260 254
           Q400 266 540 248
           Q660 232 780 246
           Q900 260 1040 242
           Q1180 226 1300 244
           Q1380 252 1440 240
           L1440 320 L0 320 Z"
        fill="rgba(14, 6, 0, 0.92)"
      />

      {/* Akacijino drvo — ikonična flat-top silueta, pomerena levo (~30% širine) */}
      <g transform="translate(430, 73)">
        <rect x="17" y="118" width="11" height="62" fill="rgba(12, 5, 0, 0.95)" rx="4"/>
        <line x1="22" y1="138" x2="-18" y2="102" stroke="rgba(12, 5, 0, 0.95)" strokeWidth="7" strokeLinecap="round"/>
        <line x1="22" y1="143" x2="62"  y2="108" stroke="rgba(12, 5, 0, 0.95)" strokeWidth="7" strokeLinecap="round"/>
        <line x1="22" y1="133" x2="8"   y2="98"  stroke="rgba(12, 5, 0, 0.95)" strokeWidth="5" strokeLinecap="round"/>
        <ellipse cx="22"  cy="78" rx="72" ry="24" fill="rgba(12, 5, 0, 0.95)"/>
        <ellipse cx="-28" cy="98" rx="38" ry="17" fill="rgba(12, 5, 0, 0.95)"/>
        <ellipse cx="68"  cy="94" rx="42" ry="19" fill="rgba(12, 5, 0, 0.95)"/>
        <ellipse cx="5"   cy="68" rx="44" ry="15" fill="rgba(12, 5, 0, 0.95)"/>
      </g>

      {/* Malo drvo levo */}
      <g transform="translate(220, 148)">
        <rect x="7" y="62" width="7" height="44" fill="rgba(12, 5, 0, 0.85)" rx="3"/>
        <ellipse cx="10" cy="48" rx="38" ry="16" fill="rgba(12, 5, 0, 0.85)"/>
        <ellipse cx="-14" cy="60" rx="22" ry="11" fill="rgba(12, 5, 0, 0.85)"/>
        <ellipse cx="34"  cy="58" rx="26" ry="12" fill="rgba(12, 5, 0, 0.85)"/>
      </g>

      {/* Drvo desno u daljini */}
      <g transform="translate(1150, 178)">
        <rect x="5" y="42" width="5" height="38" fill="rgba(12, 5, 0, 0.75)" rx="2"/>
        <ellipse cx="7" cy="30" rx="28" ry="13" fill="rgba(12, 5, 0, 0.75)"/>
        <ellipse cx="-8" cy="40" rx="16" ry="9"  fill="rgba(12, 5, 0, 0.75)"/>
        <ellipse cx="24" cy="38" rx="18" ry="10" fill="rgba(12, 5, 0, 0.75)"/>
      </g>

      {/* Trave */}
      <g stroke="rgba(12, 5, 0, 0.88)" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M68 260  Q71 244 74 260"/>
        <path d="M78 258  Q81 242 84 258"/>
        <path d="M410 254 Q413 238 416 254"/>
        <path d="M424 252 Q427 236 430 252"/>
        <path d="M870 248 Q873 232 876 248"/>
        <path d="M882 250 Q885 234 888 250"/>
        <path d="M1320 246 Q1323 230 1326 246"/>
        <path d="M1332 248 Q1335 232 1338 248"/>
      </g>
    </svg>
  )
}
