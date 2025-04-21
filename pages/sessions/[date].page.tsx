import { Stack } from '@mui/material'
import Grid from '@mui/material/Grid2'
import dayjs from 'dayjs'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { createContext, useContext } from 'react'
import 'swiper/css'
import 'swiper/css/pagination'
import SessionSwiper from '../../components/session/SessionSwiper'
import RestTimer from '../../components/session/upper/RestTimer'
import TitleBar from '../../components/session/upper/TitleBar'
import WeightUnitConverter from '../../components/session/upper/WeightUnitConverter'
import { dateSchema } from '../../models/schemas'
import { SessionLog } from '../../models/SessionLog'
import { fetchBodyweights, fetchSession } from '../../lib/backend/mongoService'
import { getUserId } from '../../lib/backend/apiMiddleware/util'

export async function getServerSideProps({
  query,
  req,
  res,
}: GetServerSidePropsContext) {
  try {
    const userId = await getUserId(req, res)
    const date = dateSchema.parse(query.date)

    const session = await fetchSession(userId, date)
    const latestWeight = (
      await fetchBodyweights(
        userId,
        { type: 'official' },
        {
          limit: 1,
          end: date,
          sort: 'newestFirst',
        }
      )
    )[0]
    return { props: { date, session, latestWeight } }
  } catch {
    return { notFound: true }
  }
}

interface SessionContext {
  session: SessionLog
  latestBodyweight: unknown
}
const SessionContext = createContext('')

/** Returns the validated date url param.
 *  Preferred over using router to fetch the raw value. */
export const useSessionContext = () => useContext(SessionContext)

interface Props {
  date: string
}
export default function SessionPage({ date, session, latestWeight }: Props) {
  console.log(latestWeight)
  return (
    <>
      <Head>
        {/* this needs to be a single string or it throws a warning */}
        <title>{`Iron Log - ${date}`}</title>
      </Head>
      <SessionContext.Provider value={date}>
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
      </SessionContext.Provider>
    </>
  )
}
