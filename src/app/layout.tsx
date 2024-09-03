'use client'
import React from 'react'
import { Inter } from 'next/font/google'
import NextAuthSessionProvider from '@/providers/next-auth-session-provider'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning className={inter.className}>
        <NextAuthSessionProvider>
          {/*<ThemeProvider*/}
          {/*  attribute="class"*/}
          {/*  defaultTheme="system"*/}
          {/*  enableSystem*/}
          {/*  disableTransitionOnChange*/}
          {/*>*/}
          {children}
          {/*</ThemeProvider>*/}
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
