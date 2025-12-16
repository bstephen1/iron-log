import ClearIcon from '@mui/icons-material/Clear'
import IconButton, { type IconButtonProps } from '@mui/material/IconButton'
import type { SxProps } from '@mui/material/styles'
import { useSetDelete } from '../../../../lib/frontend/restService'

interface Props extends IconButtonProps {
  _id: string
  index: number
  sx?: SxProps
}
export default function DeleteSetButton({ _id, index, sx }: Props) {
  const deleteSet = useSetDelete(_id, index)

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
