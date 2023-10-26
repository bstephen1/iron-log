import DeleteIcon from '@mui/icons-material/Delete'
import useCurrentSessionLog from 'components/session/useCurrentSessionLog'
import { deleteSessionRecord } from 'lib/frontend/restService'
import { useSwiper } from 'swiper/react'
import RecordHeaderButton from '../RecordHeaderButton'
import useCurrentRecord from '../useCurrentRecord'

export default function DeleteRecordButton() {
  const { _id } = useCurrentRecord()
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
    <RecordHeaderButton
      title="Delete Record"
      color="error"
      onClick={() => deleteRecord(_id)}
    >
      <DeleteIcon />
    </RecordHeaderButton>
  )
}
