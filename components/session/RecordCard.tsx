// @ts-nocheck
// todo: ignoring Set typing issues for now
import {
  Delete,
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
  Divider,
  Fab,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import { useSwiper, useSwiperSlide } from 'swiper/react'
import {
  updateRecordFields,
  useExercises,
  useRecord,
} from '../../lib/frontend/restService'
import Exercise from '../../models/Exercise'
import { ExerciseStatus } from '../../models/ExerciseStatus'
import Record from '../../models/Record'
import Set from '../../models/Set'
import { ComboBoxField } from '../form-fields/ComboBoxField'
import { ExerciseSelector } from '../form-fields/selectors/ExerciseSelector'
import StyledDivider from '../StyledDivider'
import SetHeader from './SetHeader'
import SetInput from './SetInput'

interface Props {
  id: Record['_id']
  deleteRecord: (id: string) => void
  swapRecords: (i: number, j: number) => void
  index: number
}
export default function RecordCard({
  id,
  deleteRecord,
  swapRecords,
  index,
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
    status: ExerciseStatus.ACTIVE,
  })

  // error / loading states repeat a bit of styling from the live record card.
  if (isError) {
    console.error('Could not fetch record!')
    return (
      <Card elevation={3} sx={{ px: 1 }}>
        <CardHeader
          title={`Record ${index + 1}`}
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
          title={`Record ${index + 1}`}
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
          title={`Record ${index + 1}`}
          titleTypographyProps={{ variant: 'h6' }}
        />
        <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />

        <CardContent>
          <Box>Could not find record {id}</Box>
        </CardContent>
      </Card>
    )
  }

  // todo: when exercise is null'd the record doesn't show (still exists in db)
  // define after null checks so record must exist
  const { exercise, activeModifiers, sets, fields, _id } = record

  const addSet = () => {
    const last = sets[sets.length - 1] ?? new Set()
    // todo: init first set, and possibly have different behavior when adding different types of sets?
    const newSet = { ...last, effort: undefined }
    updateRecordFields(_id, { [`sets.${sets.length}`]: newSet })
    mutateRecord({ ...record, sets: sets.concat(newSet) })
  }

  const handleFieldChange = <T extends keyof Record>(
    field: T,
    value: Record[T]
  ) => {
    updateRecordFields(_id, { [field]: value })
    mutateRecord({ ...record, [field]: value })
  }

  const handleSetChange = (setField, value, i) => {
    updateRecordFields(_id, { [`sets.${i}.${setField}`]: value })
    const newSets = [...record.sets]
    newSets[i][setField] = value
    mutateRecord({ ...record, sets: newSets })
  }

  const handleDeleteSet = (i) => {
    const newSets = record.sets.filter((_, j) => j !== i)
    updateRecordFields(_id, { ['sets']: newSets })
    mutateRecord({ ...record, sets: newSets })
  }

  const handleDeleteRecord = () => {
    deleteRecord(id)
    // todo: this became glitchy after deleting records from db instead of just removing from session array
    swiper.update() // have to update swiper whenever changing swiper elements
  }

  const handleSwapRecords = (i, j) => {
    swapRecords(i, j)
    swiper.update()
    // todo: think about animation here. Instant speed? Maybe if it could change to a fade transition?
    swiper.slideTo(j, 0)
  }

  const handleExerciseChange = (newExercise: Exercise | null) => {
    // if an exercise changes, discard any modifiers that are not valid for the new exercise
    const remainingModifiers = activeModifiers.filter((modifier) =>
      newExercise?.modifiers.some((exercise) => exercise === modifier)
    )

    updateRecordFields(_id, {
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
        title={`Record ${index + 1}`}
        titleTypographyProps={{ variant: 'h6' }}
        action={
          <>
            <Tooltip
              title="Move current record to the left"
              placement="bottom-end"
            >
              <>
                <IconButton
                  className={noSwipingAboveSm}
                  disabled={swiper.isBeginning}
                  onClick={() => handleSwapRecords(index, index - 1)}
                >
                  <KeyboardDoubleArrowLeft />
                </IconButton>
              </>
            </Tooltip>
            <Tooltip
              title="Move current record to the right"
              placement="bottom-end"
            >
              <>
                <IconButton
                  className={noSwipingAboveSm}
                  // disable on the penultimate slide because the last is the "add record" button
                  disabled={swiper.activeIndex >= swiper.slides?.length - 2}
                  onClick={() => handleSwapRecords(index, index + 1)}
                >
                  <KeyboardDoubleArrowRight />
                </IconButton>
              </>
            </Tooltip>
            <Tooltip title="Delete Record" placement="bottom-end">
              {/* todo: make a menu? Maybe will want to add other stuff. Actually, maybe only for when the screen is small. Lots of empty space in the title bar. */}
              <IconButton
                className={noSwipingAboveSm}
                color="error"
                onClick={handleDeleteRecord}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </>
        }
      />
      <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />
      <CardContent
        // swiping causes weird behavior on desktop when combined with data input fields
        className={noSwipingAboveSm}
        sx={{ cursor: { sm: 'default' } }}
      >
        <Grid container spacing={2}>
          <Grid xs={12}>
            <ExerciseSelector
              variant="standard"
              {...{
                exercise,
                exercises,
                handleChange: handleExerciseChange,
                mutate: mutateExercises,
              }}
            />
          </Grid>
          <Grid xs={12}>
            <ComboBoxField
              label="Modifiers"
              options={exercise?.modifiers}
              initialValue={activeModifiers}
              variant="standard"
              handleSubmit={(value: string[]) =>
                handleFieldChange('activeModifiers', value)
              }
            />
          </Grid>
          {/* <SetTable sets={sets} /> */}
          <Grid xs={12}>
            <Divider>Sets</Divider>
          </Grid>

          <Grid xs={12}>
            <SetHeader
              initialSelected={fields}
              handleSubmit={(value) => handleFieldChange('fields', value)}
            />
          </Grid>
        </Grid>

        {/* todo: add a column header for input labels? Like a title row in excel... */}
        {/* make the multi Select that chooses the set fields also be the header? */}
        {/* could also put units in a top header */}
        {/* oh, AND the header could lock in constant values! Eg, reps = 5 (or, would that be too much?) */}
        {/* may be better to do something like categoryFilter; a button with a Menu, instead of a Select (so the header row can be customized easier) */}
        {/* or maybe a custom renderValue in the Select is flexible enough  */}

        {/* Whatever form it is, that Select will pass on the fields to the SetInputs, and act as the source of truth for which fields to display */}
        {/* units: global user pref. No change per record or anything. Just make it quick to swap units if needed. */}
        <Box sx={{ pb: 0 }}>
          {/* todo: unique key */}
          {sets.map((set, i) => (
            <Stack key={i} direction="row">
              <SetInput
                set={set}
                fields={fields}
                key={i}
                index={i}
                handleSubmit={(setField, value) =>
                  handleSetChange(setField, value, i)
                }
                handleDelete={() => handleDeleteSet(i)}
              />
            </Stack>
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
