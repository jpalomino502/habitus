import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ["latin"], weight: '400' });

export const metadata: Metadata = {
  title: 'Habitus',
  description: 'Construye mejores hábitos',
  generator: 'Next.js',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.jpg',
    apple: '/icon-512.jpg',
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={geist.className}>
        {children}
      </body>
    </html>
  )
}
