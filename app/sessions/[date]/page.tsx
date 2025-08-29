import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import 'swiper/css'
import 'swiper/css/pagination'
import SessionSwiper from '../../../components/session/SessionSwiper'
import RestTimer from '../../../components/session/upper/RestTimer'
import TitleBar from '../../../components/session/upper/TitleBar'
import WeightUnitConverter from '../../../components/session/upper/WeightUnitConverter'
import {
  fetchRecords,
  fetchSessionLog,
} from '../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../lib/frontend/constants'
import getQueryClient from '../../../lib/getQueryClient'
import { dateSchema } from '../../../models/schemas'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
interface Props {
  params: Promise<{ date: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params

  return {
    title: `Iron Log - ${date}`,
  }
}

export default async function DatePage({ params }: Props) {
  const { data: date } = dateSchema.safeParse((await params).date)

  if (!date) {
    notFound()
  }

  const queryClient = getQueryClient()

  // We want to await for this data because we can't meaningfully render
  // anything for SessionSwiper if we don't have the record data.
  // Without awaiting it will assume no records and render the no session view.
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.sessionLogs, date],
      queryFn: () => fetchSessionLog(undefined, date),
    }),
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.records, { date }],
      queryFn: () => fetchRecords(undefined, undefined, { date }),
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
        {/* resetting key on date change ensures quickRender resets */}
        <SessionSwiper key={date} date={date} />
      </HydrationBoundary>
    </Stack>
  )
}
