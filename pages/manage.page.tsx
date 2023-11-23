import { Tab, Tabs } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import useCategoryForm from '../components/manage/useCategoryForm'
import useExerciseForm from '../components/manage/useExerciseForm'
import useModifierForm from '../components/manage/useModifierForm'
import StyledDivider from '../components/StyledDivider'
import { queryTypes, useQueryState } from 'next-usequerystate'
import { useEffect, useState } from 'react'

type TabValue = 'exercises' | 'modifiers' | 'categories'
const tabs: TabValue[] = ['exercises', 'modifiers', 'categories']
let Selector: JSX.Element, Form: JSX.Element

export default function ManagePage() {
  const [urlTab, setUrlTab] = useQueryState(
    'tab',
    queryTypes.stringEnum<TabValue>(tabs).withDefault('exercises')
  )
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
      <Grid xs={12}>
        <Tabs value={urlTab} onChange={(_, value) => setUrlTab(value)} centered>
          {tabs.map((tab: TabValue) => (
            <Tab key={tab} label={tab} value={tab} />
          ))}
        </Tabs>
      </Grid>
      <Grid xs={12}>{Selector}</Grid>
      <Grid xs={12}>
        <StyledDivider />
      </Grid>
      <Grid container xs={12} justifyContent="center">
        {Form}
      </Grid>
    </Grid>
  ) : (
    <></>
  )
}
