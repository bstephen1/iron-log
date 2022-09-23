import { ThemeProvider } from '@emotion/react';
import { Container, createTheme } from '@mui/material';
import { ReactNode, useState } from 'react';
import { bluePalette, greenPalette } from '../styles/themePalettes';
import Footer from './Footer';
import Navbar from './Navbar';

export default function Layout({ children }: { children: ReactNode }) {
    const [palette, setPalette] = useState(bluePalette)
    const theme = createTheme({
        palette: { ...palette }
    })

    return (
        <ThemeProvider theme={theme}>
            <Navbar />
            <main>
                <Container>
                    {children}
                </Container>
            </main>
            <Footer />
        </ThemeProvider>
    )
}