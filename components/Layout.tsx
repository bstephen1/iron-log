import { ThemeProvider } from '@emotion/react'
import { Container, IconButton, createTheme } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ReactNode } from 'react'
import { bluePalette } from '../styles/themePalettes'
import Navbar from './Navbar'

import { SnackbarProvider, closeSnackbar } from 'notistack'
import SuccessSnackbar from './SuccessSnackbar'
import ClearIcon from '@mui/icons-material/Clear'
// import { SnackbarProvider } from './SnackbarContext'

export default function Layout({ children }: { children: ReactNode }) {
  const theme = createTheme({
    palette: { ...bluePalette },
  })

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackbarProvider
          maxSnack={1}
          Components={{ success: SuccessSnackbar }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          // override default offset that leaves actual snackbar off center
          style={{ left: 0 }}
          action={(id) => (
            <IconButton onClick={() => closeSnackbar(id)}>
              <ClearIcon />
            </IconButton>
          )}
        >
          <Navbar />
          <main>
            <Container maxWidth="lg">{children}</Container>
          </main>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}
