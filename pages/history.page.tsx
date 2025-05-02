import { Box, Stack, Typography, useTheme } from '@mui/material'
import { useRef, useState } from 'react'
import { type SwiperRef } from 'swiper/react'
import HistoryGraph from '../components/history/HistoryGraph'
import QueryForm from '../components/history/QueryForm'
import HistoryCardsSwiper from '../components/session/history/HistoryCardsSwiper'
import StyledDivider from '../components/StyledDivider'
import { type RecordRangeQuery } from '../models/Record'

export default function HistoryPage() {
  const theme = useTheme()
  const [query, setQuery] = useState<RecordRangeQuery>()
  const swiperRef = useRef<SwiperRef>(null)
  const swiper = swiperRef.current?.swiper

  const swipeToRecord = (index: number) => {
    if (!swiper) return
    swiper.slideTo(index)
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5" mb={2} display="flex" justifyContent="center">
        History
      </Typography>
      <QueryForm {...{ query, setQuery }} />

      <Box pt={2}>
        <StyledDivider />
      </Box>
      <HistoryCardsSwiper
        swiperRef={swiperRef}
        query={query?.exercise ? query : undefined}
        fractionPagination
        actions={['recordNotes', 'exerciseNotes', 'manage']}
        content={['exercise', 'modifiers', 'setType', 'sets']}
        cardProps={{ elevation: 3, sx: { m: 0.5, px: 1 } }}
        swiperProps={{
          breakpoints: {
            [theme.breakpoints.values.sm]: {
              slidesPerView: 1,
            },
            [theme.breakpoints.values.md]: {
              slidesPerView: 2,
              centeredSlides: false,
              centerInsufficientSlides: true,
            },
            [theme.breakpoints.values.lg]: {
              slidesPerView: 3,
              centeredSlides: true,
              centerInsufficientSlides: false,
            },
          },
        }}
      />
      <HistoryGraph query={query} swipeToRecord={swipeToRecord} />
    </Stack>
  )
}
