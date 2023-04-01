import Layout from 'components/Layout'
import { server } from 'msw-mocks/server'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import 'styles/globals.css'
import { SWRConfig } from 'swr'

// Enabling this will allow mock rest endpoints in dev mode.
// In the docs this is supposed to need a separate browser setup,
// but this is working with the node server. I guess it's something
// with how nextjs is structured.
if (process.env.MSW === 'enabled') {
  server.listen()
}

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
