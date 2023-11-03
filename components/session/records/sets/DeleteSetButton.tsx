import ClearIcon from '@mui/icons-material/Clear'
import { IconButton, IconButtonProps } from '@mui/material'
import { URI_RECORDS } from 'lib/frontend/constants'
import { updateRecordFields } from 'lib/frontend/restService'
import Record from 'models/Record'
import { memo } from 'react'
import { useSWRConfig } from 'swr'

interface Props extends IconButtonProps {
  _id: Record['_id']
  index: number
}
export default memo(function DeleteSetButton({
  _id,
  index,
  ...iconButtonProps
}: Props) {
  const { mutate } = useSWRConfig()

  const handleDeleteSet = async () => {
    mutate<Record | null>(
      URI_RECORDS + _id,
      (cur) =>
        cur
          ? updateRecordFields(_id, {
              ['sets']: cur?.sets.filter((_, j) => j !== index),
            })
          : null,
      {
        optimisticData: (cur: Record) =>
          cur ? { ...cur, sets: cur.sets.filter((_, j) => j !== index) } : null,
        revalidate: false,
      }
    )
  }

  return (
    <IconButton size="small" onClick={handleDeleteSet} {...iconButtonProps}>
      <ClearIcon />
    </IconButton>
  )
})
