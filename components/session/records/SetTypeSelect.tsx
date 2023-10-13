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
import {
  ORDERED_DISPLAY_FIELDS,
  printFieldWithUnits,
  VisibleField,
} from 'models/DisplayFields'
import { DEFAULT_SET_TYPE, setOperators, SetType } from 'models/Record'
import { Set, Units } from 'models/Set'

const normalFields = ORDERED_DISPLAY_FIELDS.filter(
  (field) => !field.enabled?.unilateral && !field.enabled?.splitWeight
)

const timeField = ORDERED_DISPLAY_FIELDS.filter(
  (field) => field.source === 'time'
)

interface Props {
  units: Units
  setType: SetType
  handleSubmit: (changes: Partial<SetType>) => void
}
export default function SetTypeSelect({
  units,
  // todo: remove DEFAULT when all records properly have been init'd with a set type
  setType: { field, value, operator, range } = DEFAULT_SET_TYPE,
  handleSubmit,
}: Props) {
  const { min, max } = range ?? {}
  const fieldOptions = operator === 'rest' ? timeField : normalFields

  // todo:
  // total shows remaining reps
  // maybe store prevOperator so when switching back from rest it changes back from "time" to whatever you had before

  return (
    <Grid container>
      <Grid xs={12}>
        {/* todo: probably needs better aria labels */}
        <InputLabel shrink={true} sx={{ width: '100%' }}>
          Set Type
        </InputLabel>
      </Grid>
      <Grid xs={4} pr={2}>
        <SelectFieldAutosave<typeof operator>
          label=""
          fullWidth
          initialValue={operator ?? ''}
          options={[...setOperators]}
          handleSubmit={(operator) => {
            // "rest" only applies to time
            handleSubmit({
              operator,
              field: operator === 'rest' ? 'time' : field,
            })
          }}
          variant="standard"
          defaultHelperText=""
        />
      </Grid>
      <Grid xs={5} pr={2} display="flex" alignItems="flex-end">
        {operator === 'between' ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <NumericFieldAutosave
              placeholder="min"
              initialValue={min}
              handleSubmit={(min) => handleSubmit({ range: { min, max } })}
              variant="standard"
            />
            <Typography>and</Typography>
            <NumericFieldAutosave
              placeholder="max"
              initialValue={max}
              handleSubmit={(max) => handleSubmit({ range: { min, max } })}
              variant="standard"
            />
          </Stack>
        ) : (
          <NumericFieldAutosave
            placeholder="value"
            initialValue={value}
            handleSubmit={(value) => handleSubmit({ value })}
            variant="standard"
          />
        )}
      </Grid>
      <Grid xs={3} display="flex" alignItems="flex-end">
        <SelectFieldAutosave<keyof Set, VisibleField>
          label=""
          fullWidth
          initialValue={field ?? ''}
          options={fieldOptions}
          handleSubmit={(field) => handleSubmit({ field })}
          variant="standard"
          defaultHelperText=""
          SelectProps={{
            renderValue: (fieldName) => {
              return units[fieldName as keyof Units] ?? fieldName
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
    </Grid>
  )
}
