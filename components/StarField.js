import styles from './StarField.module.css'

// Deterministic LCG — same output on server and client, no hydration mismatch
function makeLCG(seed) {
  let s = seed >>> 0
  return () => {
    s = ((s * 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

const rand = makeLCG(42)

const STARS = Array.from({ length: 110 }, (_, i) => {
  const r = rand()
  let category, size
  if (r > 0.955) {
    // ~5 bright — warm-white glow, largest
    category = 'bright'
    size = 3.2 + rand() * 1.1
  } else if (r > 0.82) {
    // ~15 medium — soft white glow
    category = 'medium'
    size = 2 + rand() * 0.9
  } else if (r > 0.46) {
    // ~40 small — no glow, visible dots
    category = 'small'
    size = 1.2 + rand() * 0.7
  } else {
    // ~50 tiny — barely visible, create density
    category = 'tiny'
    size = 0.7 + rand() * 0.5
  }
  return {
    id: i,
    top: rand() * 100,
    left: rand() * 100,
    size,
    delay: rand() * 7,
    dur: 2 + rand() * 3.5,
    category,
  }
})

export default function StarField() {
  return (
    <div className={styles.starfield}>
      {STARS.map((star) => (
        <div
          key={star.id}
          className={`${styles.star} ${styles[star.category]}`}
          style={{
            top: `${star.top.toFixed(2)}%`,
            left: `${star.left.toFixed(2)}%`,
            width: `${star.size.toFixed(2)}px`,
            height: `${star.size.toFixed(2)}px`,
            '--delay': `${star.delay.toFixed(2)}s`,
            '--dur': `${star.dur.toFixed(2)}s`,
          }}
        />
      ))}
    </div>
  )
}
