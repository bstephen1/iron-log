'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'
import getQueryClient from '../lib/getQueryClient'

// This file is based on the tanstack SSR guide:
// https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#streaming-with-server-components

// The basic idea is to use queryClient.prefetchQuery in a server component to generate a promise,
// Then useSuspenseQuery in a client component to resolve the promise.
// useSuspenseQuery guarantees the data is resolved (not undefined).
// There's something going on with SSR and hydration so that the first paint will
// always include the data so their is never a loading state.

export default function QueryClientWrapper({
  children,
}: {
  children: ReactNode
}) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  )
}
