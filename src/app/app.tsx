import React from 'react'
import '@/app/globals.css'
import { QueryProvider } from '@/utils/query-provider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { LocalizationProvider } from '@/lib/intl'
import { ThemeProvider } from '@/lib/theme'
import { OrganizationProvider } from '@/context/organization-provider'

export default async function App({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <QueryProvider>
        <LocalizationProvider>
          <ThemeProvider>
            <div>{children}</div>
            <Toaster
              position="top-right"
              containerStyle={{ top: 60, right: 60 }}
            />
          </ThemeProvider>
        </LocalizationProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryProvider>
    </div>
  )
}
