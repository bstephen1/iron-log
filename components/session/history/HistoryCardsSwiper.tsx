import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useRecords } from 'lib/frontend/restService'
import { RecordQuery } from 'models/query-filters/RecordQuery'
import {
  Controller,
  Navigation,
  Pagination,
  Scrollbar,
  Swiper as SwiperClass,
} from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import HistoryCard from './HistoryCard'

import 'swiper/css'
import 'swiper/css/bundle'

import { DisplayFields } from 'models/DisplayFields'
import { ArrayMatchType } from 'models/query-filters/MongoQuery'
import { useEffect, useMemo, useState } from 'react'
import 'swiper/css/pagination'

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
  const isDesktop = useMediaQuery('(pointer: fine)')
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  // todo: limit this to something like 10 records before/after the date, then fetch more if the swiper gets close to either end.
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
    <Stack alignItems="center">
      {/* Dynamic pagination css is very finnicky and opaque. 
          Finally got centered by wrapping them in this centered box to force them
          to be centered. Also requires position relative for some reason. */}
      <Box>
        <Box
          // Setting pagination size overwrites the dynamic bullet size.
          // Couldn't find a way to set the main and dynamic bullets separately.
          // CSS classes are swiper-pagination-bullet-active-main and swiper-pagination-bullet-active-next
          // Swiper css is in swiper/swiper-bundle.css, which has the class used to change pagination size,
          // but there's no obvious equivalent for dynamic bullets.
          className={paginationClassName}
          display="flex"
          justifyContent="center"
          pt={2}
          position="relative"
        />
      </Box>
      {/* this box prevents Swiper from deciding it needs to have infinite width for some reason. Width is required when stack has alignItems centered */}
      <Box width="100%">
        <Swiper
          spaceBetween={20}
          onSwiper={setSwiper}
          noSwipingClass="swiper-no-swiping-inner"
          className="swiper-no-swiping-outer"
          // Unlike the parent swiper, enabling cssMode does break something here: autoheight.
          // Autoheight can be disabled though, and then the height just matches the tallest slide.
          // Which is... acceptable.
          cssMode={!isDesktop}
          autoHeight={isDesktop}
          grabCursor
          pagination={{
            el: `.${paginationClassName}`,
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 5,
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
