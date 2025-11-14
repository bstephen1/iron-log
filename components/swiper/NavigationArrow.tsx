import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
import type Swiper from 'swiper'
import { useSwiper } from 'swiper/react'
import useDesktopCheck from '../../lib/frontend/useDesktopCheck'

interface Props {
  direction: 'next' | 'prev'
  /** The classname must match the name given in the Swiper component to inherit functionality. */
  className: string
  isHidden?: boolean
}
/** This component must be called from within a Swiper component. */
export default function NavigationArrow({
  direction,
  className,
  isHidden,
}: Props) {
  const isPrev = direction === 'prev'
  const swiper = useSwiper()
  const isDesktop = useDesktopCheck()
  const [disabled, setDisabled] = useState(
    isPrev ? swiper.isBeginning : swiper.isEnd
  )
  const [isLocked, setIsLocked] = useState(swiper.isLocked)

  const handleDisabledCheck = (swiper: Swiper) => {
    setDisabled(isPrev ? swiper.isBeginning : swiper.isEnd)
  }

  // useSwiper returns a ref. This means components won't update
  // when its values change. To listen for changes, we must use swiper.on to
  // setup an event listener for a supported swiper event.
  swiper.on('slideChange', (swiper) => handleDisabledCheck(swiper))
  // this is only triggered when swiper.update() is called, which does NOT include slideChange.
  // Needed for adding a record, since that doese not trigger a slide change.
  swiper.on('update', (swiper) => handleDisabledCheck(swiper))

  swiper.on('lock', () => setIsLocked(true))
  swiper.on('unlock', (swiper) => {
    setIsLocked(false)
    handleDisabledCheck(swiper)
  })

  // todo: nav button ripples are elongated
  return (
    <Box
      display={isLocked || isHidden ? 'none' : 'flex'}
      width="auto"
      alignItems="center"
    >
      <IconButton
        sx={{ display: isDesktop ? 'block' : 'none' }}
        className={className}
        color="primary"
        disabled={disabled}
        aria-label={`${direction} slide`}
      >
        {direction === 'prev' ? (
          <ArrowBackIosNewIcon />
        ) : (
          <ArrowForwardIosIcon />
        )}
      </IconButton>
    </Box>
  )
}
