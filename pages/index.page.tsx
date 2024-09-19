import { Button, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import {
  DATE_FORMAT,
  guestUserName,
  sampleLogDate,
  standardLinkStyle,
  userGuideLink,
} from '../lib/frontend/constants'
import {
  updateExerciseFields,
  updateRecordFields,
  updateSessionLog,
  useExercises,
  useRecords,
  useSessionLogs,
} from '../lib/frontend/restService'
import { generateId } from '../lib/util'
import Note from '../models/Note'
import { useState } from 'react'

const Home: NextPage = () => {
  const { data } = useSession()
  const user = data?.user?.name

  // todo: remove
  const [done, setDone] = useState(false)
  const { exercises } = useExercises()
  const { records } = useRecords()
  const { sessionLogs } = useSessionLogs({})
  const getNewNotes = (obj: { notes: Note[] }) =>
    obj.notes.map((n) => ({ ...n, _id: generateId() }))
  const addIds = () => {
    try {
      exercises?.forEach(
        async (e) => await updateExerciseFields(e, { notes: getNewNotes(e) }),
      )
      records?.forEach(
        async (r) => await updateRecordFields(r._id, { notes: getNewNotes(r) }),
      )
      sessionLogs?.forEach(
        async (s) => await updateSessionLog({ ...s, notes: getNewNotes(s) }),
      )
      setDone(true)
    } catch (e) {
      console.error(e)
    }
  }

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
      {/* todo: remove */}
      {!done && <Button onClick={addIds}>add id to notes</Button>}
      <Typography
        textAlign="center"
        sx={{ width: '100%', position: 'absolute', bottom: 25, left: 0 }}
      >
        Need help? Check out the{' '}
        <a href={userGuideLink} style={standardLinkStyle}>
          user guide
        </a>
      </Typography>
    </>
  )
}

export default Home
