import SessionView from 'components/session/SessionView'
import { valiDate } from 'lib/backend/apiQueryValidationService'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { createContext, useContext } from 'react'

export function getServerSideProps({ query }: GetServerSidePropsContext) {
  try {
    const date = valiDate(query.date)
    return { props: { date } }
  } catch {
    return { notFound: true }
  }
}

const DateContext = createContext('')

/** Returns the validated date url param.
 *  Preferred over using router to fetch the raw value. */
export const useDateContext = () => useContext(DateContext)

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
      <DateContext.Provider value={date}>
        {/* Note: make sure state is properly resetting when date changes.
            Could just add key={date} here but should be more efficient to 
            find individual components that need to reset and only reset those. */}
        <SessionView />
      </DateContext.Provider>
    </>
  )
}
