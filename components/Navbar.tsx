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
    // todo: This scroll trigger is way too sensitive and there's no way to fix that.
    // disableHysteresis means it will trigger at the Y value given in threshold.
    // So you can only make it hide at a certain Y value.
    // Without disableHysteresis it will also immediately unhide if the scroll Y value
    // increases AT ALL. Which means if you slightly tap the screen on mobile, or anything
    // gets added to the dom (thus increasing its length), the app bar pops back up.
    // This is just a stopgap solution currently. Ideally the trigger should have separate
    // "down" and "up" thresholds, which are both relative values rather than the absolute
    // Y position.
    const trigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 250,
    })

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
