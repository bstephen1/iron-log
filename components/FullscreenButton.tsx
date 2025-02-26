import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import { Box, IconButton } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const elem = useRef<HTMLElement | null>(null)

  // Note: document doesn't exist in server, so make sure only client is accessing it

  // Note: pressing F11 is browser fullscreen, which is different than javascript fullscreen.
  // So it doesn't register any fullscreen events. F11 works but won't update the button,
  // and there's no way to detect it unless you watch for and intercept the F11 key.

  useEffect(() => {
    elem.current = document.documentElement
    const updateFullscreenState = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    // Components don't re-render when document changes, so have to add an event listener
    // in case user exits via Esc key
    window.addEventListener('fullscreenchange', updateFullscreenState)
    return () =>
      window.removeEventListener('fullscreenchange', updateFullscreenState)
  }, [])

  const toggleFullscreen = async () =>
    isFullscreen
      ? document.exitFullscreen()
      : await elem.current?.requestFullscreen()

  return (
    <Box px={1}>
      <IconButton color="secondary" onClick={toggleFullscreen}>
        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
    </Box>
  )
}
