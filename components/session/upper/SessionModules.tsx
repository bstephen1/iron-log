import Grid from '@mui/material/Unstable_Grid2'
import WeightUnitConverter from 'components/WeightUnitConverter'
import RestTimer from './RestTimer'

export default function SessionModules() {
  // todo: make these togglable in a settings menu

  return (
    <Grid container>
      <Grid xs={12} md={6}>
        <RestTimer />
      </Grid>
      <Grid
        xs={12}
        md={6}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <WeightUnitConverter />
      </Grid>
    </Grid>
  )
}
