import SessionView from 'components/session/SessionView'
import { validDateStringRegex } from 'lib/frontend/constants'
import Head from 'next/head'
import { useRouter } from 'next/router'

// todo: I guess a separate session number in case you want to do multiple sessions in one day
// or, add separate sessions to the same day?
export default function SessionPage() {
  const router = useRouter()
  const { date } = router.query

  // in first render router.query is an empty object
  if (!date) {
    return <></>
  }

  // it won't ever not be a string but need to make typescript happy
  if (typeof date !== 'string' || !date.match(validDateStringRegex)) {
    return <></>
  }

  return (
    <>
      <Head>
        {/* this needs to be a single string or it throws a warning */}
        <title>{`Iron Log - ${date}`}</title>
      </Head>
      <main>
        <SessionView date={date} />
      </main>
    </>
  )
}
