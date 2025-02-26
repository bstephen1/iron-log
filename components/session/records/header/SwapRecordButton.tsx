import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import { memo } from 'react'
import { useSwiper } from 'swiper/react'
import TooltipIconButton from '../../../TooltipIconButton'
import useCurrentSessionLog from '../../../../components/session/useCurrentSessionLog'
import { updateSessionLog } from '../../../../lib/frontend/restService'

interface Props {
  direction: 'left' | 'right'
  index: number
}
export default memo(function SwapRecordButton({ direction, index }: Props) {
  // not extracting everything so it's easier to see what comes from swiper
  const swiper = useSwiper()
  const { sessionLog, mutate } = useCurrentSessionLog()

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

    // todo: avoid the semi colon?
    const newRecords = [...sessionLog.records]
    ;[newRecords[j], newRecords[i]] = [newRecords[i], newRecords[j]]
    const newSession = { ...sessionLog, records: newRecords }
    mutate(updateSessionLog(newSession), {
      optimisticData: newSession,
      revalidate: false,
    })
    swiper.update()
    // todo: think about animation here. Instant speed? Maybe if it could change to a fade transition?
    swiper.slideTo(j, 0)
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
