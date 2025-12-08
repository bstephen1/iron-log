import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { memo } from 'react'

export default memo(function HistoryTitle() {
  const theme = useTheme()
  // nav arrows add height to pagination box
  /* v8 ignore next */
  const py = useMediaQuery(theme.breakpoints.down('sm')) ? 2 : 0

  return (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={py}
    >
      <Divider
        sx={{
          fontSize: 12,
          width: '80%',
          '&::before, &::after': {
            borderColor: theme.palette.primary.light,
          },
        }}
      >
        <Typography variant="h6" sx={{ cursor: 'pointer' }}>
          History
        </Typography>
      </Divider>
    </Box>
  )
})
