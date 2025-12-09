import ClearIcon from '@mui/icons-material/Clear'
import IconButton, { type IconButtonProps } from '@mui/material/IconButton'
import type { SxProps } from '@mui/material/styles'
import { useCurrentDate } from '../../../../app/sessions/[date]/useCurrentDate'
import { updateRecordFields } from '../../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../../lib/frontend/constants'
import { useUpdateMutation } from '../../../../lib/frontend/restService'
import type { Record } from '../../../../models/Record'
import type { Set } from '../../../../models/Set'

interface Props extends IconButtonProps {
  _id: Record['_id']
  index: number
  sets: Set[]
  sx?: SxProps
}
export default function DeleteSetButton({ _id, index, sets, sx }: Props) {
  const date = useCurrentDate()
  const updateRecordMutate = useUpdateMutation({
    queryKey: [QUERY_KEYS.records, { date }],
    updateFn: updateRecordFields,
  })

  const handleDeleteSet = async () => {
    updateRecordMutate({
      _id,
      updates: { sets: sets.filter((_, j) => j !== index) },
    })
  }

  return (
    <IconButton
      size="small"
      onClick={handleDeleteSet}
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
