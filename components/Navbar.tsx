import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import Link from 'next/link'
import LoginButton from './LoginButton'
import NavbarDrawer from './NavbarDrawer'

export default function Navbar() {
  return (
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
  )
}
