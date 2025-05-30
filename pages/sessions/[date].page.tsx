import Grid from '@mui/material/Grid'
import dayjs from 'dayjs'
import { type GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { createContext, useContext } from 'react'
import 'swiper/css'
import 'swiper/css/pagination'
import SessionSwiper from '../../components/session/SessionSwiper'
import RestTimer from '../../components/session/upper/RestTimer'
import TitleBar from '../../components/session/upper/TitleBar'
import WeightUnitConverter from '../../components/session/upper/WeightUnitConverter'
import { dateSchema } from '../../models/schemas'
import Stack from '@mui/material/Stack'

export function getServerSideProps({ query }: GetServerSidePropsContext) {
  try {
    const date = dateSchema.parse(query.date)
    return { props: { date } }
  } catch {
    return { notFound: true }
  }
}

const DateContext = createContext('')

/** Returns the validated date url param.
 *  Preferred over using router to fetch the raw value. */
export const useDateContext = () => useContext(DateContext)

interface Props {
  date: string
}
export default function SessionPage({ date }: Props) {
  return (
    <>
      <Head>
        {/* this needs to be a single string or it throws a warning */}
        <title>{`Iron Log - ${date}`}</title>
      </Head>
      <DateContext.Provider value={date}>
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
      </DateContext.Provider>
    </>
  )
}
