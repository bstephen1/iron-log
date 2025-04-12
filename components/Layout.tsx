import { ThemeProvider } from '@emotion/react'
import { Container, createTheme } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ReactNode } from 'react'
import { bluePalette } from '../styles/themePalettes'
import Navbar from './Navbar'

export default function Layout({ children }: { children: ReactNode }) {
  const theme = createTheme({
    palette: { ...bluePalette },
  })

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Navbar />
        <main>
          <Container maxWidth="lg">{children}</Container>
        </main>
      </LocalizationProvider>
    </ThemeProvider>
  )
}
