import { dateSchema } from '../../../models/schemas'
import SessionPage from './SessionPage'
import { notFound } from 'next/navigation'

interface Props {
  params: { date: string }
}
export default function DatePage({ params }: Props) {
  const { data: date } = dateSchema.safeParse(params.date)

  if (!date) {
    notFound()
  }

  return <SessionPage date={date} />
}
