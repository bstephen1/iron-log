import { ThemeProvider } from '@emotion/react'
import { Container, createTheme } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ReactNode, useState } from 'react'
import { bluePalette } from '../styles/themePalettes'
import Footer from './Footer'
import Navbar from './Navbar'

export default function Layout({ children }: { children: ReactNode }) {
  const [palette, setPalette] = useState(bluePalette)
  const theme = createTheme({
    palette: { ...palette },
  })

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Navbar />
        <main>
          <Container maxWidth="lg">{children}</Container>
        </main>
        <Footer />
      </LocalizationProvider>
    </ThemeProvider>
  )
}
