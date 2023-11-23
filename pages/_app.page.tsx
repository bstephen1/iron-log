import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import 'styles/globals.css'
import { SWRConfig } from 'swr'
import Layout from '../components/Layout'
import useSWRCacheProvider from '../components/useSWRCacheProvider'
import { swrFetcher } from '../lib/util'

function IronLog({ Component, pageProps }: AppProps) {
  const provider = useSWRCacheProvider()

  return (
    <SessionProvider>
      <SWRConfig value={{ fetcher: swrFetcher, provider }}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SWRConfig>
    </SessionProvider>
  )
}

export default IronLog
