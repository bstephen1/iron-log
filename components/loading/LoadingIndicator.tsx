import { Box, CircularProgress } from '@mui/material'

export default function LoadingIndicator() {
  return (
    <Box>
      <Box display="flex" justifyContent="center" py={10} flex="1 1 auto">
        <CircularProgress />
      </Box>
    </Box>
  )
}
