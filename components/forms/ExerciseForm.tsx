import Grid from '@mui/material/Grid2'
import { useQueryState } from 'nuqs'
import { useCallback } from 'react'
import {
  addExercise,
  deleteExercise,
  useCategories,
  useExercises,
  useModifiers,
  useRecords,
} from '../../lib/frontend/restService'
import {
  createExercise,
  Exercise,
} from '../../models/AsyncSelectorOption/Exercise'
import { Note } from '../../models/Note'
import ActionItems from '../form-fields/actions/ActionItems'
import AttributeCheckboxes from '../form-fields/AttributeCheckboxes'
import ComboBoxField from '../form-fields/ComboBoxField'
import EquipmentWeightField from '../form-fields/EquipmentWeightField'
import NameField from '../form-fields/NameField'
import NotesList from '../form-fields/NotesList'
import StatusSelectField from '../form-fields/StatusSelectField'
import { enqueueError } from '../../lib/util'

interface Props {
  exercise: Exercise
  handleUpdate: (id: string, updates: Partial<Exercise>) => void
}
export default function ExerciseForm({ exercise, handleUpdate }: Props) {
  const {
    _id,
    name,
    status,
    modifiers,
    notes,
    attributes,
    categories,
    weight,
  } = exercise
  const { modifierNames } = useModifiers()
  const { categoryNames } = useCategories()
  const { records } = useRecords({ exercise: name })
  const { exerciseNames, mutate: mutateExercises } = useExercises()
  const [_, setUrlExercise] = useQueryState('exercise')

  const updateFields = useCallback(
    (updates: Partial<Exercise>) => handleUpdate(_id, updates),
    [_id, handleUpdate]
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
          initialValue={categories}
          options={categoryNames}
          handleSubmit={useCallback(
            (categories: string[]) => updateFields({ categories }),
            [updateFields]
          )}
        />
      </Grid>
      <Grid size={12}>
        <ComboBoxField
          label="Modifiers"
          initialValue={modifiers}
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
          options={modifiers}
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
