// @ts-nocheck
// todo: ignoring Set typing issues for now
import { MoreVert } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fab,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material'
import { grey } from '@mui/material/colors'
import Grid from '@mui/system/Unstable_Grid'
import {
  updateRecordFields,
  useExercises,
  useRecord,
} from '../../lib/frontend/restService'
import Exercise from '../../models/Exercise'
import { ExerciseStatus } from '../../models/ExerciseStatus'
import Record from '../../models/Record'
import { SetType } from '../../models/SetType'
import { ComboBoxField } from '../form-fields/ComboBoxField'
import SelectFieldAutosave from '../form-fields/SelectFieldAutosave'
import { ExerciseSelector } from '../form-fields/selectors/ExerciseSelector'
import StandardSetInput from './sets/StandardSetInput'

interface Props {
  id: Record['_id']
  deleteRecord: (id: string) => void
  index: number
}
export default function RecordInput({ id, deleteRecord, index }: Props) {
  const { record, isError, mutate: mutateRecord } = useRecord(id)
  const { exercises, mutate: mutateExercises } = useExercises({
    status: ExerciseStatus.ACTIVE,
  }) // SWR caches this, so it won't need to call the API every render

  if (isError) {
    console.error('Could not fetch record!')
    return <></>
  }

  // todo: skeleton?
  if (!record || !exercises) {
    return <></>
  }

  // todo: when exercise is null'd the record doesn't show (still exists in db)
  // define after null checks so record must exist
  const { exercise, type, activeModifiers, sets, _id } = record

  const addSet = () => {
    const last = sets[sets.length - 1] ?? {}
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
  // todo: use carousel? https://github.com/Learus/react-material-ui-carousel
  // todo: add Category to Record so it persists (if exercise is filtered; mainly for programming)
  return (
    <Card elevation={10} sx={{ px: 1 }}>
      <CardHeader
        title={`Record ${index + 1}`}
        action={
          <Tooltip title="Delete Record" placement="left">
            {/* todo: make a menu? Maybe will want to add other stuff. */}
            <IconButton
              className="swiper-no-swiping"
              onClick={() => deleteRecord(id)}
            >
              <MoreVert />
            </IconButton>
          </Tooltip>
        }
      />
      <CardContent
        // swiping causes weird behavior when combine with data input fields, so disable it
        className="swiper-no-swiping" // lol
        sx={{ cursor: 'default' }}
      >
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
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
          <Grid xs={12} sm={6}>
            <SelectFieldAutosave
              label="Set Type"
              initialValue={type}
              fullWidth
              defaultHelperText=""
              variant="standard"
              options={Object.values(SetType)}
              handleSubmit={(value) => handleFieldChange('type', value)}
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
        </Grid>

        <Box sx={{ px: 2, py: 2 }}>
          {/* todo: unique key */}
          {sets.map((set, i) => (
            <Stack key={i} direction="row">
              <StandardSetInput
                {...set}
                type={record.type}
                units={{ primary: 'kg' }}
                key={i}
                handleSubmit={(setField, value) =>
                  handleSetChange(setField, value, i)
                }
              />
              {/* <Button
                color="error"
                // variant="outlined"
                // startIcon={<ClearIcon />}
                sx={{ p: 0, borderRadius: 0 }}
              >
                <ClearIcon />
              </Button> */}
              <IconButton
                size="small"
                // color="error"
                onClick={() => console.log('click')}
                sx={{
                  borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                  background: `${grey[100]}`, // todo

                  borderRadius: 0,
                  // '& .MuiTouchRipple-ripple .MuiTouchRipple-child': {
                  //   borderRadius: 0,
                  // },
                }}
              >
                <ClearIcon />
              </IconButton>
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
        {/* <Button onClick={() => deleteRecord(_id)} color="error">
          Delete Record
        </Button> */}
        {/* <Button onClick={addSet} variant="contained">
          Add Set
        </Button> */}
        {/* todo: extend on hover with text? */}
        <Tooltip title="Add Set" placement="right">
          <Fab color="primary" size="medium" onClick={addSet}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </CardActions>
    </Card>
  )
}
