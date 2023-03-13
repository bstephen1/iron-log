import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  useMediaQuery,
} from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import dayjs from 'dayjs'

import { useQueryState } from 'next-usequerystate'
import { useEffect, useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ExerciseSelector } from '../components/form-fields/selectors/ExerciseSelector'
import StyledDivider from '../components/StyledDivider'
import { DATE_FORMAT } from '../lib/frontend/constants'
import { useBodyweightHistory, useExercises } from '../lib/frontend/restService'
import { WeighInType, weighInTypes } from '../models/Bodyweight'
import Exercise from '../models/Exercise'

export default function HistoryPage() {
  const { exercises, mutate: mutateExercises } = useExercises()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [selectedBW, setSelectedBW] = useState<WeighInType[]>([])
  const { data: bodyweightData } = useBodyweightHistory({ sort: 'oldestFirst' })

  const [urlExercise, setUrlExercise] = useQueryState('exercise')
  const isDesktop = useMediaQuery('(pointer: fine)')

  const unofficialBWs = useMemo(
    () => bodyweightData?.filter((bw) => bw.type === 'unofficial'),
    [bodyweightData]
  )
  const officialBWs = useMemo(
    () => bodyweightData?.filter((bw) => bw.type === 'official'),
    [bodyweightData]
  )

  const data = useMemo(
    () =>
      (selectedBW.some((type) => type === 'unofficial')
        ? unofficialBWs
        : officialBWs
      )?.map((bw) => ({ ...bw, epochDate: dayjs(bw.date).unix() })),
    [unofficialBWs, officialBWs, selectedBW]
  )

  useEffect(() => {
    // only want to set value on init
    if (!!exercise) return

    setExercise(
      exercises?.find((exercise) => exercise.name === urlExercise) ?? null
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercises])

  const handleBWchange = (value: WeighInType[] | string) => {
    setSelectedBW(
      // On autofill we get a stringified value
      typeof value === 'string' ? (value.split(',') as WeighInType[]) : value
    )
  }

  const handleBWdelete = (value: WeighInType) => {
    setSelectedBW(selectedBW.filter((bw) => bw !== value))
  }

  console.log('dateReange')
  const now = dayjs()
  const unix = now.unix()
  console.log(unix)
  console.log(dayjs.unix(unix).format(DATE_FORMAT))

  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <FormControl fullWidth>
          <InputLabel>Bodyweight</InputLabel>
          <Select<WeighInType[]>
            fullWidth
            displayEmpty
            multiple
            value={selectedBW}
            onChange={(e) => handleBWchange(e.target.value)}
            input={<OutlinedInput label="Bodyweight" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    onDelete={() => handleBWdelete(value)}
                    // Select intercepts click events and opens the menu
                    onMouseDown={(e) => {
                      e.stopPropagation()
                    }}
                  />
                ))}
              </Box>
            )}
          >
            {weighInTypes.map((type) => (
              <MenuItem key={type} value={type}>
                <Checkbox
                  checked={selectedBW.some((value) => value === type)}
                />
                <ListItemText primary={type} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid xs={12}>
        {/* todo: when both official and unofficial, either add clothing offset to official or subtract from unofficial. input box for setting offset? Also option to not combine them, I guess.  */}
        {/* when merging, you have to choose to prioritize official or unofficial. Then, if there are official and unofficial weigh-ins on the same day, the chosen type is used and the other discarded.
            Otherwise, the non-chosen type adds/subtracts the clothing offset */}
        {/* well.. what's the point though? Isn't it to track an "accurate" weight? Why would you care about unofficial weights? Shouldn't it always prioritize official weigh-ins?
                And only show unofficial ones if you choose to show them, and there is no conflicting official weigh-in on the same day?  */}
        {/* So just add a small clothing offset box when unofficial is selected? To the right of bodyweight Select? Same line? */}
      </Grid>
      <Grid xs={12}>
        <ExerciseSelector
          {...{
            exercise,
            handleChange: (exercise) => {
              setExercise(exercise)
              setUrlExercise(exercise?.name ?? null, { scroll: false })
            },
            exercises,
            mutate: mutateExercises,
          }}
        />
      </Grid>
      <Grid xs={12}>
        {/* todo: modifiers, reps, modifier match type? (ArrayMatchType) */}
        {/* todo: add multiple exercises */}
      </Grid>
      <Grid xs={12}>
        <StyledDivider />
      </Grid>
      <Grid container xs={12} justifyContent="center">
        {bodyweightData && (
          // need to specify a height or the grid and container will both defer to each other and result in zero height
          <ResponsiveContainer height={300}>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="epochDate"
                type="number"
                tickFormatter={(value) => dayjs.unix(value).format(DATE_FORMAT)}
                domain={['datamin', 'datamax']}
              />
              <YAxis
                name="weight"
                dataKey="value"
                type="number"
                unit=" kg"
                domain={['datamin', 'datamax']}
              >
                {/* honestly, not sure the label is worth. If using it need to set left margin to 10 or so */}
                {/* <Label angle={-90} value='weight' position='left' style={{ textAnchor: 'middle' }} /> */}
              </YAxis>
              <Line name="weight" dataKey="value" type="monotone" />
              <Tooltip
                trigger={isDesktop ? 'hover' : 'click'}
                labelFormatter={(value) =>
                  dayjs.unix(value).format(DATE_FORMAT)
                }
              />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Grid>
    </Grid>
  )
}

// todo in graph:
// brush for panning / zooming
// date axis
