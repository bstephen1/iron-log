import {
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Switch,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import RecordDisplay from 'components/history/RecordDisplay'
import RecordDisplaySelect from 'components/history/RecordDisplaySelect'
import { UpdateState } from 'lib/util'

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
  const { showBodyweight, includeUnofficial, smoothLine, clothingOffset } =
    graphOptions

  return (
    <Grid container spacing={2}>
      <Grid xs={8} alignItems="center" display="flex">
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
            label="Include unofficial weigh-ins"
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
      <Grid xs={4}>
        <TextField
          type="number"
          label="Clothing offset"
          autoComplete="off"
          value={clothingOffset}
          disabled={!showBodyweight || !includeUnofficial}
          onChange={(e) =>
            updateGraphOptions({
              clothingOffset: isNaN(Number(e.target.value))
                ? 0
                : Number(e.target.value),
            })
          }
          onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
        />
      </Grid>

      <Grid xs={12}>
        <RecordDisplaySelect
          recordDisplay={recordDisplay}
          updateRecordDisplay={updateRecordDisplay}
        />
      </Grid>
    </Grid>
  )
}
