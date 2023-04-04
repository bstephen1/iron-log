import SessionView from 'components/session/SessionView'
import { getUserId } from 'lib/backend/apiMiddleware/util'
import { valiDate } from 'lib/backend/apiQueryValidationService'
import { fetchRecord, fetchSession } from 'lib/backend/mongoService'
import { validDateStringRegex } from 'lib/frontend/constants'
import Record from 'models/Record'
import SessionLog from 'models/SessionLog'
import { GetServerSidePropsContext } from 'next'
import Error from 'next/error'
import Head from 'next/head'
import { useRouter } from 'next/router'

export async function getServerSideProps({
  req,
  res,
  query,
}: GetServerSidePropsContext) {
  const userId = await getUserId(req, res)
  const date = valiDate(query.date)
  const sessionLog = await fetchSession(userId, date)
  const records = await Promise.all(
    sessionLog?.records.map((id) => fetchRecord(userId, id)) || []
  )

  return { props: { sessionLog, records } }
}

interface Props {
  sessionLog: SessionLog
  records: Record[]
}
// I guess a separate session number in case you want to do multiple sessions in one day
// or, add separate sessions to the same day?
export default function SessionPage({ sessionLog, records }: Props) {
  const router = useRouter()
  const { date } = router.query

  // first render has an empty router.query object
  if (!date) {
    return <></>
  }

  // it won't ever not be a string but need to make typescript happy
  if (typeof date !== 'string' || !date.match(validDateStringRegex)) {
    return <Error statusCode={400} />
  }

  return (
    <>
      <Head>
        <title>Record for {date}</title>
      </Head>
      <main>
        <SessionView sessionLog={sessionLog} records={records} />
      </main>
    </>
  )
}
