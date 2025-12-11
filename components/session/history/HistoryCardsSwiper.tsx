import Box from '@mui/material/Box'
import type { CardProps } from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Ref } from 'react'
import { Navigation, Pagination, Virtual } from 'swiper/modules'
import {
  Swiper,
  type SwiperProps,
  type SwiperRef,
  SwiperSlide,
} from 'swiper/react'
import { useRecords } from '../../../lib/frontend/restService'
import HistoryCard, {
  type HistoryAction,
  type HistoryContent,
} from './HistoryCard'
import 'swiper/css/pagination'
import RecordCardSkeleton from '../../../components/loading/RecordCardSkeleton'
import type { DisplayFields } from '../../../models/DisplayFields'
import type { RecordQuery } from '../../../models/Record'
import NavigationBar from '../../swiper/NavigationBar'
import 'swiper/css'
import 'swiper/css/pagination'

interface Props {
  /** displayFields to use for each history card. If omitted, cards will use their own displayFields. */
  displayFields?: Partial<DisplayFields>
  query: RecordQuery
  /** actions to include in each history card */
  actions?: HistoryAction[]
  /** content to include in each history card */
  content?: HistoryContent[]
  cardProps?: CardProps
  swiperProps?: SwiperProps
  /** record id, used for navigation classNames */
  _id?: string
  fractionPagination?: boolean
  /** Render as virtual cards. Virtual cards are only added to DOM after
   *  they first become active.
   */
  virtual?: boolean
  swiperRef?: Ref<SwiperRef>
}
export default function HistoryCardsSwiper({
  displayFields,
  query,
  actions,
  content,
  cardProps,
  fractionPagination,
  virtual,
  swiperProps,
  swiperRef,
  _id,
}: Props) {
  const { data: historyRecords, isLoading } = useRecords(query)

  // each record's history needs a unique className
  const paginationClassName = `pagination-history${_id ? `-${_id}` : ''}`
  const navPrevClassName = `nav-prev-history-${_id ? `-${_id}` : ''}`
  const navNextClassName = `nav-next-history-${_id ? `-${_id}` : ''}`

  if (isLoading || !historyRecords) {
    return (
      <RecordCardSkeleton
        titleTypographyProps={{ textAlign: 'center' }}
        elevation={0}
        sx={{ px: 0, m: 0 }}
      />
    )
  }

  // assumes query has end date set to the current record's date (so will exclude it)
  if (!historyRecords.length) {
    return (
      <Typography textAlign="center" pb={2}>
        No history found for this exercise.
      </Typography>
    )
  }

  return (
    <Stack alignItems="center">
      {/* this box prevents Swiper from having infinite width. Width is required when the stack has alignItems centered */}
      <Box width="100%">
        <Swiper
          ref={swiperRef}
          spaceBetween={20}
          grabCursor
          // This isn't documented, but the out of bounds behavior sets the active slide to
          // the closest valid index (first slide starting at 0). This makes it pretty easy
          // to default to the last index.
          initialSlide={historyRecords.length}
          autoHeight={!virtual}
          pagination={{
            el: `.${paginationClassName}`,
            clickable: true,
            type: fractionPagination ? 'custom' : 'bullets',
            // reverse order so last item (most recent) is number 1
            renderCustom: (_, current, total) =>
              `${total - current + 1}/${total}`,
          }}
          navigation={{
            prevEl: `.${navPrevClassName}`,
            nextEl: `.${navNextClassName}`,
          }}
          modules={[Pagination, Navigation, Virtual]}
          virtual={virtual}
          {...swiperProps}
        >
          <NavigationBar
            {...{
              navNextClassName,
              navPrevClassName,
              paginationClassName,
              slot: 'container-start',
            }}
          />
          {historyRecords
            .map((historyRecord, i) => (
              <SwiperSlide
                // have to recalculate autoHeight when matchesRecord changes
                key={historyRecord._id}
                virtualIndex={virtual ? i : undefined}
                // disable parent swiping
                className={
                  historyRecords.length > 1 ? 'swiper-no-swiping-record' : ''
                }
              >
                <HistoryCard
                  record={historyRecord}
                  {...{ actions, content, displayFields, cardProps }}
                />
              </SwiperSlide>
              // need to reverse so newest is on the right, not left. Can't do it in useRecords because
              // mongo applies sort before the limit. Also, reverse should be after map because it mutates the array.
            ))
            .reverse()}
        </Swiper>
      </Box>
    </Stack>
  )
}
