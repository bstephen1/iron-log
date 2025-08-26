import { type ReactNode } from 'react'
import Layout from '../components/Layout'
// global styles must be imported from this file
import '../styles/globals.css'
import {
  fetchCategories,
  fetchExercises,
  fetchModifiers,
} from '../lib/backend/mongoService'
import QueryClientProvider from './QueryClientProvider'
import {
  defaultShouldDehydrateQuery,
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const serverData = {
    exercises: fetchExercises(),
    categories: fetchCategories(),
    modifiers: fetchModifiers(),
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
        shouldRedactErrors: (_err) => {
          // We should not catch Next.js server errors
          // as that's how Next.js detects dynamic pages
          // so we cannot redact them.
          // Next.js also automatically redacts errors for us
          // with better digests.
          return false
        },
      },
    },
  })

  queryClient.prefetchQuery({
    queryKey: ['exercises'],
    queryFn: fetchExercises,
  })

  queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  })

  return (
    // suppression is for mui css theme variables
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryClientProvider>
          {/* HydrationBoundary is a Client Component, so hydration will happen there. */}
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Layout serverData={serverData}>{children}</Layout>
          </HydrationBoundary>
        </QueryClientProvider>
      </body>
    </html>
  )
}
