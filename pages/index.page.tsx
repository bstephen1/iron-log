import { Box, Button, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { DATE_FORMAT, guestUserName } from '../lib/frontend/constants'
import { useSession } from 'next-auth/react'

const Home: NextPage = () => {
  const { data } = useSession()
  const user = data?.user?.name

  return (
    <>
      <Head>
        <title>Iron Log</title>
        <meta name="description" content="An app for recording your training" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Stack>
        <Typography textAlign="center" variant="h6" sx={{ pb: 3 }}>
          Welcome
        </Typography>
        {user !== guestUserName ? (
          <Box display="flex" justifyContent="center">
            <Button>
              <Link href={`/sessions/${dayjs().format(DATE_FORMAT)}/`}>
                Today's log
              </Link>
            </Button>
          </Box>
        ) : (
          <>
            <Typography textAlign="center" sx={{ pb: 1 }}>
              You are logged in as a guest.
            </Typography>

            <Box display="flex" justifyContent="center">
              <Button>
                <Link href={`/sessions/2022-09-26/`}>Sample log</Link>
              </Button>
            </Box>
          </>
        )}
      </Stack>
    </>
  )
}

export default Home
