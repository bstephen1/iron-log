import Button from '@mui/material/Button'
import MuiLink from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import type { Metadata, NextPage } from 'next'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth'
import {
  DATE_FORMAT,
  guestUserName,
  sampleLogDate,
  userGuideLink,
} from '../lib/frontend/constants'

export const metadata: Metadata = {
  title: 'Home - Iron Log',
}

const Home: NextPage = async () => {
  const user = (await getServerSession(authOptions))?.user?.name

  return (
    <>
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
