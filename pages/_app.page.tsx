import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
// global styles must be imported from this file
import '../styles/globals.css'

export default function IronLog({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
