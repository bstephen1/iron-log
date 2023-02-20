import { Box, Button } from '@mui/material'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { DATE_FORMAT } from '../lib/frontend/constants'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Iron Log</title>
        <meta name="description" content="An app for recording your training" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Box>Welcome</Box>
        <Button>
          <Link href={`/sessions/${dayjs().format(DATE_FORMAT)}/`}>
            Today's Log
          </Link>
        </Button>
      </main>
    </>
  )
}

export default Home
