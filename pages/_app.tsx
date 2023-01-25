import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import Layout from '../components/Layout'
import '../styles/globals.css'

interface IronLogPageProps {
  session?: any // todo: not sure how to import Session from next-auth
}

function IronLog({ Component, pageProps }: AppProps<IronLogPageProps>) {
  return (
    <SessionProvider session={pageProps.session}>
      <SWRConfig
        value={{ fetcher: (url: string) => fetch(url).then((r) => r.json()) }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SWRConfig>
    </SessionProvider>
  )
}

export default IronLog
