import Layout from 'components/Layout'
import LoadingIndicator from 'components/LoadingIndicator'
import { server } from 'msw-mocks/server'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { Router, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import 'styles/globals.css'
import { SWRConfig } from 'swr'

// Enabling this will allow mock rest endpoints in dev mode.
// In the docs this is supposed to need a separate browser setup,
// but this is working with the node server. I guess it's something
// with how nextjs is structured.
if (process.env.MSW === 'enabled') {
  server.listen()
}

// next doesn't export these for some reason
type Url = Parameters<Router['push']>[0]
type TransitionOptions = NonNullable<Parameters<Router['push']>[2]>

interface IronLogPageProps {
  session?: any // todo: not sure how to import Session from next-auth
}
function IronLog({ Component, pageProps }: AppProps<IronLogPageProps>) {
  // routeChangeStart is not called on first page load, only when navigating within the app.
  // router.isReady may be useful for first load but that seemed unreliable.
  const [isRouterLoading, setIsRouterLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleLoadingStart = (_: Url, { shallow }: TransitionOptions) => {
      // shallow routing cancels the route, triggering routeChangeError (error has "cancelled" set as true).
      // But by checking here first we can prevent loading from quickly toggling on and flashing the screen
      !shallow && setIsRouterLoading(true)
    }
    const handleLoadingStop = () => {
      setIsRouterLoading(false)
    }

    router.events.on('routeChangeStart', handleLoadingStart)
    router.events.on('routeChangeComplete', handleLoadingStop)
    // on error the args are (err, url) instead of (url, options)
    router.events.on('routeChangeError', handleLoadingStop)

    return () => {
      router.events.off('routeChangeStart', handleLoadingStart)
      router.events.off('routeChangeComplete', handleLoadingStop)
      router.events.on('routeChangeError', handleLoadingStop)
    }
    // using router from app.tsx means it is not unmounted between page navigations
  }, [router])

  return (
    <SessionProvider session={pageProps.session}>
      <SWRConfig
        value={{ fetcher: (url: string) => fetch(url).then((r) => r.json()) }}
      >
        <Layout>
          {isRouterLoading ? (
            <LoadingIndicator />
          ) : (
            <Component {...pageProps} />
          )}
        </Layout>
      </SWRConfig>
    </SessionProvider>
  )
}

export default IronLog
