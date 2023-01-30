import {
  Delete,
  FitnessCenter,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fab,
  Skeleton,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useSwiper, useSwiperSlide } from 'swiper/react'
import {
  updateExerciseFields,
  updateRecordFields,
  useExercises,
  useRecord,
} from '../../lib/frontend/restService'
import Exercise from '../../models/Exercise'
import Note from '../../models/Note'
import Record from '../../models/Record'
import Set from '../../models/Set'
import { Status } from '../../models/Status'
import { ComboBoxField } from '../form-fields/ComboBoxField'
import { ExerciseSelector } from '../form-fields/selectors/ExerciseSelector'
import StyledDivider from '../StyledDivider'
import RecordHeaderButton from './RecordHeaderButton'
import RecordNotesDialogButton from './RecordNotesDialogButton'
import SetHeader from './SetHeader'
import SetInput from './SetInput'

interface Props {
  id: Record['_id']
  deleteRecord: (id: string) => Promise<void>
  swapRecords: (i: number, j: number) => Promise<void>
  swiperIndex: number
}
export default function RecordCard({
  id,
  deleteRecord,
  swapRecords,
  swiperIndex,
}: Props) {
  const swiper = useSwiper()
  // this hook needs to be called for useSwiper() to update the activeIndex, but is otherwise unused
  const _ = useSwiperSlide()
  const theme = useTheme()
  const noSwipingAboveSm = useMediaQuery(theme.breakpoints.up('sm'))
    ? 'swiper-no-swiping'
    : ''
  const { record, isError, mutate: mutateRecord } = useRecord(id)
  const { exercises, mutate: mutateExercises } = useExercises({
    status: Status.active,
  })

  // error / loading states repeat a bit of styling from the live record card.
  if (isError) {
    console.error('Could not fetch record!')
    return (
      <Card elevation={3} sx={{ px: 1 }}>
        <CardHeader
          title={`Record ${swiperIndex + 1}`}
          titleTypographyProps={{ variant: 'h6' }}
        />
        <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />

        <CardContent sx={{ justifyContent: 'center', display: 'flex' }}>
          <Box>Error: Could not fetch record.</Box>
        </CardContent>
      </Card>
    )
  } else if (record === undefined) {
    return (
      <Card elevation={3} sx={{ px: 1 }}>
        <CardHeader
          title={`Record ${swiperIndex + 1}`}
          titleTypographyProps={{ variant: 'h6' }}
        />
        <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />

        <CardContent>
          <Skeleton height="50px" />
          <Skeleton height="50px" />
          <Skeleton height="50px" />
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
          <Skeleton variant="circular" height="50px" width="50px" />
        </CardActions>
      </Card>
    )
    // this shouldn't ever happen
  } else if (record === null) {
    return (
      <Card elevation={3} sx={{ px: 1 }}>
        <CardHeader
          title={`Record ${swiperIndex + 1}`}
          titleTypographyProps={{ variant: 'h6' }}
        />
        <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />

        <CardContent>
          <Box>Could not find record {id}</Box>
        </CardContent>
      </Card>
    )
  }

  // define after null checks so record must exist
  const { exercise, activeModifiers, sets, fields, notes, _id } = record

  const addSet = async () => {
    const newSet = sets[sets.length - 1]
      ? { ...sets[sets.length - 1], effort: undefined }
      : ({} as Set)

    await updateRecordFields(_id, { [`sets.${sets.length}`]: newSet })
    mutateRecord({ ...record, sets: sets.concat(newSet) })
  }

  const handleFieldChange = async (changes: Partial<Record>) => {
    await updateRecordFields(_id, { ...changes })
    mutateRecord({ ...record, ...changes })
  }

  const handleExerciseNotesChange = async (notes: Note[]) => {
    if (!exercise) return

    await updateExerciseFields(exercise, { notes })
    mutateRecord({ ...record, exercise: { ...exercise, notes } })
  }

  const handleSetChange = async (changes: Partial<Set>, i: number) => {
    await updateRecordFields(_id, { [`sets.${i}`]: { ...sets[i], ...changes } })
    const newSets = [...record.sets]
    newSets[i] = { ...newSets[i], ...changes }
    mutateRecord({ ...record, sets: newSets })
  }

  const handleDeleteSet = async (i: number) => {
    const newSets = record.sets.filter((_, j) => j !== i)
    await updateRecordFields(_id, { ['sets']: newSets })
    mutateRecord({ ...record, sets: newSets })
  }

  const handleDeleteRecord = async () => {
    await deleteRecord(id)
    swiper.update() // have to update swiper whenever changing swiper elements
  }

  const handleSwapRecords = async (i: number, j: number) => {
    await swapRecords(i, j)
    swiper.update()
    // todo: think about animation here. Instant speed? Maybe if it could change to a fade transition?
    swiper.slideTo(j, 0)
  }

  const handleExerciseChange = async (newExercise: Exercise | null) => {
    // if an exercise changes, discard any modifiers that are not valid for the new exercise
    const remainingModifiers = activeModifiers.filter((modifier) =>
      newExercise?.modifiers.some((exercise) => exercise === modifier)
    )

    await updateRecordFields(_id, {
      exercise: newExercise,
      activeModifiers: remainingModifiers,
    })
    mutateRecord({
      ...record,
      exercise: newExercise,
      activeModifiers: remainingModifiers,
    })
  }

  // todo: select input units (if you display in kg units, you can input in lbs and it will convert)
  // todo: preserve state when changing set type?
  // todo: add Category to Record so it persists (if exercise is filtered; mainly for programming)
  return (
    <Card elevation={3} sx={{ px: 1 }}>
      <CardHeader
        title={`Record ${swiperIndex + 1}`}
        titleTypographyProps={{ variant: 'h6' }}
        action={
          <>
            <RecordHeaderButton
              title="Move current record to the left"
              className={noSwipingAboveSm}
              disabled={!swiperIndex}
              onClick={() => handleSwapRecords(swiperIndex, swiperIndex - 1)}
            >
              <KeyboardDoubleArrowLeft />
            </RecordHeaderButton>
            <RecordHeaderButton
              title="Move current record to the right"
              className={noSwipingAboveSm}
              // disable on the penultimate slide because the last is the "add record" button
              disabled={swiperIndex >= swiper.slides?.length - 2}
              onClick={() => handleSwapRecords(swiperIndex, swiperIndex + 1)}
            >
              <KeyboardDoubleArrowRight />
            </RecordHeaderButton>
            <RecordNotesDialogButton
              className={noSwipingAboveSm}
              notes={notes}
              setsAmount={sets.length}
              handleSubmit={(notes) => handleFieldChange({ notes })}
            />
            {!!exercise && (
              <RecordNotesDialogButton
                className={noSwipingAboveSm}
                notes={exercise.notes}
                options={exercise.modifiers}
                Icon={<FitnessCenter />}
                tooltipTitle="Exercise Notes"
                handleSubmit={(notes) => handleExerciseNotesChange(notes)}
                multiple
              />
            )}
            <RecordHeaderButton
              title="Delete Record"
              className={noSwipingAboveSm}
              color="error"
              onClick={handleDeleteRecord}
            >
              <Delete />
            </RecordHeaderButton>
          </>
        }
      />
      <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />
      <CardContent
        // swiping causes weird behavior on desktop when combined with data input fields
        className={noSwipingAboveSm}
        sx={{ cursor: { sm: 'default' } }}
      >
        <Stack spacing={2}>
          <ExerciseSelector
            variant="standard"
            initialCategoryFilter={record.category}
            handleCategoryFilterChange={(category) =>
              handleFieldChange({ category })
            }
            {...{
              exercise,
              exercises,
              handleChange: handleExerciseChange,
              mutate: mutateExercises,
            }}
          />
          <ComboBoxField
            label="Modifiers"
            options={exercise?.modifiers}
            initialValue={activeModifiers}
            variant="standard"
            handleSubmit={(value: string[]) =>
              handleFieldChange({ activeModifiers: value })
            }
          />
          <SetHeader
            initialSelected={fields}
            handleSubmit={(fields) => handleFieldChange({ fields })}
          />
        </Stack>

        {/* todo: the header could lock in constant values? Eg, reps = 5 (or, would that be too much?) */}
        <Box sx={{ pb: 0 }}>
          {/* todo: unique key */}
          {sets.map((set, i) => (
            <SetInput
              set={set}
              fields={fields}
              key={i}
              handleSubmit={(changes: Partial<Set>) =>
                handleSetChange(changes, i)
              }
              handleDelete={() => handleDeleteSet(i)}
            />
          ))}
        </Box>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          px: 2,
          pb: 2,
        }}
      >
        <Tooltip title="Add Set" placement="right">
          <Fab
            color="primary"
            size="medium"
            disabled={!fields.length}
            onClick={addSet}
            className={noSwipingAboveSm}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </CardActions>
    </Card>
  )
}
