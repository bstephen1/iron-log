import { useMediaQuery } from '@mui/material'

export default function useDesktopCheck() {
  return useMediaQuery('(pointer: fine)')
}
