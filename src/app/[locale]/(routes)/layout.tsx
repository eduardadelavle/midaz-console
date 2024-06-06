import React from 'react'
import '@/app/globals.css'
import { Header } from '@/components/Header'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { nextAuthOptions } from '@/utils/OryCredentialsProvider'
import { Sidebar } from '@/components/Sidebar'
import { SidebarProvider } from '@/context/SidebarContext'

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const session = await getServerSession(nextAuthOptions)

  // if (!session?.user) {
  //   redirect(`/${locale}/signin`)
  // }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <Sidebar />
        <div className="flex w-full flex-col bg-shadcn-100">
          <Header />

          <div className="w-full px-16 pb-16 pt-6">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  )
}
