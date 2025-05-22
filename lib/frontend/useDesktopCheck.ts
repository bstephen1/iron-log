import useMediaQuery from '@mui/material/useMediaQuery'

/** returns true if the screen is determined to be a desktop */
export default function useDesktopCheck() {
  // pointer: fine -> cursor is a mouse
  // pointer: course -> cursor is a finger/touchscreen
  // See: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer
  return useMediaQuery('(pointer: fine)')
}
