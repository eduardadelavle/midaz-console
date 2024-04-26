import React from 'react'
import '@/globals.css'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { nextAuthOptions } from '@/utils/OryCredentialsProvider'

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const session = await getServerSession(nextAuthOptions)

  if (!session?.user) {
    redirect(`/${locale}/signin`)
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex w-full flex-col">
        <Header />

        <div className="w-full p-8">{children}</div>
      </div>
    </div>
  )
}
