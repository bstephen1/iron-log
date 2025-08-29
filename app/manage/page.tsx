import { Suspense } from 'react'
import ManageFormContainer from './ManageFormContainer'

export default function ManagePage() {
  return (
    <Suspense>
      <ManageFormContainer />
    </Suspense>
  )
}
