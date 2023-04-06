import { AppBar, Box, Slide, Toolbar, Typography } from '@mui/material'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import LoginButton from './LoginButton'
import NavbarDrawer from './NavbarDrawer'

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true)

  // mui has a "useScrollTrigger" hook that it recommends using for this situation,
  // but it's very functionally limited and can't be modified much.
  useEffect(() => {
    // mobile firefox has horrendous performance for performing a Slide transition
    // while scrolling. Seems to be related to a "scroll-linked positioning effect"
    // console warning. Also seems that there is NO way to do anything about it
    // and still keep the transition.
    // if (isSlowBrowser) {
    //   return
    // }

    // This is a simple static Y value. May want to expand it such that
    // when scrolling down y1 relative pixels it hides, and when scrolling up y2
    // relative pixels it unhides.
    const handleScroll = () => {
      setIsVisible(window.scrollY < 200)
    }

    // adding "passive" is supposed to increase performance for scrolling. See:
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Slide appear={false} direction="down" in={isVisible}>
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
    </Slide>
  )
}
