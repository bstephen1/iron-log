import { Tab, Tabs } from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { queryTypes, useQueryState } from 'next-usequerystate'
import { useEffect, useState } from 'react'
import CategoryForm from '../components/CategoryForm'
import ExerciseForm from '../components/ExerciseForm'
import { CategorySelector } from '../components/form-fields/selectors/CategorySelector'
import { ExerciseSelector } from '../components/form-fields/selectors/ExerciseSelector'
import { ModifierSelector } from '../components/form-fields/selectors/ModifierSelector'
import ManageWelcomeCard from '../components/ManageWelcomeCard'
import ModifierForm from '../components/ModifierForm'
import StyledDivider from '../components/StyledDivider'
import {
  updateCategoryFields,
  updateExerciseFields,
  updateModifierFields,
  useCategories,
  useExercises,
  useModifiers,
} from '../lib/frontend/restService'
import Category from '../models/Category'
import Exercise from '../models/Exercise'
import Modifier from '../models/Modifier'

type TabValue = 'exercises' | 'modifiers' | 'categories'
const tabs: TabValue[] = ['exercises', 'modifiers', 'categories']

// todo: ui element showing "changes saved". Snackbar?
// todo: delete exercise. Delete only for unused exercises?
// todo: this is really repetitive between exercise/modifier/category logic...
export default function ManagePage() {
  const { exercises, mutate: mutateExercises } = useExercises()
  const { modifiers, mutate: mutateModifiers } = useModifiers()
  const { categories, mutate: mutateCategories } = useCategories()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [modifier, setModifier] = useState<Modifier | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [tab, setTab] = useState<TabValue>('exercises')

  // useQueryState is designed to be the source of truth for state. However, it will
  // not work for tabs because SSR will always render the default value (See: https://github.com/47ng/next-usequerystate#caveats)
  // and thus if a tab other than the default is selected initially it will result in a hydration error.
  // It also seems to re-render a lot slower on updates compared to useState.
  // So instead, we will continue to store tabs in state, and have a separate urlTab state
  // which can update the default value and ripple any changes from the tab value in state.
  // Selected exercise/modifier/category names also can't use the url value because they require
  // the full object, not just the name.
  const [urlTab, setUrlTab] = useQueryState(
    'tab',
    queryTypes.stringEnum<TabValue>(tabs)
  )
  const [urlExercise, setUrlExercise] = useQueryState('exercise')
  const [urlModifier, setUrlModifier] = useQueryState('modifier')
  const [urlCategory, setUrlCategory] = useQueryState('category')

  // we HAVE to useEffect to set initial tab value. It must default to some tab, then
  // switch to the urlTab if present. It CANNOT init to the urlTab because SSR will
  // always render urlTab to its default value before being able to read the url value,
  // causing a hydration error.
  useEffect(() => {
    setTab(urlTab ? urlTab : tab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setUrlTab(tab, { scroll: false })
    // setUrlTab will never change, so it's safe to add as a dep to shut up eslint
  }, [setUrlTab, tab])

  useEffect(() => {
    // only want to set value on init
    if (!!exercise) return

    setExercise(
      exercises?.find((exercise) => exercise.name === urlExercise) ?? null
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercises])

  useEffect(() => {
    if (!!modifier) return

    setModifier(
      modifiers?.find((modifier) => modifier.name === urlModifier) ?? null
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modifiers])

  useEffect(() => {
    if (!!category) return

    setCategory(
      categories?.find((category) => category.name === urlCategory) ?? null
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories])

  /** Trigger a data fetch for exercises, and refresh the currently selected exercise. */
  const revalidateExercises = async () => {
    const updatedExercises = await mutateExercises()
    const updatedExercise =
      updatedExercises?.find((cur) => cur._id === exercise?._id) || exercise
    setExercise(updatedExercise)
  }

  const handleUpdateExercise = async (updates: Partial<Exercise>) => {
    if (!exercise) return

    const newExercise = { ...exercise, ...updates }
    await updateExerciseFields(exercise, updates)

    setExercise(newExercise)
    setUrlExercise(newExercise.name, { scroll: false })
    // mark exercises as stale and trigger revalidation
    mutateExercises()
  }

  const handleModifierUpdate = async (updates: Partial<Modifier>) => {
    if (!modifier) return

    const newModifier = { ...modifier, ...updates }
    await updateModifierFields(modifier, updates)

    mutateModifiers()
    setModifier(newModifier)
    setUrlModifier(newModifier.name, { scroll: false })

    // exercises need to be updated if name was changed
    !!updates.name && revalidateExercises()
  }

  const handleCategoryUpdate = async (updates: Partial<Category>) => {
    if (!category) return

    const newCategory = { ...category, ...updates }
    await updateCategoryFields(category, updates)

    mutateCategories()
    setCategory(newCategory)
    setUrlCategory(newCategory.name, { scroll: false })

    // exercises need to be updated if name was changed
    !!updates.name && revalidateExercises()
  }

  const TabForm = ({ tab }: { tab: TabValue }) => {
    switch (tab) {
      default:
      case 'exercises':
        return exercise ? (
          <ExerciseForm {...{ exercise, handleUpdate: handleUpdateExercise }} />
        ) : (
          <ManageWelcomeCard />
        )
      case 'modifiers':
        return modifier ? (
          <ModifierForm {...{ modifier, handleUpdate: handleModifierUpdate }} />
        ) : (
          <ManageWelcomeCard />
        )
      case 'categories':
        return category ? (
          <CategoryForm {...{ category, handleUpdate: handleCategoryUpdate }} />
        ) : (
          <ManageWelcomeCard />
        )
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} centered>
          {tabs.map((tab) => (
            <Tab key={tab} label={tab} value={tab} />
          ))}
        </Tabs>
      </Grid>
      {/* keeping the selectors in the dom when on a different tab prevents them 
            from flashing null every time the tab switches to them */}
      <Grid xs={12} sx={{ display: tab === 'exercises' ? 'block' : 'none' }}>
        <ExerciseSelector
          {...{
            exercise,
            handleChange: (exercise) => {
              setExercise(exercise)
              setUrlExercise(exercise?.name ?? null, { scroll: false })
            },
            exercises,
            mutate: mutateExercises,
            alwaysShowLoading: true,
          }}
        />
      </Grid>
      <Grid xs={12} sx={{ display: tab === 'modifiers' ? 'block' : 'none' }}>
        <ModifierSelector
          {...{
            modifier,
            handleChange: (modifier) => {
              setModifier(modifier)
              setUrlModifier(modifier?.name ?? null, { scroll: false })
            },
            modifiers,
            mutate: mutateModifiers,
            alwaysShowLoading: true,
          }}
        />
      </Grid>
      <Grid xs={12} sx={{ display: tab === 'categories' ? 'block' : 'none' }}>
        <CategorySelector
          {...{
            category,
            handleChange: (category) => {
              setCategory(category)
              setUrlCategory(category?.name ?? null, { scroll: false })
            },
            categories,
            mutate: mutateCategories,
            alwaysShowLoading: true,
          }}
        />
      </Grid>
      <Grid xs={12}>
        <StyledDivider />
      </Grid>
      <Grid container xs={12} justifyContent="center">
        <TabForm tab={tab} />
      </Grid>
    </Grid>
  )
}
