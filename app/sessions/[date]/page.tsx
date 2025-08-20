import { dateSchema } from '../../../models/schemas'
import SessionPage from './SessionPage'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ date: string }>
}
export default async function DatePage({ params }: Props) {
  const { data: date } = dateSchema.safeParse((await params).date)

  if (!date) {
    notFound()
  }

  return <SessionPage date={date} />
}
