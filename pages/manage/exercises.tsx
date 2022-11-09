import { Tab, Tabs } from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { useState } from 'react'
import CategoryForm from '../../components/CategoryForm'
import ExerciseForm from '../../components/ExerciseForm'
import { CategorySelector } from '../../components/form-fields/selectors/CategorySelector'
import { ExerciseSelector } from '../../components/form-fields/selectors/ExerciseSelector'
import { ModifierSelector } from '../../components/form-fields/selectors/ModifierSelector'
import ManageWelcomeCard from '../../components/ManageWelcomeCard'
import ModifierForm from '../../components/ModifierForm'
import StyledDivider from '../../components/StyledDivider'
import {
  updateExerciseField,
  useCategories,
  useExercises,
  useModifiers,
} from '../../lib/frontend/restService'
import Category from '../../models/Category'
import Exercise from '../../models/Exercise'
import Modifier from '../../models/Modifier'

// todo: disable form stuff when no changes
// todo: ui element showing "changes saved". Snackbar?
// todo: add/delete exercise. Delete only for unused exercises?
// todo: filter exercise list by status?
export default function ManageExercisesPage() {
  const { exercises, mutate } = useExercises({})
  const { modifiers, mutate: mutateModifiers } = useModifiers()
  const { categories, mutate: mutateCategories } = useCategories()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [modifier, setModifier] = useState<Modifier | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [tabValue, setTabValue] = useState(0)
  const tabContent = [
    { label: 'Exercises', selector: ExerciseSelector },
    { label: 'Modifiers', selector: null },
    { label: 'Categories', selector: null },
  ]

  // todo: move inside form, and only have a watcher here for new values
  const handleUpdate = <T extends keyof Exercise>(
    field: T,
    value: Exercise[T]
  ) => {
    if (!exercise) return

    console.log(`updating ${field}: ${value}`)
    const newExercise = { ...exercise, [field]: value }
    updateExerciseField(exercise, field, value)
    // todo: not sure I like this... can we just mutate the selected exercise?
    const newExercises = exercises?.map((exercise) =>
      exercise._id === newExercise._id ? newExercise : exercise
    )
    mutate(newExercises)
    setExercise(newExercise)
  }

  const handleModifierUpdate = <T extends keyof Modifier>(
    field: T,
    value: Modifier[T]
  ) => {
    const newModifier = { ...modifier, [field]: value }
  }

  const handleCategoryUpdate = <T extends keyof Category>(
    field: T,
    value: Category[T]
  ) => {
    const newCategory = { ...category, [field]: value }
  }

  const renderForm = () => {
    switch (tabValue) {
      case 0:
        return exercise ? (
          <ExerciseForm {...{ exercise, handleUpdate }} />
        ) : (
          <ManageWelcomeCard />
        )
      case 1:
        return modifier ? (
          <ModifierForm {...{ modifier, handleUpdate: handleModifierUpdate }} />
        ) : (
          <ManageWelcomeCard />
        )
      case 2:
        return category ? (
          <CategoryForm {...{ category, handleUpdate: handleCategoryUpdate }} />
        ) : (
          <ManageWelcomeCard />
        )
    }
  }

  // todo: move autocomplete to a component for this + session view
  // todo: when typing, if string becomes empty it disables the form, even if not submitted
  // todo: names should be case insensitive. 'Squats' === 'squats'
  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Tabs
          value={tabValue}
          onChange={(_, value) => setTabValue(value)}
          centered
        >
          {tabContent.map((tab) => (
            <Tab key={tab.label} label={tab.label} />
          ))}
        </Tabs>
      </Grid>
      <Grid xs={12} md={3}>
        {/* @ts-ignore  withAsync() has renderInput prop */}
        {tabValue === 0 && (
          <ExerciseSelector
            {...{
              exercise,
              handleChange: setExercise,
              exercises,
              mutate,
            }}
          />
        )}
        {tabValue === 1 && (
          <ModifierSelector
            {...{
              modifier,
              handleChange: setModifier,
              modifiers,
              mutate: mutateModifiers,
            }}
          />
        )}
        {tabValue === 2 && (
          <CategorySelector
            {...{
              category,
              handleChange: setCategory,
              categories,
              mutate: mutateCategories,
            }}
          />
        )}
      </Grid>
      {/* todo: vertical on md */}
      <Grid xs={12} md={1}>
        <StyledDivider />
      </Grid>
      <Grid container xs={12} md={8} justifyContent="center">
        {renderForm()}
      </Grid>
    </Grid>
  )
}
