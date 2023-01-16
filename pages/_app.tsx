import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import '../styles/globals.css'

interface IronLogPageProps {
  session?: any // todo: not sure how to import Session from next-auth
}

function IronLog({ Component, pageProps }: AppProps<IronLogPageProps>) {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}

export default IronLog
