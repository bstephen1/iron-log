import { type ReactNode } from 'react'
import Layout from '../components/Layout'
// global styles must be imported from this file
import '../styles/globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppression is for mui css theme variables
    <html lang="en" suppressHydrationWarning>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
