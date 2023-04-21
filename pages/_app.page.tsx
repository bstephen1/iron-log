import Layout from 'components/Layout'
import useRouterLoading from 'components/loading/useRouterLoading'
import useSWRCacheProvider from 'components/useSWRCacheProvider'
import { swrFetcher } from 'lib/util'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { createContext } from 'react'
import 'styles/globals.css'
import 'styles/nprogress.css'
import { SWRConfig } from 'swr'

export const RouterLoadingContext = createContext(false)

function IronLog({ Component, pageProps }: AppProps) {
  const isRouterLoading = useRouterLoading()
  const provider = useSWRCacheProvider()

  return (
    <SessionProvider>
      <SWRConfig value={{ fetcher: swrFetcher, provider }}>
        <Layout>
          <RouterLoadingContext.Provider value={isRouterLoading}>
            <Component {...pageProps} />
          </RouterLoadingContext.Provider>
        </Layout>
      </SWRConfig>
    </SessionProvider>
  )
}

export default IronLog
