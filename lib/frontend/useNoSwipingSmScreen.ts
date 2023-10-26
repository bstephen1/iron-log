import { useMediaQuery, useTheme } from '@mui/material'

/** returns classname for no swiping if screen is small */
export default function useNoSwipingSmScreen() {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.up('sm'))
    ? 'swiper-no-swiping-record'
    : ''
}
