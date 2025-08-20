import { type ReactNode } from 'react'
import Layout from '../components/Layout'
// global styles must be imported from this file
import '../styles/globals.css'
import {
  fetchCategories,
  fetchExercises,
  fetchModifiers,
} from '../lib/backend/mongoService'

export default function RootLayout({ children }: { children: ReactNode }) {
  const serverData = {
    exercises: fetchExercises(),
    categories: fetchCategories(),
    modifiers: fetchModifiers(),
  }

  return (
    // suppression is for mui css theme variables
    <html lang="en" suppressHydrationWarning>
      <body>
        <Layout serverData={serverData}>{children}</Layout>
      </body>
    </html>
  )
}
