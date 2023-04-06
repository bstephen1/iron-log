import SessionView from 'components/session/SessionView'
import { getUserId } from 'lib/backend/apiMiddleware/util'
import { valiDate } from 'lib/backend/apiQueryValidationService'
import {
  fetchBodyweightHistory,
  fetchRecords,
  fetchSession,
} from 'lib/backend/mongoService'
import { arrayToIndex, Index } from 'lib/util'
import Bodyweight from 'models/Bodyweight'
import Record from 'models/Record'
import SessionLog from 'models/SessionLog'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'

export async function getServerSideProps({
  req,
  res,
  query,
}: GetServerSidePropsContext) {
  const userId = await getUserId(req, res)
  const date = valiDate(query.date)

  const sessionLogPromise = fetchSession(userId, date)
  const recordsPromise = fetchRecords({ userId, filter: { date } })
  const bodyweightPromise = fetchBodyweightHistory({
    userId,
    limit: 1,
    sort: 'newestFirst',
    filter: { type: 'official' },
  })

  return Promise.all([
    sessionLogPromise,
    recordsPromise,
    bodyweightPromise,
  ]).then(([sessionLog, recordsArray, bodyweight]) => {
    const records = arrayToIndex<Record>('_id', recordsArray)
    return { props: { sessionLog, records, bodyweight, date } }
  })
}

interface Props {
  sessionLog: SessionLog | null
  records: Index<Record>
  bodyweight: Bodyweight | null
  date: string
}
// todo: I guess a separate session number in case you want to do multiple sessions in one day
// or, add separate sessions to the same day?
export default function SessionPage(props: Props) {
  return (
    <>
      <Head>
        {/* this needs to be a single string or it throws a warning */}
        <title>{`Iron Log - ${props.date}`}</title>
      </Head>
      <main>
        <SessionView {...props} />
      </main>
    </>
  )
}
