import { Box, Stack, Typography } from '@mui/material'
import { useRecords } from 'lib/frontend/restService'
import { RecordQuery } from 'models/query-filters/RecordQuery'
import { Pagination, Swiper as SwiperClass } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import HistoryCard from './HistoryCard'

import 'swiper/css'
import 'swiper/css/pagination'

import { DisplayFields } from 'models/DisplayFields'
import { ArrayMatchType } from 'models/query-filters/MongoQuery'
import { useState } from 'react'
import 'swiper/css/pagination'

interface Props {
  paginationId: string
  /** A record's displayFields are only up to date on fetch, so the current value must
   * be passed in to ensure it is in sync */
  displayFields: DisplayFields
  filter: RecordQuery
}
export default function HistoryCardsSwiper({
  paginationId,
  displayFields,
  filter,
}: Props) {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  // todo: limit this to something like 10 records before/after the date, then fetch more if the swiper gets close to either end.
  const { records, isLoading } = useRecords({
    ...filter,
    modifierMatchType: ArrayMatchType.Equivalent,
    sort: 'oldestFirst',
  })
  // each record's history needs a unique className
  const paginationClassName = `pagination-history-${paginationId}`

  // assumes filter has end date set to the current record's date (so will exclude it)
  if (records && !records?.length) {
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
          // position="relative"
        />
      </Box>
      {/* this box prevents Swiper from having infinite width. Width is required when the stack has alignItems centered */}
      <Box width="100%">
        <Swiper
          spaceBetween={20}
          onSwiper={setSwiper}
          noSwipingClass="swiper-no-swiping-inner"
          className="swiper-no-swiping-outer"
          grabCursor
          // This isn't documented, but the out of bounds behavior sets the active slide to
          // the closest valid index (first slide starting at 0). This makes it pretty easy
          // to default to the last index when length is unknown, but has a max possible value.
          initialSlide={filter.limit}
          // autoHeight should not be enabled if parent swiper is not also using autoheight because it won't do anything.
          pagination={{
            el: `.${paginationClassName}`,
            clickable: true,
            // dynamic bullets cause a total crash when navigating from SessionView to some other page, then back to SessionView.
            // This appears to only occur in production.
            // dynamicBullets: true,
            // dynamicMainBullets: 5,
          }}
          modules={[Pagination]}
          style={{ padding: '11px 4px' }}
        >
          {records?.map((record) => (
            <SwiperSlide key={record._id}>
              <HistoryCard
                {...{
                  record,
                  displayFields,
                  filterModifiers: filter.modifier || [],
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Stack>
  )
}
