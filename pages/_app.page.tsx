import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { SWRConfig } from 'swr'
import Layout from '../components/Layout'
import useSWRCacheProvider from '../components/useSWRCacheProvider'
import { swrFetcher } from '../lib/util'
import { useEffect } from 'react'

const disableNumberSpin = () => {
  if (!(document.activeElement instanceof HTMLElement)) return

  // ts does not recognize the valid property "type"
  if ((document.activeElement as any)?.type === 'number') {
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
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SWRConfig>
    </SessionProvider>
  )
}

export default IronLog
