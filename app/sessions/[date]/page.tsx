import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import 'swiper/css'
import 'swiper/css/pagination'
import LoadingSpinner from '../../../components/loading/LoadingSpinner'
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
import QueryClientWrapper from '../../QueryClientWrapper'
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

  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.sessionLogs, date],
    queryFn: () => fetchSessionLog(undefined, date),
  })
  queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.records, { date }],
    queryFn: () => fetchRecords(undefined, undefined, { date }),
  })

  return (
    <QueryClientWrapper>
      <HydrationBoundary state={dehydrate(queryClient)}>
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
          <Suspense fallback={<LoadingSpinner />}>
            {/* resetting key on date change ensures quickRender resets */}
            <SessionSwiper key={date} date={date} />
          </Suspense>
        </Stack>
      </HydrationBoundary>
    </QueryClientWrapper>
  )
}
