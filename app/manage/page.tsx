import type { Metadata } from 'next'
import ManageFormContainer from './ManageFormContainer'

export const metadata: Metadata = {
  title: 'Manage - Iron Log',
}

export default function ManagePage() {
  return <ManageFormContainer />
}
