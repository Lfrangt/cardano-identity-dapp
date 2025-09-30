import type { Metadata } from 'next'
import './globals.css'
import '../styles/liquid-glass.css'

export const metadata: Metadata = {
  title: 'CardanoID - Decentralized Identity',
  description: 'Build your decentralized identity on Cardano blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}