import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import Layout from '../components/Layout'
import {
  fetchCategories,
  fetchExercises,
  fetchModifiers,
} from '../lib/backend/mongoService'
import { QUERY_KEYS } from '../lib/frontend/constants'
import getQueryClient from '../lib/getQueryClient'
// global styles must be imported from this file
import '../styles/globals.css'
import type { Metadata } from 'next'
import QueryClientWrapper from './QueryClientWrapper'

// child metadata is merged into the parent object,
// so any fields defined here but not in a child will
// retain the values from here
export const metadata: Metadata = {
  title: 'Iron Log',
  description: 'An app for recording your training.',
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const queryClient = getQueryClient()

  // There are multiple ways data can be prefetched, depending on desired behavior.
  // await prefetch + useQuery: waits for all data to be fetched before rendering on client
  // prefetch + useSuspenseQuery: sends a promise to client, must be wrapped in suspense.

  // in server components, there is a new queryClient for each file,
  // so if queryClient is used the component's children must be wrapped in
  // a HydrationBoundary

  // Could potentially optimize these prefetches by wrapping them closer to where
  // they are actually used. Would need to see if existing client components can
  // be refactored to server.
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

  // client vs server components:
  // if a component is defined in a module without the "use client" directive,
  // it will be run on the server. If that component is imported into a client
  // module, it will also be included in the bundle and evaluated on the client.

  // So the children here can still be server components even though the layout wrappers
  // are client components as long as those children are NOT imported in any client
  // components. Server components can be passed through client wrappers.

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
