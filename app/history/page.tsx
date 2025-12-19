'use client'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { type ComponentProps, useRef, useState } from 'react'
import type { SwiperRef } from 'swiper/react'
import HistoryGraph from '../../components/history/HistoryGraph'
import QueryForm from '../../components/history/QueryForm'
import StyledDivider from '../../components/StyledDivider'
import HistoryCardsSwiper from '../../components/session/history/HistoryCardsSwiper'
import { DEFAULT_DISPLAY_FIELDS } from '../../models/DisplayFields'
import {
  DEFAULT_RECORD_HISTORY_QUERY,
  type RecordQuery,
} from '../../models/Record'

const staticProps: Partial<ComponentProps<typeof HistoryCardsSwiper>> = {
  displayFields: { units: DEFAULT_DISPLAY_FIELDS.units },
  actions: ['recordNotes', 'exerciseNotes', 'manage'],
  content: ['exercise', 'modifiers', 'setType', 'sets'],
  cardProps: { elevation: 3, sx: { m: 0.5, px: 1 } },
  fractionPagination: true,
}

export default function HistoryPage() {
  const theme = useTheme()
  const [query, setQuery] = useState<RecordQuery>(DEFAULT_RECORD_HISTORY_QUERY)
  const swiperRef = useRef<SwiperRef>(null)

  const swipeToRecord = (index: number) =>
    swiperRef.current?.swiper?.slideTo(index)

  return (
    <Stack spacing={2}>
      <Typography variant="h5" mb={2} display="flex" justifyContent="center">
        History
      </Typography>
      <QueryForm {...{ query, updateQuery: setQuery }} />

      <Box pt={2}>
        <StyledDivider />
      </Box>
      {query?.exercise && (
        <HistoryCardsSwiper
          swiperRef={swiperRef}
          query={query}
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
          {...staticProps}
        />
      )}
      <HistoryGraph query={query} swipeToRecord={swipeToRecord} />
    </Stack>
  )
}
