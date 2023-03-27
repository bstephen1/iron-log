import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { DATE_FORMAT } from '../../lib/frontend/constants'

export default function Page() {
  const router = useRouter()

  // need to wrap router.push in a useEffect because otherwise it would try to
  // render serverside and cause an error since the router doesn't exist yet.
  useEffect(() => {
    const today = dayjs().format(DATE_FORMAT)
    router.push(`sessions/${today}`)
  }, [router])

  return <></>
}
