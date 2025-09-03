import DeleteIcon from '@mui/icons-material/Delete'
import { memo } from 'react'
import { useSwiper } from 'swiper/react'
import { useCurrentDate } from '../../../../app/sessions/[date]/useCurrentDate'
import { deleteRecord } from '../../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../../lib/frontend/constants'
import {
  useDeleteMutation,
  useSessionLog,
} from '../../../../lib/frontend/restService'
import TooltipIconButton from '../../../TooltipIconButton'

interface Props {
  _id: string
}
export default memo(function DeleteRecordButton({ _id }: Props) {
  const swiper = useSwiper()
  const date = useCurrentDate()
  const { data: sessionLog } = useSessionLog(date)
  const deleteRecordMutate = useDeleteMutation({
    queryKey: [QUERY_KEYS.records, { date }],
    deleteFn: deleteRecord,
  })

  const handleDelete = async (id: string) => {
    if (!sessionLog) return

    deleteRecordMutate(id)

    swiper.update()
    swiper.slidePrev()
  }

  return (
    <TooltipIconButton
      title="Delete record"
      color="error"
      onClick={() => handleDelete(_id)}
    >
      <DeleteIcon />
    </TooltipIconButton>
  )
})
