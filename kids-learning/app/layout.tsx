import type { Metadata } from 'next'
import { Baloo_2, Comic_Neue } from 'next/font/google'
import './globals.css'

const baloo = Baloo_2({ subsets: ['latin'], weight: ['800'] })
const comic = Comic_Neue({ subsets: ['latin'], weight: ['700'] })

export const metadata: Metadata = {
  title: 'Kids Learning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={comic.className}>{children}</body>
    </html>
  )
}