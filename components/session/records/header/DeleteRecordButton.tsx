import DeleteIcon from '@mui/icons-material/Delete'
import { memo } from 'react'
import { useSwiper } from 'swiper/react'
import TooltipIconButton from '../../../TooltipIconButton'
import useCurrentSessionLog from '../../../../components/session/useCurrentSessionLog'

interface Props {
  _id: string
}
export default memo(function DeleteRecordButton({ _id }: Props) {
  const swiper = useSwiper()
  const { sessionLog, mutate } = useCurrentSessionLog()

  const deleteRecord = async (recordId: string) => {
    if (!sessionLog) return

    const newSession = {
      ...sessionLog,
      records: sessionLog.records.filter((id) => id !== recordId),
    }

    mutate(
      async () => {
        await deleteRecord(recordId)
        return newSession
      },
      {
        optimisticData: newSession,
      }
    )
    swiper.update()
    swiper.slidePrev()
  }

  return (
    <TooltipIconButton
      title="Delete record"
      color="error"
      onClick={() => deleteRecord(_id)}
    >
      <DeleteIcon />
    </TooltipIconButton>
  )
})
