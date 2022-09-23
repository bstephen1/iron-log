import { Box, Button } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Box>Welcome</Box>
        <Button>
          <Link href={'/log/today/'}>
            <a>Start</a>
          </Link>
        </Button>
      </main>
    </>
  )
}

export default Home
