import ClearIcon from '@mui/icons-material/Clear'
import IconButton, { type IconButtonProps } from '@mui/material/IconButton'
import type { SxProps } from '@mui/material/styles'

interface Props extends IconButtonProps {
  index: number
  deleteSet: () => void
  sx?: SxProps
}
export default function DeleteSetButton({ index, deleteSet, sx }: Props) {
  return (
    <IconButton
      size="small"
      onClick={deleteSet}
      aria-label={`Delete set ${index + 1}`}
      sx={{
        ...sx,
        p: 1,
        borderRadius: 0,
        '& .MuiTouchRipple-ripple .MuiTouchRipple-child': {
          borderRadius: 0,
        },
      }}
    >
      <ClearIcon />
    </IconButton>
  )
}
