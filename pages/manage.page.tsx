import { Tab, Tabs } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { JSX, memo, useEffect, useState } from 'react'
import StyledDivider from '../components/StyledDivider'
import useCategoryForm from '../components/forms/useCategoryForm'
import useExerciseForm from '../components/forms/useExerciseForm'
import useModifierForm from '../components/forms/useModifierForm'
import { TabValue, tabValues, useQueryTab } from '../models/TabValue'

let Selector: JSX.Element, Form: JSX.Element

const RenderTabs = memo(function RenderTabs() {
  const [urlTab, setUrlTab] = useQueryTab()

  return (
    <Tabs value={urlTab} onChange={(_, value) => setUrlTab(value)} centered>
      {tabValues.map((tab: TabValue) => (
        <Tab key={tab} label={tab} value={tab} />
      ))}
    </Tabs>
  )
})

export default function ManagePage() {
  const [urlTab] = useQueryTab()
  const [isFirstRender, setIsFirstRender] = useState(true)

  const { Form: CategoryForm, Selector: CategorySelector } = useCategoryForm()
  const { Form: ModifierForm, Selector: ModifierSelector } = useModifierForm()
  const { Form: ExerciseForm, Selector: ExerciseSelector } = useExerciseForm()

  switch (urlTab) {
    case 'exercises': {
      Selector = ExerciseSelector
      Form = ExerciseForm
      break
    }
    case 'modifiers': {
      Selector = ModifierSelector
      Form = ModifierForm
      break
    }
    case 'categories': {
      Selector = CategorySelector
      Form = CategoryForm
      break
    }
  }

  useEffect(() => {
    setIsFirstRender(false)
  }, [])

  // Must disable SSR to useQueryState or there will be hydration errors
  // since router is not available server side.
  return !isFirstRender ? (
    <Grid container spacing={2}>
      <Grid size={12}>
        <RenderTabs />
      </Grid>
      <Grid size={12}>{Selector}</Grid>
      <Grid size={12}>
        <StyledDivider />
      </Grid>
      <Grid container justifyContent="center" size={12}>
        {Form}
      </Grid>
    </Grid>
  ) : (
    <></>
  )
}
