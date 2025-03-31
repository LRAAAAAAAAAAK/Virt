import React from 'react'
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '600', '700'] // Include weights used in page.tsx and potentially others
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500'] // Include weights used in page.tsx and potentially others
})

export const metadata: Metadata = {
  title: 'Virtara - Coming Soon',
  description: 'Open-Source SaaS for Exercise and Nutrition Analysis. Coming Soon!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-screen overflow-x-hidden bg-primary">{children}</body>
    </html>
  )
} 