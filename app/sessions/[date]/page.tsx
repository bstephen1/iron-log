import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import 'swiper/css'
import 'swiper/css/pagination'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import SessionSwiper from '../../../components/session/SessionSwiper'
import RestTimer from '../../../components/session/upper/RestTimer'
import TitleBar from '../../../components/session/upper/TitleBar'
import WeightUnitConverter from '../../../components/session/upper/WeightUnitConverter'
import {
  fetchRecords,
  fetchSessionLog,
} from '../../../lib/backend/mongoService'
import { DATE_FORMAT, QUERY_KEYS } from '../../../lib/frontend/constants'
import getQueryClient from '../../../lib/getQueryClient'

dayjs.extend(customParseFormat)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params

  return {
    title: `${date} - Iron Log`,
  }
}

interface Props {
  params: Promise<{ date: string }>
}
export default async function DatePage({ params }: Props) {
  const date = (await params).date
  // customParseFormat ensures the date is exactly in DATE_FORMAT.
  // Otherwise dayjs() will convert from any valid date string
  const day = dayjs(date, DATE_FORMAT, true)

  if (!day.isValid()) {
    notFound()
  }

  const queryClient = getQueryClient()

  // We want to await for this data because we can't meaningfully render
  // anything for SessionSwiper if we don't have the record data.
  // Without awaiting it will assume no records and render the no session view.
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.sessionLogs, date],
      queryFn: () => fetchSessionLog(date),
    }),
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.records, { date }],
      queryFn: () => fetchRecords({ date }),
    }),
  ])

  return (
    <Stack spacing={2}>
      <TitleBar date={date} />
      <Grid container>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <RestTimer />
        </Grid>
        <Grid
          display="flex"
          alignItems="center"
          justifyContent="center"
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <WeightUnitConverter />
        </Grid>
      </Grid>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* resetting key on date change ensures state resets */}
        <SessionSwiper key={date} date={date} />
      </HydrationBoundary>
    </Stack>
  )
}
