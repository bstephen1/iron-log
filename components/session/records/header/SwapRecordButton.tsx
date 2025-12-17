import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import { useSwiper } from 'swiper/react'
import { useCurrentDate } from '../../../../app/sessions/[date]/useCurrentDate'
import { upsertSessionLog } from '../../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../../lib/frontend/constants'
import { useReplaceMutation } from '../../../../lib/frontend/data/useMutation'
import { useSessionLog } from '../../../../lib/frontend/data/useQuery'
import TooltipIconButton from '../../../TooltipIconButton'

interface Props {
  direction: 'left' | 'right'
  index: number
}
export default function SwapRecordButton({ direction, index }: Props) {
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

  const swapRecords = async () => {
    if (!sessionLog) return
    const i = index
    const j = isLeft ? index - 1 : index + 1

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
      onClick={swapRecords}
    >
      {isLeft ? (
        <KeyboardDoubleArrowLeftIcon />
      ) : (
        <KeyboardDoubleArrowRightIcon />
      )}
    </TooltipIconButton>
  )
}
