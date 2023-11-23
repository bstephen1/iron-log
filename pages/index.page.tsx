import { Box, Button, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { DATE_FORMAT } from '../lib/frontend/constants'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Iron Log</title>
        <meta name="description" content="An app for recording your training" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Stack>
        <Typography textAlign="center">Welcome</Typography>
        <Box display="flex" justifyContent="center">
          <Button>
            <Link href={`/sessions/${dayjs().format(DATE_FORMAT)}/`}>
              Today's Log
            </Link>
          </Button>
        </Box>
      </Stack>
    </>
  )
}

export default Home
