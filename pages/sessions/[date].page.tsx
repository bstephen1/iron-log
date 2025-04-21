import { Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'
import dayjs from 'dayjs'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { createContext, useContext } from 'react'
import 'swiper/css'
import 'swiper/css/pagination'
import { SWRConfig, SWRConfiguration } from 'swr'
import SessionSwiper from '../../components/session/SessionSwiper'
import RestTimer from '../../components/session/upper/RestTimer'
import TitleBar from '../../components/session/upper/TitleBar'
import WeightUnitConverter from '../../components/session/upper/WeightUnitConverter'
import { getUserId } from '../../lib/backend/apiMiddleware/util'
import { fetchBodyweights } from '../../lib/backend/mongoService'
import { URI_BODYWEIGHT } from '../../lib/frontend/constants'
import { paramify } from '../../lib/frontend/restService'
import DateRangeQuery from '../../models/DateRangeQuery'
import { dateSchema } from '../../models/schemas'

export async function getServerSideProps({
  query,
  req,
  res,
}: GetServerSidePropsContext) {
  const { data: date } = dateSchema.safeParse(query.date)
  if (!date) return { notFound: true }

  const userId = await getUserId(req, res)
  const initialSwrData: SWRConfiguration['fallback'] = {}

  // The DatePicker and Bodyweight input will not trigger a rerender
  // because of getServerSideProps. Other useSwr hooks like useModifiers DO
  // trigger a rerender when placed in the title bar, so it's unclear why
  // these don't. To fix, we fetch the initial bw data server side so it never
  // has to be in that initial loading state. We could further add to this
  // by fetching session and record data here, but app router removes
  // getServerSideProps entirely so it may not be worth implementating until
  // we decided whether or not to migrate to app router.
  const bwDateQuery: DateRangeQuery = {
    end: date,
    limit: 1,
    sort: 'newestFirst',
  }
  const latestWeight = await fetchBodyweights(
    userId,
    { type: 'official' },
    bwDateQuery
  )
  // fallback keys must be in the EXACT order that they are called with useSwr,
  // including the order of query params.
  initialSwrData[
    URI_BODYWEIGHT + paramify({ ...bwDateQuery, type: 'official' })
  ] = latestWeight

  return {
    props: {
      date,
      initialSwrData,
    } as Props,
  }
}

const DateContext = createContext('')

/** Returns the validated date url param.
 *  Preferred over using router to fetch the raw value. */
export const useDateContext = () => useContext(DateContext)

interface Props {
  date: string
  initialSwrData: SWRConfiguration['fallback']
}
export default function SessionPage({ date, initialSwrData }: Props) {
  return (
    <>
      <Head>
        {/* this needs to be a single string or it throws a warning */}
        <title>{`Iron Log - ${date}`}</title>
      </Head>
      <DateContext.Provider value={date}>
        {/* swrConfig is merged with the parent */}
        <SWRConfig value={{ fallback: initialSwrData }}>
          <Stack spacing={2}>
            <TitleBar day={dayjs(date)} />
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
            {/* resetting key on date change ensures quickRender resets */}
            <SessionSwiper key={date} />
          </Stack>
        </SWRConfig>
      </DateContext.Provider>
    </>
  )
}
