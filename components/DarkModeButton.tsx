import IconButton from '@mui/material/IconButton'
import { useColorScheme } from '@mui/material/styles'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

export default function DarkModeButton() {
  const { mode, setMode, systemMode } = useColorScheme()
  const isDark = (mode === 'system' ? systemMode : mode) === 'dark'

  return (
    <IconButton onClick={() => setMode(isDark ? 'light' : 'dark')}>
      {isDark ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  )
}
