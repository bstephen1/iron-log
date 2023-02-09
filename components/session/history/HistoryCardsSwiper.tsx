import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { Navigation, Pagination, Scrollbar } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useRecords } from '../../../lib/frontend/restService'
import { RecordQuery } from '../../../models/query-filters/RecordQuery'
import HistoryCard from './HistoryCard'

import 'swiper/css'
import 'swiper/css/bundle'

import 'swiper/css/pagination'
import { ArrayMatchType } from '../../../models/query-filters/MongoQuery'

interface Props {
  recordId: string
  filter: RecordQuery
}
export default function HistoryCardsSwiper({ recordId, filter }: Props) {
  const { records, isLoading } = useRecords({
    ...filter,
    modifierMatchType: ArrayMatchType.Equivalent,
  })
  // each record's history needs a unique className
  const paginationClassName = `pagination-vertical-${recordId}`

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress color="primary" size={20} />
      </Box>
    )
  }

  if (records && !records.length) {
    return (
      <Typography textAlign="center">No records with those filters!</Typography>
    )
  }

  return (
    // todo: may need to do something with height, just arbitrarily stuck in 300px
    <Stack sx={{ height: '500px' }}>
      {/* todo: spacing is off if coming in from the early return  */}
      <Stack
        direction="row"
        className={paginationClassName}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="40px"
        spacing={1}
      />
      <Swiper
        direction="vertical"
        // vertical orientation REQUIRES a fixed height. Currently fixing height of parent container.
        spaceBetween={20}
        noSwipingClass="swiper-no-swiping-inner"
        className="swiper-no-swiping-outer"
        grabCursor
        pagination={{
          // This was inexplicably not rendering at all.
          // Solved by removing an early return of <></> if isLoading.
          // I guess Swiper needs to be initialized immediately or bizarre behavior
          // can occur.
          // Edit: and yet now the early return has returned, and it's still working...
          el: `.${paginationClassName}`,
          clickable: true,
          // todo: may want to add these when adding a limit to useRecords fetch
          // dynamicBullets: true,
        }}
        // slidesPerView={3}
        // centeredSlides
        modules={[Pagination, Navigation, Scrollbar]}
      >
        {records?.map((record) => (
          <SwiperSlide key={record._id}>
            <HistoryCard record={record} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* the bullets just become spans so we have to stack them 
      vertically or they'll be horizontal */}
      {/* <Stack
        className={paginationClassName}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="40px"
        // flex display removes the bullets' margins but spacing here looks similar enough
        spacing={1}
      /> */}
    </Stack>
  )
}
