'use client'
import { useParams } from 'next/navigation'

export const useCurrentDate = () => {
  // useParams can accept generic type but still claims it may be null (it cannot)
  // for page router compat
  const { date } = useParams() as { date: string }
  return date
}
