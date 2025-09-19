import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import { memo } from 'react'
import { useSwiper } from 'swiper/react'
import { useCurrentDate } from '../../../../app/sessions/[date]/useCurrentDate'
import { upsertSessionLog } from '../../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../../lib/frontend/constants'
import {
  useReplaceMutation,
  useSessionLog,
} from '../../../../lib/frontend/restService'
import TooltipIconButton from '../../../TooltipIconButton'

interface Props {
  direction: 'left' | 'right'
  index: number
}
export default memo(function SwapRecordButton({ direction, index }: Props) {
  // not extracting everything so it's easier to see what comes from swiper
  const swiper = useSwiper()
  const date = useCurrentDate()
  const { data: sessionLog } = useSessionLog(date)
  const replaceSessionLogMutate = useReplaceMutation({
    queryKey: [QUERY_KEYS.sessionLogs, date],
    replaceFn: upsertSessionLog,
  })

  const isLeft = direction === 'left'
  const leftDisabled = !index
  // disable on the penultimate slide because the last is the "add record" button
  const rightDisabled = index >= swiper.slides.length - 2
  const newIndex = isLeft ? index - 1 : index + 1

  const swapRecords = async (i: number, j: number) => {
    if (!sessionLog) return

    const length = sessionLog.records.length
    if (i < 0 || i >= length || j < 0 || j >= length) {
      console.error(`Tried swapping records out of range: ${i}, ${j}`)
      return
    }

    const newRecords = [...sessionLog.records]
    ;[newRecords[j], newRecords[i]] = [newRecords[i], newRecords[j]]

    replaceSessionLogMutate({ ...sessionLog, records: newRecords })

    swiper.update()
    swiper.slideTo(j, 200)
  }

  return (
    <TooltipIconButton
      title={`Move current record to the ${direction}`}
      disabled={isLeft ? leftDisabled : rightDisabled}
      onClick={() => swapRecords(index, newIndex)}
    >
      {isLeft ? (
        <KeyboardDoubleArrowLeftIcon />
      ) : (
        <KeyboardDoubleArrowRightIcon />
      )}
    </TooltipIconButton>
  )
})
