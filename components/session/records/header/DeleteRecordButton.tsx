import DeleteIcon from '@mui/icons-material/Delete'
import { memo } from 'react'
import { useSwiper } from 'swiper/react'
import { useCurrentDate } from '../../../../app/sessions/[date]/useCurrentDate'
import {
  useSessionLog,
  useSessionLogUpsert,
} from '../../../../lib/frontend/restService'
import TooltipIconButton from '../../../TooltipIconButton'

interface Props {
  _id: string
}
export default memo(function DeleteRecordButton({ _id }: Props) {
  const swiper = useSwiper()
  const date = useCurrentDate()
  const { data: sessionLog } = useSessionLog(date)
  const upsertSession = useSessionLogUpsert(date)

  const handleDelete = async (recordId: string) => {
    if (!sessionLog) return

    upsertSession({
      ...sessionLog,
      records: sessionLog.records.filter((id) => id !== recordId),
    })

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
