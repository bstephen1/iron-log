import {
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Switch,
  TextField,
  useMediaQuery,
} from '@mui/material'
import Grid from '@mui/system/Unstable_Grid'
import dayjs from 'dayjs'

import { useQueryState } from 'next-usequerystate'
import { useEffect, useMemo, useState } from 'react'
import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import StyledDivider from '../components/StyledDivider'
import { DATE_FORMAT, DEFAULT_CLOTHING_OFFSET } from '../lib/frontend/constants'
import { useBodyweightHistory, useExercises } from '../lib/frontend/restService'
import Exercise from '../models/Exercise'

export default function HistoryPage() {
  const { exercises, mutate: mutateExercises } = useExercises()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const { data: bodyweightData } = useBodyweightHistory({ sort: 'oldestFirst' })
  const [showBodyweight, setShowBodyweight] = useState(true)
  const [includeUnofficial, setIncludeUnofficial] = useState(false)
  const [clothingOffset, setClothingOffset] = useState(DEFAULT_CLOTHING_OFFSET)

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

  // const [graphContainerRef, { width: graphContainerWidth }] = useMeasure()

  const [windowHeight, setWindowHeight] = useState(0)
  useEffect(() => {
    setWindowHeight(window.innerHeight)
    const handleWindowResize = () => {
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleWindowResize)
    // supposedly removing eventListener on return prevents memory leaks
    return window.removeEventListener('resize', handleWindowResize)
  }, [])

  const data = useMemo(() => {
    if (!unofficialBWs || !officialBWs) return []

    const officialData = showBodyweight ? officialBWs : []

    const unofficialData = includeUnofficial
      ? // ignore unofficial weigh-ins if an official weigh-in for that day exists
        unofficialBWs
          .map((bw) => ({ ...bw, value: bw.value - clothingOffset }))
          .filter(
            (bw) =>
              !officialData.some((officialBw) => officialBw.date === bw.date)
          )
      : []

    const data = [...unofficialData, ...officialData]

    // todo: remove unofficial if an official exists
    return data
      .map((bw) => ({ ...bw, epochDate: dayjs(bw.date).unix() }))
      .sort((a, b) => a.epochDate - b.epochDate)
  }, [
    unofficialBWs,
    officialBWs,
    showBodyweight,
    includeUnofficial,
    clothingOffset,
  ])

  useEffect(() => {
    // only want to set value on init
    if (!!exercise) return

    setExercise(
      exercises?.find((exercise) => exercise.name === urlExercise) ?? null
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercises])

  // console.log('dateReange')
  // const now = dayjs()
  // const unix = now.unix()
  // console.log(unix)
  // console.log(dayjs.unix(unix).format(DATE_FORMAT))

  return (
    <Grid container spacing={2}>
      <Grid xs={10} alignItems="center" display="flex">
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={showBodyweight}
                onChange={() => setShowBodyweight(!showBodyweight)}
              />
            }
            label="Show bodyweight"
          />
          <FormControlLabel
            disabled={!showBodyweight}
            control={
              <Switch
                checked={includeUnofficial}
                onChange={() => setIncludeUnofficial(!includeUnofficial)}
              />
            }
            label="Include unofficial weigh-ins"
          />
        </FormGroup>
      </Grid>
      <Grid xs={2}>
        <TextField
          variant="standard"
          type="number"
          label="clothing offset"
          autoComplete="off"
          value={clothingOffset}
          disabled={!showBodyweight || !includeUnofficial}
          onChange={(e) =>
            setClothingOffset(
              isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)
            )
          }
          onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
        />
      </Grid>
      {/* todo: when both official and unofficial, either add clothing offset to official or subtract from unofficial. input box for setting offset? Also option to not combine them, I guess.  */}
      {/* when merging, you have to choose to prioritize official or unofficial. Then, if there are official and unofficial weigh-ins on the same day, the chosen type is used and the other discarded.
            Otherwise, the non-chosen type adds/subtracts the clothing offset */}
      {/* well.. what's the point though? Isn't it to track an "accurate" weight? Why would you care about unofficial weights? Shouldn't it always prioritize official weigh-ins?
                And only show unofficial ones if you choose to show them, and there is no conflicting official weigh-in on the same day?  */}
      {/* So just add a small clothing offset box when unofficial is selected? To the right of bodyweight Select? Same line? */}
      {/* todo: thinking exercises will have to be something like locking all but one set fields. And you can set a field as a don't care.
            So for weight it would be lock reps to 6 or whatever and set everything but weight to don't care. Can overlay on top of bw but would
            need a second y axis unless both are weight. Maybe would be better to always have two axes? A dedicated bw axis.  */}
      {/* <Grid xs={12}>
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
      </Grid> */}
      {/* todo: modifiers, reps, modifier match type? (ArrayMatchType) */}
      {/* todo: add multiple exercises */}
      <Grid xs={12}>
        <StyledDivider />
      </Grid>
      <Grid xs={12} height="100%" flex="1 1 auto"></Grid>
      <Grid container xs={12} justifyContent="center">
        {bodyweightData && (
          // need to specify a height or the grid and container will both defer to each other and result in zero height
          <ResponsiveContainer
            height={windowHeight}
            // ref={graphContainerRef}
          >
            <LineChart
              data={data}
              margin={{
                top: 30,
                right: 30,
                left: 0,
                bottom: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="epochDate"
                type="number"
                tickFormatter={(value) => dayjs.unix(value).format(DATE_FORMAT)}
                domain={['auto', 'auto']}
                // angle={-45}
                scale="time"
                // textAnchor="end"
                tickMargin={10}
                height={45}
              />
              <YAxis
                name="weight"
                dataKey="value"
                type="number"
                unit=" kg"
                domain={['auto', 'auto']}
              >
                {/* honestly, not sure the label is worth. If using it need to set left margin to 10 or so */}
                {/* <Label angle={-90} value='weight' position='left' style={{ textAnchor: 'middle' }} /> */}
              </YAxis>
              {/* line color is "stroke" */}
              <Line name="bodyweight" dataKey="value" type="monotone" />
              {/* todo: possible to show weigh-in type in tooltip? */}
              <Tooltip
                trigger={isDesktop ? 'hover' : 'click'}
                labelFormatter={(title) =>
                  dayjs.unix(title).format(DATE_FORMAT)
                }
                formatter={(value) => `${value} kg`}
              />
              {/* todo: only show if multiple lines */}
              <Legend verticalAlign="top" height={30} />
              <Brush
                dataKey="epochDate"
                tickFormatter={(value) => dayjs.unix(value).format(DATE_FORMAT)}
                // this doesn't accept a percentage...
                // width={graphContainerWidth * .7}
                // todo: startIndex ~30 days prior to highest date
                // startIndex
              />
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
