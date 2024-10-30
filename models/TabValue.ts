import { parseAsStringEnum, useQueryState } from 'next-usequerystate'

export type TabValue = (typeof tabValues)[number]
export const tabValues = ['exercises', 'modifiers', 'categories'] as const

/** small wrapper for useQueryState with the value "tab" to retrieve the tab with proper enum typing */
export function useQueryTab() {
  return useQueryState(
    'tab',
    parseAsStringEnum<TabValue>([...tabValues]).withDefault('exercises')
  )
}
