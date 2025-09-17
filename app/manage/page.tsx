import type { Metadata } from 'next'
import { Suspense } from 'react'
import ManageFormContainer from './ManageFormContainer'

export const metadata: Metadata = {
  title: 'Manage - Iron Log',
}

export default function ManagePage() {
  return (
    <Suspense>
      <ManageFormContainer />
    </Suspense>
  )
}
