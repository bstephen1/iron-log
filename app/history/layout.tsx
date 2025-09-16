import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'History - Iron Log',
}

export default function layout({ children }: { children: ReactNode }) {
  return children
}
