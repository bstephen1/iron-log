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

import 'swiper/css'
import 'swiper/css/pagination'

import { memo, type Ref, useEffect, useState } from 'react'
import isEqual from 'react-fast-compare'
import 'swiper/css/pagination'
import RecordCardSkeleton from '../../../components/loading/RecordCardSkeleton'
import NavigationBar from '../../../components/slider/NavigationBar'
import { type DisplayFields } from '../../../models/DisplayFields'
import { type RecordRangeQuery } from '../../../models/Record'
import Box from '@mui/material/Box'
import { type CardProps } from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

// todo: useSWRInfinite for infinite loading?
// https://swr.vercel.app/docs/pagination

interface Props {
  /** displayFields to use for each history card. If omitted, cards will use their own displayFields. */
  displayFields?: DisplayFields
  query?: RecordRangeQuery
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
export default memo(function HistoryCardsSwiper({
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
  const [isFirstRender, setIsFirstRender] = useState(true)

  // todo: fetch more if the swiper gets close to the end. (Also future dates in case you're in the past?)
  const { records: historyRecords, isLoading } = useRecords(query, !!query)

  // each record's history needs a unique className
  const paginationClassName = `pagination-history${_id ? '-' + _id : ''}`
  const navPrevClassName = `nav-prev-history-${_id ? '-' + _id : ''}`
  const navNextClassName = `nav-next-history-${_id ? '-' + _id : ''}`

  useEffect(() => {
    setIsFirstRender(false)
  }, [])

  if (isLoading || !historyRecords) {
    return (
      <RecordCardSkeleton
        titleTypographyProps={{ textAlign: 'center' }}
        elevation={0}
        sx={{ px: 0, m: 0 }}
      />
    )
  }

  if (!query) {
    return <></>
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
              total - current + 1 + '/' + total,
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
                  // only render first slide initially
                  // todo: potentially use virtual swiper instead. Note autoheight doesn't work.
                  isQuickRender={isFirstRender && i ? true : false}
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
}, isEqual)
