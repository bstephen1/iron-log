import {
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Switch,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import RecordDisplay from '../../components/history/RecordDisplay'
import RecordDisplaySelect from '../../components/history/RecordDisplaySelect'
import { UpdateState } from '../../lib/util'

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
