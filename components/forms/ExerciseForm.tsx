import Grid from '@mui/material/Grid'
import { enqueueSnackbar } from 'notistack'
import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import {
  addExercise,
  deleteExercise,
  updateExerciseFields,
} from '../../lib/backend/mongoService'
import {
  useCategories,
  useExercises,
  useModifiers,
  useRecords,
} from '../../lib/frontend/restService'
import { enqueueError } from '../../lib/frontend/util'
import {
  createExercise,
  type Exercise,
} from '../../models/AsyncSelectorOption/Exercise'
import { type Note } from '../../models/Note'
import ActionItems from '../form-fields/actions/ActionItems'
import AttributeCheckboxes from '../form-fields/AttributeCheckboxes'
import ComboBoxField from '../form-fields/ComboBoxField'
import EquipmentWeightField from '../form-fields/EquipmentWeightField'
import NameField from '../form-fields/NameField'
import NotesList from '../form-fields/NotesList'
import StatusSelectField from '../form-fields/StatusSelectField'

interface Props {
  exercise: Exercise
}
export default function ExerciseForm({ exercise }: Props) {
  const { _id, name, status, notes, attributes, weight } = exercise
  const { modifierNames } = useModifiers()
  const categories = useCategories()
  const { records } = useRecords({ exercise: name })
  const { exerciseNames, mutate: mutateExercises } = useExercises()
  const [_, setUrlExercise] = useQueryState('exercise')

  // We need to avoid using "exercise" or this function will always trigger child rerenders,
  // so we isolate using it within the mutate callbacks.
  const updateFields = useCallback(
    async (updates: Partial<Exercise>) => {
      const updatedExercise = await updateExerciseFields(_id, updates)

      mutateExercises(async (cur) =>
        cur?.map((exercise) =>
          exercise._id === _id ? updatedExercise : exercise
        )
      )
    },
    [_id, mutateExercises]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteExercise(id)
      setUrlExercise(null)
      mutateExercises((cur) => cur?.filter((e) => e._id !== id))
    },
    [mutateExercises, setUrlExercise]
  )

  const handleDuplicate = useCallback(
    async (id: string) => {
      mutateExercises(async (cur = []) => {
        const exercise = cur.find((e) => e._id === id)

        if (!exercise) return cur

        const newName = exercise.name + ' (copy)'
        const newExercise = createExercise(newName, exercise)

        try {
          await addExercise(newExercise)
        } catch (e) {
          enqueueError(e, `The exercise is corrupt and can't be duplicated.`)
          return cur
        }

        setUrlExercise(newName)
        enqueueSnackbar(`Duplicated as "${newName}"`, { severity: 'info' })
        return [...cur, newExercise]
      })
    },
    [mutateExercises, setUrlExercise]
  )

  return (
    <Grid container spacing={1} size={12}>
      <Grid size={12}>
        <NameField
          name={name}
          handleUpdate={updateFields}
          options={exerciseNames}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
        }}
      >
        <StatusSelectField status={status} handleUpdate={updateFields} />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
        }}
      >
        <EquipmentWeightField weight={weight} handleUpdate={updateFields} />
      </Grid>
      <Grid size={12}>
        <ComboBoxField
          label="Categories"
          initialValue={exercise.categories}
          options={categories.names}
          handleSubmit={useCallback(
            (categories: string[]) => updateFields({ categories }),
            [updateFields]
          )}
        />
      </Grid>
      <Grid size={12}>
        <ComboBoxField
          label="Modifiers"
          initialValue={exercise.modifiers}
          options={modifierNames}
          handleSubmit={useCallback(
            (modifiers: string[]) => updateFields({ modifiers }),
            [updateFields]
          )}
        />
      </Grid>
      <Grid size={12}>
        <AttributeCheckboxes
          attributes={attributes}
          handleSubmit={useCallback(
            (attributes) => updateFields({ attributes }),
            [updateFields]
          )}
        />
      </Grid>
      <Grid size={12}>
        <NotesList
          label="Notes"
          notes={notes}
          options={exercise.modifiers}
          handleSubmit={useCallback(
            (notes: Note[]) => updateFields({ notes }),
            [updateFields]
          )}
          multiple
        />
      </Grid>
      <Grid size={12}>
        <ActionItems
          id={_id}
          name={name}
          type="exercise"
          handleDelete={handleDelete}
          handleDuplicate={handleDuplicate}
          deleteDisabled={!!records?.length}
        />
      </Grid>
    </Grid>
  )
}
