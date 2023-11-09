import {
  InputLabel,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import NumericFieldAutosave from 'components/form-fields/NumericFieldAutosave'
import SelectFieldAutosave from 'components/form-fields/SelectFieldAutosave'
import useNoSwipingDesktop from 'lib/frontend/useNoSwipingSmScreen'
import { UpdateFields } from 'lib/util'
import {
  ORDERED_DISPLAY_FIELDS,
  VisibleField,
  printFieldWithUnits,
} from 'models/DisplayFields'
import Record, { SetType, setOperators } from 'models/Record'
import { Units } from 'models/Set'
import { memo } from 'react'
import isEqual from 'react-fast-compare'

const normalFields = ORDERED_DISPLAY_FIELDS.filter(
  (field) => !field.enabled?.unilateral && !field.enabled?.splitWeight
)

const timeField = ORDERED_DISPLAY_FIELDS.filter(
  (field) => field.source === 'time'
)

const getUnit = (field: SetType['field'], units: Units) =>
  units[field as keyof Units] ?? field

interface Props {
  /** considered readOnly if not provided */
  handleChange?: UpdateFields<Record> | ((changes: Partial<Record>) => void)
  units: Units
  /** When nonzero, displays the given number as the total number of reps over all sets. */
  totalReps?: number
  setType: SetType
  emptyOption?: string
}
export default memo(function SetTypeSelect({
  handleChange,
  totalReps = 0,
  units,
  setType,
  emptyOption,
}: Props) {
  const { field, value, operator, min, max } = setType
  const fieldOptions = operator === 'rest' ? timeField : normalFields
  const remaining = (value ?? 0) - totalReps
  const noSwipingDesktop = useNoSwipingDesktop()
  const readOnly = !handleChange
  const updateSetType = (changes: Partial<SetType>) => {
    const newSetType = { ...setType, ...changes }

    handleChange?.({ setType: newSetType })
  }

  // todo: maybe store prev operator so when switching back from rest it changes back from "time" to whatever you had before
  return (
    // columnSpacing adds unwanted padding to far left/right areas
    <Grid container sx={{ width: '100%' }}>
      <Grid xs={12}>
        {/* todo: probably needs better aria labels */}
        <InputLabel shrink={true} sx={{ width: '100%' }}>
          Set Type
        </InputLabel>
      </Grid>
      <Grid xs={4} pr={2}>
        <SelectFieldAutosave<typeof operator>
          className={noSwipingDesktop}
          label=""
          fullWidth
          initialValue={operator}
          options={[...setOperators]}
          handleSubmit={(operator) => {
            // "rest" only applies to time
            updateSetType({
              operator,
              field: operator === 'rest' ? 'time' : field,
            })
          }}
          variant="standard"
          defaultHelperText=""
          readOnly={readOnly}
        />
      </Grid>
      <Grid xs={5} pr={2} display="flex" alignItems="flex-end">
        {operator === 'between' ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <NumericFieldAutosave
              placeholder="min"
              initialValue={min}
              handleSubmit={(min) => updateSetType({ min })}
              variant="standard"
              readOnly={readOnly}
            />
            <Typography>and</Typography>
            <NumericFieldAutosave
              placeholder="max"
              initialValue={max}
              handleSubmit={(max) => updateSetType({ max })}
              variant="standard"
              readOnly={readOnly}
            />
          </Stack>
        ) : (
          <NumericFieldAutosave
            placeholder="value"
            initialValue={value}
            handleSubmit={(value) => updateSetType({ value })}
            variant="standard"
            readOnly={readOnly}
          />
        )}
      </Grid>
      <Grid xs={3} display="flex" alignItems="flex-end">
        <SelectFieldAutosave<typeof field, VisibleField>
          className={noSwipingDesktop}
          label=""
          fullWidth
          initialValue={field}
          options={fieldOptions}
          handleSubmit={(field) => updateSetType({ field })}
          variant="standard"
          defaultHelperText=""
          readOnly={readOnly}
          SelectProps={{
            renderValue: (field) => {
              return getUnit(field, units)
            },
          }}
        >
          {fieldOptions.map((field) => (
            <MenuItem key={field.name} value={field.name}>
              <ListItemText primary={printFieldWithUnits(field, units)} />
            </MenuItem>
          ))}
        </SelectFieldAutosave>
      </Grid>
      {!!totalReps && (
        <>
          <Grid xs={6}>
            <Typography pt={1}>
              total: {totalReps} {getUnit(field, units)}
            </Typography>
          </Grid>
          <Grid xs={6} justifyContent="flex-end" display="flex">
            <Typography pt={1}>
              remaining: {remaining > 0 ? remaining : 0} {getUnit(field, units)}
            </Typography>
          </Grid>
        </>
      )}
    </Grid>
  )
},
isEqual)
