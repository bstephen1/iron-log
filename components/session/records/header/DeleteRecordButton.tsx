import DeleteIcon from '@mui/icons-material/Delete'
import { memo } from 'react'
import { useSwiper } from 'swiper/react'
import TooltipIconButton from '../../../TooltipIconButton'
import useCurrentSessionLog from '../../../../components/session/useCurrentSessionLog'
import { deleteSessionRecord } from '../../../../lib/frontend/restService'

interface Props {
  _id: string
}
export default memo(function DeleteRecordButton({ _id }: Props) {
  const swiper = useSwiper()
  const { sessionLog, mutate } = useCurrentSessionLog()

  const deleteRecord = async (recordId: string) => {
    if (!sessionLog) return

    const newRecords = sessionLog.records.filter((id) => id !== recordId)
    mutate(deleteSessionRecord(sessionLog.date, recordId), {
      optimisticData: { ...sessionLog, records: newRecords },
      revalidate: false,
    })
    swiper.update()
    swiper.slidePrev()
  }

  return (
    <TooltipIconButton
      title="Delete Record"
      color="error"
      onClick={() => deleteRecord(_id)}
    >
      <DeleteIcon />
    </TooltipIconButton>
  )
})
