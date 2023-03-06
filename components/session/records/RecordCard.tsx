import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import NotesIcon from '@mui/icons-material/Notes'
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
import { Dayjs } from 'dayjs'
import { useEffect } from 'react'
import { useSwiper, useSwiperSlide } from 'swiper/react'
import { DATE_FORMAT } from '../../../lib/frontend/constants'
import {
  updateExerciseFields,
  updateRecordFields,
  useBodyweightHistory,
  useExercises,
  useModifiers,
  useRecord,
} from '../../../lib/frontend/restService'
import useDisplayFields from '../../../lib/frontend/useDisplayFields'
import useExtraWeight from '../../../lib/frontend/useExtraWeight'
import Exercise from '../../../models/Exercise'
import Note from '../../../models/Note'
import Record from '../../../models/Record'
import { Set } from '../../../models/Set'
import { Status } from '../../../models/Status'
import { ComboBoxField } from '../../form-fields/ComboBoxField'
import { ExerciseSelector } from '../../form-fields/selectors/ExerciseSelector'
import StyledDivider from '../../StyledDivider'
import RecordHeaderButton from './RecordHeaderButton'
import RecordNotesDialogButton from './RecordNotesDialogButton'
import RecordUnitsButton from './RecordUnitsButton'
import SetHeader from './SetHeader'
import SetInput from './SetInput'

// Note: mui icons MUST use path imports instead of named imports!
// Otherwise in prod there will be serverless function timeout errors. Path imports also
// make loading significantly faster. Apparently the auto tree-shaking
// mui advertises does not actually work, or isn't set up properly.
// The icons were not causing any issues until 2023/03/06, when an updated
// prod build retractively made every build fail to work.
// See difference between path/named import: https://mui.com/material-ui/guides/minimizing-bundle-size/#option-one-use-path-imports
// See bug: https://github.com/mui/material-ui/issues/35450

interface Props {
  id: Record['_id']
  date: Dayjs
  deleteRecord: (id: string) => Promise<void>
  swapRecords: (i: number, j: number) => Promise<void>
  setLastChangedExercise: (exercise: Exercise) => void
  lastChangedExercise: Exercise | null
  updateSessionNotes: (notes: Note[]) => Promise<void>
  // todo: remove undefined after updating existing prod records to have a session notes array
  sessionNotes: Note[] | undefined
  swiperIndex: number
}
export default function RecordCard({
  id,
  date,
  deleteRecord,
  swapRecords,
  swiperIndex,
  setLastChangedExercise,
  lastChangedExercise,
  updateSessionNotes,
  sessionNotes = [],
}: Props) {
  const swiper = useSwiper()
  // this hook needs to be called for useSwiper() to update the activeIndex, but is otherwise unused
  const _ = useSwiperSlide()
  const theme = useTheme()
  const noSwipingAboveSm = useMediaQuery(theme.breakpoints.up('sm'))
    ? 'swiper-no-swiping-outer'
    : ''
  const { record, isError, mutate: mutateRecord } = useRecord(id)
  const { modifiersIndex } = useModifiers()
  const { data: bodyweightData } = useBodyweightHistory({
    limit: 1,
    end: date.format(DATE_FORMAT),
  })
  const { exercises, mutate: mutateExercises } = useExercises({
    status: Status.active,
  })
  const displayFields = useDisplayFields({ record })
  const extraWeight = useExtraWeight({ record })

  useEffect(() => {
    if (!record || lastChangedExercise?._id !== record?.exercise?._id) return

    mutateRecord({ ...record, exercise: lastChangedExercise })

    // Adding mutateRecord and record as deps will break the logic.
    // Could address by adding an early return for when lastChangedExercise === null,
    // but then it still gets called way more than it needs to.
    // This should only be called when lastChangedExercise changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastChangedExercise])

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
  } else if (
    record === undefined ||
    modifiersIndex === undefined ||
    bodyweightData === undefined
  ) {
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
  const { exercise, activeModifiers, sets, notes, _id } = record
  const attributes = exercise?.attributes ?? {}

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

  const handleRecordNotesChange = async (notes: Note[]) => {
    let sessionNotes = []
    let recordNotes = []
    for (const note of notes) {
      // for record notes, each note should only have a single tag
      if (note.tags.includes('Session')) {
        sessionNotes.push(note)
      } else {
        recordNotes.push(note)
      }
    }

    handleFieldChange({ notes: recordNotes })
    updateSessionNotes(sessionNotes)
  }

  const handleExerciseFieldsChange = async (changes: Partial<Exercise>) => {
    if (!exercise) return

    const newExercise = { ...exercise, ...changes }
    await updateExerciseFields(exercise, { ...changes })

    // setLastChangedExercise() will also mutate the record, but calling it here
    // will update the currently active card quicker
    mutateRecord({ ...record, exercise: newExercise })
    setLastChangedExercise(newExercise)
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

  // todo: add Category to Record so it persists (if exercise is filtered; mainly for programming)
  return (
    <Card elevation={3} sx={{ px: 1 }}>
      <CardHeader
        title={`Record ${swiperIndex + 1}`}
        titleTypographyProps={{ variant: 'h6' }}
        action={
          <Box className={noSwipingAboveSm} sx={{ cursor: 'default' }}>
            <RecordHeaderButton
              title="Move current record to the left"
              disabled={!swiperIndex}
              onClick={() => handleSwapRecords(swiperIndex, swiperIndex - 1)}
            >
              <KeyboardDoubleArrowLeftIcon />
            </RecordHeaderButton>
            <RecordHeaderButton
              title="Move current record to the right"
              // disable on the penultimate slide because the last is the "add record" button
              disabled={swiperIndex >= swiper.slides?.length - 2}
              onClick={() => handleSwapRecords(swiperIndex, swiperIndex + 1)}
            >
              <KeyboardDoubleArrowRightIcon />
            </RecordHeaderButton>
            <RecordNotesDialogButton
              notes={[...sessionNotes, ...notes]}
              Icon={<NotesIcon />}
              tooltipTitle="Record Notes"
              setsAmount={sets.length}
              handleSubmit={(notes) => handleRecordNotesChange(notes)}
            />
            {!!exercise && (
              <RecordNotesDialogButton
                notes={exercise.notes}
                options={exercise.modifiers}
                Icon={<FitnessCenterIcon />}
                tooltipTitle="Exercise Notes"
                handleSubmit={(notes) => handleExerciseFieldsChange({ notes })}
                multiple
              />
            )}
            <RecordUnitsButton
              displayFields={displayFields}
              handleSubmit={(displayFields) =>
                handleExerciseFieldsChange({ displayFields })
              }
            />
            <RecordHeaderButton
              title="Delete Record"
              color="error"
              onClick={handleDeleteRecord}
            >
              <DeleteIcon />
            </RecordHeaderButton>
          </Box>
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
            displayFields={displayFields}
            handleSubmit={(displayFields) =>
              handleExerciseFieldsChange({ displayFields })
            }
            // also check attributes incase bodyweight is set to true but no bodyweight exists
            showSplitWeight={attributes.bodyweight || !!extraWeight}
          />
        </Stack>

        {/* todo: the header could lock in constant values? Eg, reps = 5 (or, would that be too much?) */}
        <Box sx={{ pb: 0 }}>
          {sets.map((set, i) => (
            <SetInput
              key={i}
              set={set}
              displayFields={displayFields}
              handleSubmit={(changes: Partial<Set>) =>
                handleSetChange(changes, i)
              }
              handleDelete={() => handleDeleteSet(i)}
              extraWeight={extraWeight}
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
            disabled={!displayFields?.visibleFields.length}
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
