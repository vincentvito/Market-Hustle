import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Market Hustle',
  description: 'Buy low. Sell high. Don\'t go broke.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Desktop: centered 9:16 frame, Mobile: full screen */}
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="
            w-full h-screen
            md:w-[400px] md:h-[711px] md:max-h-[90vh]
            md:rounded-lg md:overflow-hidden md:shadow-2xl
            md:border md:border-mh-border
            relative overflow-hidden
          ">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
