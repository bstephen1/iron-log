import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import IconButton from '@mui/material/IconButton'
import { useColorScheme } from '@mui/material/styles'
import Tooltip from './Tooltip'
import useDarkMode from './useDarkMode'

export default function DarkModeButton() {
  const { setMode } = useColorScheme()
  const isDark = useDarkMode()

  return (
    <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <IconButton onClick={() => setMode(isDark ? 'light' : 'dark')}>
        {isDark ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  )
}
