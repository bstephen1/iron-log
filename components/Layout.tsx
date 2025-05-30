import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { type ReactNode } from 'react'
import { bluePalette } from '../styles/themePalettes'
import Navbar from './Navbar'
import { SnackbarProvider } from 'notistack'
import AppSnackbar from './AppSnackbar'
import { Analytics } from '@vercel/analytics/next'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'
import { SWRConfig, type SWRConfiguration } from 'swr'
import useSWRCacheProvider from '../components/useSWRCacheProvider'
import { swrFetcher } from '../lib/util'
import { useEffect } from 'react'
import { NuqsAdapter } from 'nuqs/adapters/next/pages'
import { type Session } from 'next-auth'

const disableNumberSpin = () => {
  if (!(document.activeElement instanceof HTMLInputElement)) return

  if (document.activeElement.type === 'number') {
    document.activeElement.blur()
  }
}

interface Props {
  children: ReactNode
  swrConfig?: SWRConfiguration
  /** only needs to be provided if mocking the user */
  session?: Session
  /** navbar should be disabled for component testing */
  disableNavbar?: boolean
}
export default function Layout({
  children,
  swrConfig,
  session,
  disableNavbar,
}: Props) {
  const theme = createTheme({
    palette: { ...bluePalette },
  })
  const provider = useSWRCacheProvider()

  // disable any numeric fields from having the "scroll to increment value" feature
  useEffect(() => {
    document.addEventListener('wheel', disableNumberSpin)

    return () => document.removeEventListener('wheel', disableNumberSpin)
  }, [])

  return (
    <SessionProvider session={session}>
      <SWRConfig value={swrConfig ?? { fetcher: swrFetcher, provider }}>
        <NuqsAdapter>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <SnackbarProvider
                maxSnack={1}
                // notistack requires you to assign a snackbar to each variant.
                // This means we would have to assign the same snackbar to each key
                // (success, error, etc). Instead we override the default variant,
                // turn off all other variants, and add a "severity" prop.
                // See notistack.d.ts for type definitions
                Components={{
                  default: AppSnackbar,
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <Analytics />
                {!disableNavbar && <Navbar />}
                <main>
                  <Container maxWidth="lg">{children}</Container>
                </main>
              </SnackbarProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </SWRConfig>
    </SessionProvider>
  )
}
