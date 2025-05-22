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

export default function Layout({ children }: { children: ReactNode }) {
  const theme = createTheme({
    palette: { ...bluePalette },
  })

  return (
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
          <Navbar />
          <main>
            <Container maxWidth="lg">{children}</Container>
          </main>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}
