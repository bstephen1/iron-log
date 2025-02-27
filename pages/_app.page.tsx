import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { SWRConfig } from 'swr'
import Layout from '../components/Layout'
import useSWRCacheProvider from '../components/useSWRCacheProvider'
import { swrFetcher } from '../lib/util'
import { useEffect } from 'react'
import { NuqsAdapter } from 'nuqs/adapters/next/pages'

const disableNumberSpin = () => {
  if (!(document.activeElement instanceof HTMLInputElement)) return

  if (document.activeElement.type === 'number') {
    document.activeElement.blur()
  }
}

function IronLog({ Component, pageProps }: AppProps) {
  const provider = useSWRCacheProvider()

  // disable any numeric fields from having the "scroll to increment value" feature
  useEffect(() => {
    document.addEventListener('wheel', disableNumberSpin)

    return () => document.removeEventListener('wheel', disableNumberSpin)
  }, [])

  return (
    <SessionProvider>
      <SWRConfig value={{ fetcher: swrFetcher, provider }}>
        <NuqsAdapter>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NuqsAdapter>
      </SWRConfig>
    </SessionProvider>
  )
}

export default IronLog
