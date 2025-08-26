'use client'
import Grid from '@mui/material/Grid'
import { parseAsString, useQueryStates } from 'nuqs'
import { type ReactNode, useState } from 'react'
import CategorySelector from '../../components/form-fields/selectors/CategorySelector'
import ExerciseSelector from '../../components/form-fields/selectors/ExerciseSelector'
import ModifierSelector from '../../components/form-fields/selectors/ModifierSelector'
import CategoryForm from '../../components/forms/CategoryForm'
import ExerciseForm from '../../components/forms/ExerciseForm'
import ModifierForm from '../../components/forms/ModifierForm'
import ManageWelcomeCard from '../../components/ManageWelcomeCard'
import StyledDivider from '../../components/StyledDivider'
import {
  useCategories,
  useExercises,
  useModifiers,
} from '../../lib/frontend/restService'
import { type TabValue, useQueryTab } from '../../models/TabValue'
import ManageFormTabs from './ManageFormTabs'

// todo: need to add mutate
const getComponents = (
  tab: TabValue | null
): {
  field: 'modifier' | 'category' | 'exercise'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Selector: (props: any) => ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Form: (props: any) => ReactNode
} => {
  switch (tab) {
    case 'modifiers':
      return {
        Selector: ModifierSelector,
        Form: ModifierForm,
        field: 'modifier' as const,
      }
    case 'categories':
      return {
        Selector: CategorySelector,
        Form: CategoryForm,
        field: 'category' as const,
      }
    default:
      return {
        Selector: ExerciseSelector,
        Form: ExerciseForm,
        field: 'exercise' as const,
      }
  }
}

export default function ManageFormContainer() {
  const [urlTab] = useQueryTab()
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [queryState, setQueryState] = useQueryStates({
    exercise: parseAsString,
    category: parseAsString,
    modifier: parseAsString,
  })
  const categories = useCategories()
  const { data: exercises } = useExercises()
  const modifiers = useModifiers()

  const unfilteredExercise =
    exercises.find((exercise) => exercise._id === queryState.exercise) ?? null

  const selected = {
    category:
      categories.data.find(
        (category) => category._id === queryState.category
      ) ?? null,
    modifier:
      modifiers.data.find((modifier) => modifier._id === queryState.modifier) ??
      null,
    exercise:
      categoryFilter && !unfilteredExercise?.categories.includes(categoryFilter)
        ? null
        : unfilteredExercise,
  }

  const updateQueryState = (
    obj: { _id: string } | null,
    field: keyof typeof queryState
  ) => setQueryState((prev) => ({ ...prev, [field]: obj?._id ?? null }))

  const { Selector, Form, field } = getComponents(urlTab)

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <ManageFormTabs />
      </Grid>
      <Grid size={12}>
        <Selector
          {...selected}
          {...{
            handleChange: (obj: { _id: string } | null) =>
              updateQueryState(obj, field),
            categoryFilter,
            handleCategoryFilterChange: setCategoryFilter,
          }}
        />
      </Grid>
      <Grid size={12}>
        <StyledDivider />
      </Grid>
      <Grid container justifyContent="center" size={12}>
        {!selected[field] ? <ManageWelcomeCard /> : <Form {...selected} />}
      </Grid>
    </Grid>
  )
}
