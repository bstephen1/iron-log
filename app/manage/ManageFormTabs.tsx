'use client'

import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { type TabValue, tabValues, useQueryTab } from '../../models/TabValue'

export default function ManageFormTabs() {
  const [urlTab, setUrlTab] = useQueryTab()
  return (
    <Tabs
      value={urlTab ?? 'exercises'}
      onChange={(_, value: (typeof tabValues)[number]) => setUrlTab(value)}
      centered
    >
      {tabValues.map((tab: TabValue) => (
        <Tab key={tab} label={tab} value={tab} />
      ))}
    </Tabs>
  )
}
