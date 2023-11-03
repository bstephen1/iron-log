import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { memo } from 'react'

export default memo(function HistoryTitle() {
  const theme = useTheme()

  return (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      // nav arrows add height to pagination box
      py={useMediaQuery(theme.breakpoints.down('sm')) ? 2 : 0}
    >
      <Divider
        sx={{
          fontSize: 12,
          width: '80%',
          '&::before, &::after': {
            borderColor: theme.palette.primary.main,
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
