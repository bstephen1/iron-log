import Grid from '@mui/material/Grid'
import type RecordDisplay from '../../components/history/RecordDisplay'
import RecordDisplaySelect from '../../components/history/RecordDisplaySelect'
import { type UpdateState } from '../../lib/util'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import InputAdornment from '@mui/material/InputAdornment'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'

export interface GraphOptions {
  showBodyweight?: boolean
  includeUnofficial?: boolean
  smoothLine?: boolean
  clothingOffset: number
}

interface Props {
  graphOptions: GraphOptions
  updateGraphOptions: UpdateState<GraphOptions>
  recordDisplay: RecordDisplay
  updateRecordDisplay: UpdateState<RecordDisplay>
}
export default function GraphOptionsForm({
  graphOptions,
  updateGraphOptions,
  recordDisplay,
  updateRecordDisplay,
}: Props) {
  const {
    showBodyweight = false,
    includeUnofficial = false,
    smoothLine = false,
    clothingOffset,
  } = graphOptions

  return (
    <Grid container spacing={2}>
      <Grid
        alignItems="center"
        display="flex"
        size={{
          xs: 12,
          md: 9,
        }}
      >
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={showBodyweight}
                onChange={() =>
                  updateGraphOptions({ showBodyweight: !showBodyweight })
                }
              />
            }
            label="Show bodyweight"
          />
          <FormControlLabel
            disabled={!showBodyweight}
            control={
              <Switch
                checked={includeUnofficial}
                onChange={() =>
                  updateGraphOptions({ includeUnofficial: !includeUnofficial })
                }
              />
            }
            label="Use unofficial weigh-ins"
          />
          <FormControlLabel
            disabled={!showBodyweight}
            control={
              <Switch
                checked={smoothLine}
                onChange={() => updateGraphOptions({ smoothLine: !smoothLine })}
              />
            }
            label="Use smoothed line"
          />
        </FormGroup>
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 3,
        }}
      >
        <TextField
          label="Clothing offset"
          type="number"
          autoComplete="off"
          fullWidth
          value={clothingOffset}
          disabled={!showBodyweight || !includeUnofficial}
          onChange={(e) =>
            updateGraphOptions({
              clothingOffset: isNaN(Number(e.target.value))
                ? 0
                : Number(e.target.value),
            })
          }
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            },
            htmlInput: { inputMode: 'decimal' },
          }}
        />
      </Grid>
      <Grid size={12}>
        <RecordDisplaySelect
          recordDisplay={recordDisplay}
          updateRecordDisplay={updateRecordDisplay}
        />
      </Grid>
    </Grid>
  )
}
