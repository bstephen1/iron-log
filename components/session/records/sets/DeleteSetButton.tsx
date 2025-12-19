import ClearIcon from '@mui/icons-material/Clear'
import IconButton, { type IconButtonProps } from '@mui/material/IconButton'
import type { SxProps } from '@mui/material/styles'
import { useCurrentDate } from '../../../../app/sessions/[date]/useCurrentDate'
import { deleteSet } from '../../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../../lib/frontend/constants'
import { useOptimisticMutation } from '../../../../lib/frontend/data/useMutation'
import type { Record } from '../../../../models/Record'

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

function useSetDelete(_id = '', index: number) {
  const date = useCurrentDate()
  const mutate = useOptimisticMutation<Record[], Record, undefined>({
    queryKey: [QUERY_KEYS.records, { date }],
    mutationFn: () => deleteSet(_id, index),
    updater: (prev = []) =>
      prev.map((record) =>
        record._id === _id
          ? {
              ...record,
              sets: [
                ...record.sets.slice(0, index),
                ...record.sets.slice(index + 1),
              ],
            }
          : record
      ),
  })
  return () => mutate(undefined)
}
