import type { Metadata } from 'next'
import GlobalModal from "@/components/GlobalModal";
import './globals.css'

export const metadata: Metadata = {
  title: 'Spensa Presence System',
  description: 'by Metrocraft Production',
  generator: 'metrocraftproduction.xyz',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}
        <GlobalModal />
      </body>
      
    </html>
  )
}
