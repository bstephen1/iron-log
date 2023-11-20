import { Stack, Typography, useTheme } from '@mui/material'
import StyledDivider from 'components/StyledDivider'
import HistoryGraph from 'components/history/HistoryGraph'
import QueryForm from 'components/history/QueryForm'
import HistoryCardsSwiper from 'components/session/history/HistoryCardsSwiper'
import { RecordHistoryQuery } from 'models/query-filters/RecordQuery'
import { useState } from 'react'

export default function HistoryPage() {
  const theme = useTheme()
  const [query, setQuery] = useState<RecordHistoryQuery>()

  // todo: scroll snap?
  return (
    <Stack spacing={2}>
      <Typography variant="h5" mb={2} display="flex" justifyContent="center">
        History
      </Typography>
      <QueryForm {...{ query, setQuery }} />

      <StyledDivider />
      <HistoryCardsSwiper
        query={query}
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
      <HistoryGraph query={query} />
    </Stack>
  )
}
