'use client'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Analytics } from '@vercel/analytics/next'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { SnackbarProvider } from 'notistack'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { useEffect, type ReactNode } from 'react'
import { bluePalette } from '../styles/themePalettes'
import AppSnackbar from './AppSnackbar'
import Navbar from './Navbar'

const disableNumberSpin = () => {
  if (!(document.activeElement instanceof HTMLInputElement)) return

  if (document.activeElement.type === 'number') {
    document.activeElement.blur()
  }
}

interface Props {
  children: ReactNode
  /** only needs to be provided if mocking the user */
  session?: Session
  /** navbar should be disabled for component testing */
  disableNavbar?: boolean
}
export default function Layout({ children, session, disableNavbar }: Props) {
  // theme uses CSS variables to better support dark mode.
  // Any code changes should follow the CSS theme docs, not the normal theme docs.
  // See: https://mui.com/material-ui/customization/css-theme-variables/usage/
  // NOTE: when using the theme palette, theme.vars.palette is based on the current
  // mode palette. theme.palette is the default palette and is NOT updated when mode
  // changes. Both can be used as needed.
  const theme = createTheme({
    colorSchemes: { light: { palette: bluePalette }, dark: true },
    cssVariables: {
      colorSchemeSelector: 'class',
    },
  })
  // disable any numeric fields from having the "scroll to increment value" feature
  useEffect(() => {
    document.addEventListener('wheel', disableNumberSpin)

    return () => document.removeEventListener('wheel', disableNumberSpin)
  }, [])

  return (
    <SessionProvider session={session}>
      <NuqsAdapter>
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* for dark mode */}
          <InitColorSchemeScript attribute="class" />
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
    </SessionProvider>
  )
}
