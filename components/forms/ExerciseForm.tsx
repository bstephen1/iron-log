import Grid from '@mui/material/Grid'
import { enqueueSnackbar } from 'notistack'
import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import {
  useCategories,
  useExerciseAdd,
  useExerciseDelete,
  useExercises,
  useExerciseUpdate,
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
  const modifiers = useModifiers()
  const categories = useCategories()
  const { data: records } = useRecords({ exercise: name })
  const exercises = useExercises()
  const updateExercise = useExerciseUpdate()
  const deleteExercise = useExerciseDelete()
  const addExercise = useExerciseAdd()
  const [_, setUrlExercise] = useQueryState('exercise')

  // We need to avoid using "exercise" or this function will always trigger child rerenders,
  // so we isolate using it within the mutate callbacks.
  const updateFields = useCallback(
    async (updates: Partial<Exercise>) => {
      updateExercise({ _id, updates })
    },
    [_id, updateExercise]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      setUrlExercise(null)
      deleteExercise(id)
    },
    [deleteExercise, setUrlExercise]
  )

  const handleDuplicate = useCallback(async () => {
    const newName = exercise.name + ' (copy)'
    const newExercise = createExercise(newName, exercise)

    addExercise(newExercise, {
      onError: (e) =>
        enqueueError(`The exercise is corrupt and can't be duplicated.`, e),
      onSuccess: () => {
        enqueueSnackbar(`Duplicated as "${newName}"`, { severity: 'info' })
        setUrlExercise(newExercise._id, { scroll: true })
      },
    })
  }, [addExercise, exercise, setUrlExercise])

  return (
    <Grid container spacing={1} size={12}>
      <Grid size={12}>
        <NameField
          name={name}
          handleUpdate={updateFields}
          options={exercises.names}
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
          options={modifiers.names}
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
