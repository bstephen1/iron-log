import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

export default function HistoryTitle() {
  // nav arrows add height to pagination box
  /* v8 ignore next @preserve */
  const py = useMediaQuery((theme) => theme.breakpoints.down('sm')) ? 2 : 0

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
            borderColor: (theme) => theme.palette.primary.light,
          },
        }}
      >
        <Typography variant="h6" sx={{ cursor: 'pointer' }}>
          History
        </Typography>
      </Divider>
    </Box>
  )
}
