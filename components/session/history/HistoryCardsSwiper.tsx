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
  const paginationClassName = `pagination-history-${recordId}`

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
          noSwipingClass="swiper-no-swiping-inner"
          className="swiper-no-swiping-outer"
          autoHeight
          // dir is supposed to make it so that the swiper swipes from right to left instead of left to right,
          // but it actually changes EVERYTHING in the swiper to render row-reversed. So it's basically unusable.
          // If despite that we still want to use rtl remember to change the pagination flexDirection to row-reverse.
          // dir="rtl"
          grabCursor
          pagination={{
            el: `.${paginationClassName}`,
            clickable: true,
            // todo: may want to add these when adding a limit to useRecords fetch
            // Note: they appear to break the centering css
            // dynamicBullets: true,
          }}
          modules={[Pagination, Navigation, Scrollbar]}
        >
          {records?.map((record) => (
            <SwiperSlide key={record._id}>
              <HistoryCard record={record} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Stack>
  )
}
