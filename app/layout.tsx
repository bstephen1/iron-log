import { type ReactNode } from 'react'
import Layout from '../components/Layout'
// global styles must be imported from this file
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import {
  fetchCategories,
  fetchExercises,
  fetchModifiers,
} from '../lib/backend/mongoService'
import { QUERY_KEYS } from '../lib/frontend/constants'
import getQueryClient from '../lib/getQueryClient'
import '../styles/globals.css'
import QueryClientWrapper from './QueryClientWrapper'

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.exercises],
    queryFn: fetchExercises,
  })
  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.categories],
    queryFn: fetchCategories,
  })
  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.modifiers],
    queryFn: fetchModifiers,
  })

  return (
    // suppression is for mui css theme variables
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryClientWrapper>
          {/* HydrationBoundary is a Client Component, so hydration will happen there. */}
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Layout>{children}</Layout>
          </HydrationBoundary>
        </QueryClientWrapper>
      </body>
    </html>
  )
}
