import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import {
  Controller,
  Navigation,
  Pagination,
  Scrollbar,
  Swiper as SwiperClass,
} from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useRecords } from '../../../lib/frontend/restService'
import { RecordQuery } from '../../../models/query-filters/RecordQuery'
import HistoryCard from './HistoryCard'

import 'swiper/css'
import 'swiper/css/bundle'

import { useEffect, useMemo, useState } from 'react'
import 'swiper/css/pagination'
import { DisplayFields } from '../../../models/DisplayFields'
import { ArrayMatchType } from '../../../models/query-filters/MongoQuery'

interface Props {
  /** just used as index for pagination className */
  recordId: string
  displayFields: DisplayFields
  currentDate: string
  filter: RecordQuery
}
export default function HistoryCardsSwiper({
  recordId,
  currentDate,
  displayFields,
  filter,
}: Props) {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  const { records, isLoading } = useRecords({
    ...filter,
    modifierMatchType: ArrayMatchType.Equivalent,
    sort: 'oldestFirst',
  })
  // each record's history needs a unique className
  const paginationClassName = `pagination-history-${recordId}`
  const mostRecentDateIndex = useMemo(
    () =>
      records
        ? records.findIndex((record) => record.date === currentDate) - 1
        : 0,
    [records, currentDate]
  )

  // When the records get updated (ie, filters change) we need to slide to the new most recent slide.
  // Can't use swiper's initialSlide because the swiper doesn't get always get rerendered when records change.
  useEffect(() => {
    // guard against just initialized/destroyed swiper
    if (typeof swiper?.activeIndex === 'number') {
      // This behavior might not be great UX in practice. It's a bit tricky though. If you swap around the filters
      // you may expect to stay on the same date if it still exists on the new filter. But the filter is usually
      // something you'd set up initially, before browsing. And in that case the filter can be too restricted initially
      // and end up not showing the most recent record when you do set it up.
      swiper.slideTo(mostRecentDateIndex)
    }
  }, [mostRecentDateIndex, swiper])

  if (isLoading || !records) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress color="primary" size={20} />
      </Box>
    )
  }

  // length will be 1 at minimum because the current record will always be fetched
  if (records && records.length < 2) {
    return (
      <Typography textAlign="center">No records with those filters!</Typography>
    )
  }

  return (
    <Stack>
      <Box
        className={paginationClassName}
        display="flex"
        justifyContent="center"
        pt={2}
      />
      {/* this box prevents Swiper from deciding it needs to have infinite width for some reason */}
      <Box>
        <Swiper
          spaceBetween={20}
          onSwiper={setSwiper}
          noSwipingClass="swiper-no-swiping-inner"
          className="swiper-no-swiping-outer"
          autoHeight
          grabCursor
          pagination={{
            el: `.${paginationClassName}`,
            clickable: true,
            // todo: may want to add these when adding a limit to useRecords fetch
            // Note: they appear to break the centering css
            // dynamicBullets: true,
          }}
          modules={[Pagination, Navigation, Scrollbar, Controller]}
        >
          {records
            ?.filter((record) => record.date !== currentDate)
            .map((record) => (
              <SwiperSlide key={record._id}>
                <HistoryCard {...{ record, displayFields }} />
              </SwiperSlide>
            ))}
        </Swiper>
      </Box>
    </Stack>
  )
}
