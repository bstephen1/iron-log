import SessionView from 'components/session/SessionView'
import { valiDate } from 'lib/backend/apiQueryValidationService'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useState } from 'react'

export function getServerSideProps({ query }: GetServerSidePropsContext) {
  try {
    const date = valiDate(query.date)
    return { props: { date } }
  } catch {
    return { notFound: true }
  }
}

interface Props {
  date: string
}
export default function SessionPage(props: Props) {
  // DatePicker changes date by pushing to router.
  // This introduces a fairly significant lag between changing the date and actually
  // seeing the records update on screen. To mitigate this we use state after the initial load.
  // Whenever anything within the page changes the date it should push to router but also update state.
  const [date, setDate] = useState(props.date)
  return (
    <>
      <Head>
        {/* this needs to be a single string or it throws a warning */}
        <title>{`Iron Log - ${date}`}</title>
      </Head>
      <SessionView key={date} {...{ date, setDate }} />
    </>
  )
}
