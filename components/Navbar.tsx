import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Slide from '@mui/material/Slide'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import DarkModeButton from './DarkModeButton'
import LogoutButton from './LogoutButton'
import NavbarDrawer from './NavbarDrawer'

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lowPoint, setLowPoint] = useState(100)
  const [highPoint, setHighPoint] = useState(0)

  // mui has a "useScrollTrigger" hook that it recommends using for this situation,
  // but it's very functionally limited and can't be modified much.
  useEffect(() => {
    const handleScroll = () => {
      const height = window.scrollY

      if (isVisible) {
        if (height - highPoint > 30) {
          setIsVisible(false)
          setLowPoint(height)
        } else if (height < highPoint) {
          setHighPoint(height)
        }
      } else {
        if (lowPoint - height > 50) {
          setIsVisible(true)
          setHighPoint(height)
        } else if (height > lowPoint) {
          setLowPoint(height)
        }
      }
    }

    // adding "passive" is supposed to increase performance for scrolling. See:
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lowPoint, highPoint, isVisible])

  return (
    <Slide appear={false} direction="down" in={isVisible}>
      <AppBar position="sticky" sx={{ mb: 2 }}>
        <Toolbar>
          <NavbarDrawer />
          <Typography variant="h5">
            <Link href={'/'}>Iron Log</Link>
          </Typography>
          <Box
            sx={{
              flex: 1,
            }}
          />
          <Stack direction="row" spacing={1}>
            <DarkModeButton />
            <LogoutButton />
          </Stack>
        </Toolbar>
      </AppBar>
    </Slide>
  )
}
