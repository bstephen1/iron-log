import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Box, IconButton } from '@mui/material'

interface Props {
  direction: 'next' | 'prev'
  /** The classname must match the name given in the Swiper component to inherit functionality. */
  className: string
  disabled: boolean
}
export default function NavigationArrow({
  direction,
  className,
  disabled,
}: Props) {
  // todo: nav button ripples are elongated
  // todo: actually thinking of making these ListItemButtons,
  // HistoryCards are within the single Swiper, and the Icon can be sticky
  // and scroll down the screen. The ListItemButton will be clickable
  // over the whole gutter.
  return (
    <Box display="flex" width="auto" alignItems="center">
      <IconButton
        sx={{ display: { xs: 'none', sm: 'block' } }}
        className={className}
        color="primary"
        disabled={disabled}
      >
        {direction === 'prev' ? (
          <ArrowBackIosNewIcon />
        ) : (
          <ArrowForwardIosIcon />
        )}
      </IconButton>
    </Box>
  )
}
