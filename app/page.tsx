'use client'
import Button from '@mui/material/Button'
import MuiLink from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  DATE_FORMAT,
  guestUserName,
  sampleLogDate,
  userGuideLink,
} from '../lib/frontend/constants'

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

      <Stack justifyContent="center" alignItems="center" spacing={1}>
        <Typography variant="h6" sx={{ pb: 3 }}>
          Welcome
        </Typography>
        {user !== guestUserName ? (
          <Button>
            <Link href={`/sessions/${dayjs().format(DATE_FORMAT)}/`}>
              Today's log
            </Link>
          </Button>
        ) : (
          <>
            <Typography>You are logged in as a guest.</Typography>

            <Button>
              <Link href={`/sessions/${sampleLogDate}/`}>Sample log</Link>
            </Button>
          </>
        )}
      </Stack>
      <Typography
        textAlign="center"
        sx={{ width: '100%', position: 'absolute', bottom: 25, left: 0 }}
      >
        Need help? Check out the{' '}
        <MuiLink href={userGuideLink}>user guide</MuiLink>
      </Typography>
    </>
  )
}

export default Home
