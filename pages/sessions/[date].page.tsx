import SessionView from 'components/session/SessionView'
import { valiDate } from 'lib/backend/apiQueryValidationService'
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
  date: string
}
export default function SessionPage({ date }: Props) {
  return (
    <>
      <Head>
        {/* this needs to be a single string or it throws a warning */}
        <title>{`Iron Log - ${date}`}</title>
      </Head>
      <SessionView key={date} {...{ date }} />
    </>
  )
}
