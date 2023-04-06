import { AppBar, Box, Slide, Toolbar, Typography } from '@mui/material'
import Link from 'next/link'
import { ReactElement, useEffect, useState } from 'react'
import LoginButton from './LoginButton'
import NavbarDrawer from './NavbarDrawer'

export default function Navbar() {
  function HideOnScroll({ children }: { children: ReactElement }) {
    const [isVisible, setIsVisible] = useState(true)

    // This is a simple static Y value. May want to expand it such that
    // when scrolling down y1 relative pixels it hides, and when scrolling up y2
    // relative pixels it unhides.
    const handleScroll = () => {
      setIsVisible(window.scrollY < 250)
    }

    // mui has a "useScrollTrigger" hook that it recommends using for this situation,
    // but said hook has horrendous performance on firefox, and even produces a console warning.
    useEffect(() => {
      // adding "passive" is supposed to increase performance for scrolling. See:
      // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners
      window.addEventListener('scroll', handleScroll, { passive: true })

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }, [])

    return (
      <Slide appear={false} direction="down" in={isVisible}>
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
