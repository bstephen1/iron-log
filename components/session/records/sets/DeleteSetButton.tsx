import ClearIcon from '@mui/icons-material/Clear'
import { IconButton, IconButtonProps, SxProps } from '@mui/material'
import { memo } from 'react'
import { useSWRConfig } from 'swr'
import { URI_RECORDS } from '../../../../lib/frontend/constants'
import { updateRecordFields } from '../../../../lib/frontend/restService'
import { Record } from '../../../../models/Record'

interface Props extends IconButtonProps {
  _id: Record['_id']
  index: number
  sx?: SxProps
}
export default memo(function DeleteSetButton({ _id, index, sx }: Props) {
  const { mutate } = useSWRConfig()

  const handleDeleteSet = async () => {
    mutate<Record | null>(
      URI_RECORDS + _id,
      (cur) =>
        cur
          ? updateRecordFields(_id, {
              ['sets']: cur.sets.filter((_, j) => j !== index),
            })
          : null,
      {
        optimisticData: (cur) =>
          cur ? { ...cur, sets: cur.sets.filter((_, j) => j !== index) } : null,
        revalidate: false,
      }
    )
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
})
