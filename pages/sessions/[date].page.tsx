import SessionView from 'components/session/SessionView'
import { valiDate } from 'lib/backend/apiQueryValidationService'
import { Index } from 'lib/util'
import Record from 'models/Record'
import SessionLog from 'models/SessionLog'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'

export function getServerSideProps({ query }: GetServerSidePropsContext) {
  try {
    const date = valiDate(query.date)
    return { props: { date } }
  } catch {
    return { notFound: true }
  }
}

interface Props {
  sessionLog: SessionLog | null
  records: Index<Record>
  date: string
}
// todo: I guess a separate session number in case you want to do multiple sessions in one day
// or, add separate sessions to the same day?
export default function SessionPage({ date }: Props) {
  return (
    <>
      <Head>
        {/* this needs to be a single string or it throws a warning */}
        <title>{`Iron Log - ${date}`}</title>
      </Head>
      <SessionView {...{ date }} />
    </>
  )
}
