import {
  AppBar,
  Box,
  Slide,
  Toolbar,
  Typography,
  useScrollTrigger,
} from '@mui/material'
import Link from 'next/link'
import { ReactElement } from 'react'
import LoginButton from './LoginButton'
import NavbarDrawer from './NavbarDrawer'

export default function Navbar() {
  function HideOnScroll({ children }: { children: ReactElement }) {
    const trigger = useScrollTrigger()

    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    )
  }

  return (
    <HideOnScroll>
      <AppBar position="sticky" sx={{ mb: 2 }}>
        <Toolbar>
          <NavbarDrawer />
          <Typography variant="h5">
            <Link href={'/'}>Iron Log</Link>
          </Typography>
          <Box flex={1} />
          <LoginButton />
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  )
}
