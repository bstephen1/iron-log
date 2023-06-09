import { Tab, Tabs } from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
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
import { useCallback, useEffect, useState } from 'react'

type TabValue = 'exercises' | 'modifiers' | 'categories'
const tabs: TabValue[] = ['exercises', 'modifiers', 'categories']

// todo: ui element showing "changes saved". Snackbar?
// todo: delete exercise. Delete only for unused exercises?
// todo: this is really repetitive between exercise/modifier/category logic...
// todo: something about all the ignoring exhaustive deps
export default function ManagePage() {
  const { exercises, mutate: mutateExercises } = useExercises()
  const { modifiers, mutate: mutateModifiers } = useModifiers()
  const { categories, mutate: mutateCategories } = useCategories()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [modifier, setModifier] = useState<Modifier | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [tab, setTab] = useState<TabValue>('exercises')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

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
    setUrlTab(tab, { scroll: false, shallow: true })
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

  const onExerciseUpdate = async (newExercise: Exercise) => {
    setUrlExercise(newExercise.name, { scroll: false, shallow: true })
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
  // when the selected item changes (ie, the _id field).
  // Note also the forms must internally handle mutations instead of using the
  // initial value they are given, because the callback will prevent rerenders if the data changes.
  // Note: This only affects controlled form elements which need to rerender to display their changes, so
  // uncontrolled inputs are unaffected. Since modifier/category forms are simple uncontrolled inputs,
  // the parent can still handle the state.
  const Form = useCallback(
    ({ tab }: { tab: TabValue }) => {
      // console.log('callback')
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
    [category?._id, exercise?._id, modifier?._id]
  )

  const Selector = ({ tab }: { tab: TabValue }) => {
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

  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} centered>
          {tabs.map((tab) => (
            <Tab key={tab} label={tab} value={tab} />
          ))}
        </Tabs>
      </Grid>
      <Grid xs={12}>
        <Selector tab={tab} />
      </Grid>
      <Grid xs={12}>
        <StyledDivider />
      </Grid>
      <Grid container xs={12} justifyContent="center">
        <Form tab={tab} />
      </Grid>
    </Grid>
  )
}
