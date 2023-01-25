import { Container, Tab, Tabs } from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { useState } from 'react'
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

// todo: ui element showing "changes saved". Snackbar?
// todo: add/delete exercise. Delete only for unused exercises?
export default function ManagePage() {
  const { exercises, mutate: mutateExercises } = useExercises({})
  const { modifiers, mutate: mutateModifiers } = useModifiers()
  const { categories, mutate: mutateCategories } = useCategories()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [modifier, setModifier] = useState<Modifier | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [tabValue, setTabValue] = useState(0)
  const tabContent = [
    { label: 'Exercises' },
    { label: 'Modifiers' },
    { label: 'Categories' },
  ]

  // todo: move inside form, and only have a watcher here for new values
  const handleUpdateExercise = async (updates: Partial<Exercise>) => {
    if (!exercise) return

    const newExercise = { ...exercise, ...updates }
    await updateExerciseFields(exercise, updates)
    // todo: not sure I like this... can we just mutate the selected exercise?
    const newExercises = exercises?.map((exercise) =>
      exercise._id === newExercise._id ? newExercise : exercise
    )
    mutateExercises(newExercises)
    setExercise(newExercise)
  }

  // todo: after updating modifier, have to update exercise
  const handleModifierUpdate = async (updates: Partial<Modifier>) => {
    if (!modifier) return

    // todo: mutate exercise to display new modifier name without having to reload page or swap exercises
    // if (exercise && updates.name) {
    //   const typescriptIsStupid = updates.name
    //   const newExercise = { ...exercise }
    //   newExercise.modifiers = newExercise.modifiers.map(name => name === modifier.name ? typescriptIsStupid : name)
    //   newExercise.notes = newExercise.notes.map(note => note.tags = note.tags.map(tag => tag === modifier.name ? typescriptIsStupid : tag))
    //   console.log(newExercise);
    //   setExercise(newExercise)
    // }

    const newModifier = { ...modifier, ...updates }
    const newModifiers = modifiers?.map((modifier) =>
      modifier._id === newModifier._id ? newModifier : modifier
    )
    await updateModifierFields(modifier, updates)
    mutateModifiers(newModifiers)
    setModifier(newModifier)
    // mutateExercises().then(() => setExercise(exercises?.find(revalidated => revalidated._id === exercise?._id) || null))
  }

  const handleCategoryUpdate = async (updates: Partial<Category>) => {
    if (!category) return

    const newCategory = { ...category, ...updates }
    const newCategories = categories?.map((category) =>
      category._id === newCategory._id ? newCategory : category
    )
    await updateCategoryFields(category, updates)
    mutateCategories(newCategories)
    setCategory(newCategory)
  }

  const renderForm = () => {
    switch (tabValue) {
      case 0:
        return exercise ? (
          <ExerciseForm {...{ exercise, handleUpdate: handleUpdateExercise }} />
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

  // todo: names should be case insensitive. 'Squats' === 'squats'
  return (
    <Container maxWidth="md">
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
        <Grid xs={12}>
          {tabValue === 0 && (
            <ExerciseSelector
              {...{
                exercise,
                handleChange: setExercise,
                exercises,
                mutate: mutateExercises,
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
        <Grid xs={12}>
          <StyledDivider />
        </Grid>
        <Grid container xs={12} justifyContent="center">
          {renderForm()}
        </Grid>
      </Grid>
    </Container>
  )
}
