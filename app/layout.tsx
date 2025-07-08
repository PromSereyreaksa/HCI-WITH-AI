import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Buddy Chat - Kid Friendly Chatbot',
  description: 'Created by COPPSARY',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
