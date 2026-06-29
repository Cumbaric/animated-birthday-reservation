import { Cinzel, Montserrat } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  display: 'swap',
})

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Lukina pozivnica',
  description: 'Pozivnica za Lukin 1. rođendan — 09.08.2026.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="sr" className={`${cinzel.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  )
}
