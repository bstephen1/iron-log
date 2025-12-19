'use client'
import Grid from '@mui/material/Grid'
import { parseAsString, useQueryStates } from 'nuqs'
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
} from '../../lib/frontend/data/useQuery'
import { type TabValue, useQueryTab } from '../../models/TabValue'
import ManageFormTabs from './ManageFormTabs'

const getComponents = (
  tab: TabValue | null
): {
  field: 'modifier' | 'category' | 'exercise'
  Selector:
    | typeof ModifierSelector
    | typeof CategorySelector
    | typeof ExerciseSelector
  Form: typeof ModifierForm | typeof CategoryForm | typeof ExerciseForm
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
  const [queryState, setQueryState] = useQueryStates({
    exercise: parseAsString,
    category: parseAsString,
    modifier: parseAsString,
  })
  const categories = useCategories()
  const exercises = useExercises()
  const modifiers = useModifiers()

  const selected = {
    category:
      categories.find((category) => category._id === queryState.category) ??
      null,
    modifier:
      modifiers.find((modifier) => modifier._id === queryState.modifier) ??
      null,
    exercise:
      exercises.find((exercise) => exercise._id === queryState.exercise) ??
      null,
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
          }}
        />
      </Grid>
      <Grid size={12}>
        <StyledDivider />
      </Grid>
      <Grid container justifyContent="center" size={12}>
        {!selected[field] ? (
          <ManageWelcomeCard />
        ) : (
          // @ts-expect-error the type is correct but not inferrable
          <Form {...selected} />
        )}
      </Grid>
    </Grid>
  )
}
