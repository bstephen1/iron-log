'use client'
import Grid from '@mui/material/Grid'
import { parseAsString, useQueryStates } from 'nuqs'
import { use, useState, type JSX } from 'react'
import CategorySelector from '../../components/form-fields/selectors/CategorySelector'
import ExerciseSelector from '../../components/form-fields/selectors/ExerciseSelector'
import ModifierSelector from '../../components/form-fields/selectors/ModifierSelector'
import CategoryForm from '../../components/forms/CategoryForm'
import ExerciseForm from '../../components/forms/ExerciseForm'
import ModifierForm from '../../components/forms/ModifierForm'
import StyledDivider from '../../components/StyledDivider'
import { type Category } from '../../models/AsyncSelectorOption/Category'
import { type Exercise } from '../../models/AsyncSelectorOption/Exercise'
import { type Modifier } from '../../models/AsyncSelectorOption/Modifier'
import { useQueryTab } from '../../models/TabValue'
import ManageFormTabs from './ManageFormTabs'
import ManageWelcomeCard from '../../components/ManageWelcomeCard'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let RenderForm: (props: any) => JSX.Element

interface Props {
  promises: {
    exercises: Promise<Exercise[]>
    categories: Promise<Category[]>
    modifiers: Promise<Modifier[]>
  }
}
export default function ManageFormContainer({ promises }: Props) {
  const [urlTab] = useQueryTab()
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [queryState, setQueryState] = useQueryStates({
    exercise: parseAsString,
    category: parseAsString,
    modifier: parseAsString,
  })

  const data = {
    exercises: use(promises.exercises),
    modifiers: use(promises.modifiers),
    categories: use(promises.categories),
  }

  const unfilteredExercise =
    use(promises.exercises).find(
      (exercise) => exercise.name === queryState.exercise
    ) ?? null

  const selected = {
    categories:
      use(promises.categories).find(
        (category) => category.name === queryState.category
      ) ?? null,
    modifiers:
      use(promises.modifiers).find(
        (modifier) => modifier.name === queryState.modifier
      ) ?? null,
    exercises:
      categoryFilter && !unfilteredExercise?.categories.includes(categoryFilter)
        ? null
        : unfilteredExercise,
  }

  console.log(data)

  const updateQueryState = (
    obj: { name: string } | null,
    field: keyof typeof queryState
  ) => setQueryState((prev) => ({ ...prev, [field]: obj?.name ?? null }))

  const RenderSelector = () => {
    switch (urlTab) {
      case 'exercises': {
        RenderForm = ExerciseForm
        return (
          <ExerciseSelector
            exercise={selected.exercises}
            exercises={data.exercises}
            category={categoryFilter}
            handleCategoryChange={setCategoryFilter}
            handleChange={(obj) => updateQueryState(obj, 'exercise')}
          />
        )
      }
      case 'modifiers': {
        RenderForm = ModifierForm
        return (
          <ModifierSelector
            modifier={selected.modifiers}
            modifiers={data.modifiers}
            handleChange={(obj) => updateQueryState(obj, 'modifier')}
          />
        )
      }
      case 'categories': {
        RenderForm = CategoryForm
        return (
          <CategorySelector
            category={selected.categories}
            categories={data.categories}
            handleChange={(obj) => updateQueryState(obj, 'category')}
          />
        )
      }
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <ManageFormTabs />
      </Grid>
      <Grid size={12}>
        <RenderSelector />
      </Grid>
      <Grid size={12}>
        <StyledDivider />
      </Grid>
      <Grid container justifyContent="center" size={12}>
        {urlTab && selected[urlTab] ? (
          <RenderForm {...selected} />
        ) : (
          <ManageWelcomeCard />
        )}
      </Grid>
    </Grid>
  )
}
