import { Tab, Tabs } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import CategoryForm from 'components/CategoryForm'
import ExerciseForm from 'components/ExerciseForm'
import CategorySelector from 'components/form-fields/selectors/CategorySelector'
import ExerciseSelector from 'components/form-fields/selectors/ExerciseSelector'
import ModifierSelector from 'components/form-fields/selectors/ModifierSelector'
import ManageWelcomeCard from 'components/ManageWelcomeCard'
import ModifierForm from 'components/ModifierForm'
import StyledDivider from 'components/StyledDivider'
import {
  updateCategoryFields,
  updateModifierFields,
  useCategories,
  useExercises,
  useModifiers,
} from 'lib/frontend/restService'
import Category from 'models/Category'
import Exercise from 'models/Exercise'
import Modifier from 'models/Modifier'
import { queryTypes, useQueryState } from 'next-usequerystate'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

type TabValue = 'exercises' | 'modifiers' | 'categories'
const tabs: TabValue[] = ['exercises', 'modifiers', 'categories']

// todo: ui element showing "changes saved". Snackbar?
// todo: delete exercise. Delete only for unused exercises?
// todo: this is really repetitive between exercise/modifier/category logic...
export default function ManagePage() {
  // Must wait for router to be ready for useQueryState, or there will be hydration errors. Router is not available server side.
  const { isReady } = useRouter()
  const { exercises, mutate: mutateExercises } = useExercises()
  const { modifiers, mutate: mutateModifiers } = useModifiers()
  const { categories, mutate: mutateCategories } = useCategories()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [modifier, setModifier] = useState<Modifier | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

  const [urlTab, setUrlTab] = useQueryState(
    'tab',
    queryTypes.stringEnum<TabValue>(tabs)
  )
  // Url values other than urlTab are only used to set the initial value.
  // These need access to their full object instead of just a string.
  const [urlExercise, setUrlExercise] = useQueryState('exercise')
  const [urlModifier, setUrlModifier] = useQueryState('modifier')
  const [urlCategory, setUrlCategory] = useQueryState('category')

  // setup initial state values when SWR is done loading if a url value exists
  useEffect(() => {
    if (!!exercise || !exercises || !urlExercise) return

    setExercise(
      exercises.find((exercise) => exercise.name === urlExercise) ?? null
    )
  }, [exercise, exercises, urlExercise])

  useEffect(() => {
    if (!!modifier || !modifiers || !urlModifier) return

    setModifier(
      modifiers.find((modifier) => modifier.name === urlModifier) ?? null
    )
  }, [modifier, modifiers, urlModifier])

  useEffect(() => {
    if (!!category || !categories || !urlCategory) return

    setCategory(
      categories.find((category) => category.name === urlCategory) ?? null
    )
  }, [categories, category, urlCategory])

  /** Trigger a data fetch for exercises, and refresh the currently selected exercise. */
  const revalidateExercises = async () => {
    const updatedExercises = await mutateExercises()
    const updatedExercise =
      updatedExercises?.find((cur) => cur._id === exercise?._id) || exercise
    setExercise(updatedExercise)
  }

  const onExerciseUpdate = async (newExercise: Exercise) => {
    setUrlExercise(newExercise.name, { scroll: false, shallow: true })
    // updates ExerciseSelector if the name has changed
    setExercise(newExercise)
  }

  const handleModifierUpdate = async (updates: Partial<Modifier>) => {
    if (!modifier) return

    const newModifier = { ...modifier, ...updates }
    setModifier(newModifier)
    setUrlModifier(newModifier.name, { scroll: false, shallow: true })

    await updateModifierFields(modifier, updates)
    mutateModifiers()

    // exercises need to be updated if name was changed
    !!updates.name && revalidateExercises()
  }

  const handleCategoryUpdate = async (updates: Partial<Category>) => {
    if (!category) return

    const newCategory = { ...category, ...updates }
    setCategory(newCategory)
    setUrlCategory(newCategory.name, { scroll: false, shallow: true })

    await updateCategoryFields(category, updates)
    mutateCategories()

    // exercises need to be updated if name was changed
    !!updates.name && revalidateExercises()
  }

  // useCallback is crucial here. It prevents the entire form from resetting whenever
  // the swr arrays (useExercises, etc) are revalidated. The form should only be rerendered
  // when the selected item changes (ie, the name field).
  // Note also the forms must internally handle mutations instead of using the
  // initial value they are given, because the callback will prevent rerenders if the data changes.
  const Form = useCallback(
    ({ tab }: { tab: TabValue | null }) => {
      switch (tab) {
        default:
        case 'exercises':
          return exercise ? (
            <ExerciseForm
              {...{
                initialExercise: exercise,
                onUpdate: onExerciseUpdate,
              }}
            />
          ) : (
            <ManageWelcomeCard />
          )
        case 'modifiers':
          return modifier ? (
            <ModifierForm
              {...{ modifier, handleUpdate: handleModifierUpdate }}
            />
          ) : (
            <ManageWelcomeCard />
          )
        case 'categories':
          return category ? (
            <CategoryForm
              {...{ category, handleUpdate: handleCategoryUpdate }}
            />
          ) : (
            <ManageWelcomeCard />
          )
      }
    },
    // todo: consider declaring the functions with useRef. Only thing would be I'd prefer to use an immutable ref but not sure that's possible
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category?.name, exercise?.name, modifier?.name]
  )

  const Selector = ({ tab }: { tab: TabValue | null }) => {
    switch (tab) {
      default:
      case 'exercises':
        return (
          <ExerciseSelector
            {...{
              exercise,
              handleChange: (exercise) => {
                setExercise(exercise)
                setUrlExercise(exercise?.name ?? null, {
                  scroll: false,
                  shallow: true,
                })
              },
              exercises,
              mutate: mutateExercises,
              alwaysShowLoading: true,
              category: categoryFilter,
              handleCategoryChange: setCategoryFilter,
            }}
          />
        )
      case 'modifiers':
        return (
          <ModifierSelector
            {...{
              modifier,
              handleChange: (modifier) => {
                setModifier(modifier)
                setUrlModifier(modifier?.name ?? null, {
                  scroll: false,
                  shallow: true,
                })
              },
              modifiers,
              mutate: mutateModifiers,
            }}
          />
        )
      case 'categories':
        return (
          <CategorySelector
            {...{
              category,
              handleChange: (category) => {
                setCategory(category)
                setUrlCategory(category?.name ?? null, {
                  scroll: false,
                  shallow: true,
                })
              },
              categories,
              mutate: mutateCategories,
            }}
          />
        )
    }
  }

  return isReady ? (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Tabs
          value={urlTab ?? 'exercises'}
          onChange={(_, value) => setUrlTab(value)}
          centered
        >
          {tabs.map((tab: TabValue) => (
            <Tab key={tab} label={tab} value={tab} />
          ))}
        </Tabs>
      </Grid>
      <Grid xs={12}>
        <Selector tab={urlTab} />
      </Grid>
      <Grid xs={12}>
        <StyledDivider />
      </Grid>
      <Grid container xs={12} justifyContent="center">
        <Form tab={urlTab} />
      </Grid>
    </Grid>
  ) : (
    <></>
  )
}
