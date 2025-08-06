import { useColorScheme } from '@mui/material/styles'

export default function useDarkMode() {
  const { colorScheme } = useColorScheme()
  return colorScheme === 'dark'
}
