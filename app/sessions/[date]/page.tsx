import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Head from 'next/head'
import { notFound } from 'next/navigation'
import 'swiper/css'
import 'swiper/css/pagination'
import SessionSwiper from '../../../components/session/SessionSwiper'
import RestTimer from '../../../components/session/upper/RestTimer'
import TitleBar from '../../../components/session/upper/TitleBar'
import WeightUnitConverter from '../../../components/session/upper/WeightUnitConverter'
import { dateSchema } from '../../../models/schemas'

interface Props {
  params: Promise<{ date: string }>
}
export default async function DatePage({ params }: Props) {
  const { data: date } = dateSchema.safeParse((await params).date)

  if (!date) {
    notFound()
  }

  return (
    <>
      <Head>
        {/* this needs to be a single string or it throws a warning */}
        <title>{`Iron Log - ${date}`}</title>
      </Head>
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
        {/* resetting key on date change ensures quickRender resets */}
        <SessionSwiper key={date} />
      </Stack>
    </>
  )
}
