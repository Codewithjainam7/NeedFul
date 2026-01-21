import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { AnimatedBackground } from '@/components/layout/AnimatedBackground'
import { ClientBootAnimation } from '@/components/layout/ClientBootAnimation'


export const metadata: Metadata = {
  title: 'NeedFul - Hyperlocal Super App',
  description: 'Find local services, restaurants, and more.',
  icons: {
    icon: '/favicon.ico',
  }
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`} suppressHydrationWarning>
        {/* Custom Cursor */}



        {/* Boot Animation */}
        <ClientBootAnimation />

        {/* Global Ambient Gradients */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10 pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 -z-10 pointer-events-none" />

        <AnimatedBackground />

        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
