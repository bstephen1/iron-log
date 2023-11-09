import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Switch,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import dayjs from 'dayjs'

import StyledDivider from 'components/StyledDivider'
import { ComboBoxField } from 'components/form-fields/ComboBoxField'
import SelectFieldAutosave from 'components/form-fields/SelectFieldAutosave'
import HistoryCardsSwiper from 'components/session/history/HistoryCardsSwiper'
import RecordExerciseSelector from 'components/session/records/RecordExerciseSelector'
import SetTypeSelect from 'components/session/records/SetTypeSelect'
import { DATE_FORMAT, DEFAULT_CLOTHING_OFFSET } from 'lib/frontend/constants'
import { useBodyweightHistory, useRecords } from 'lib/frontend/restService'
import useDesktopCheck from 'lib/frontend/useDesktopCheck'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import Bodyweight from 'models/Bodyweight'
import {
  ArrayMatchType,
  ArrayMatchTypeDescription,
} from 'models/query-filters/MongoQuery'
import { RecordQuery } from 'models/query-filters/RecordQuery'
import { useEffect, useMemo, useState } from 'react'
import isEqual from 'react-fast-compare'
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
import useResizeObserver from 'use-resize-observer'
import useDisplayFields from 'lib/frontend/useDisplayFields'

interface GraphBodyweight extends Bodyweight {
  epochDate: number
}
export default function HistoryPage() {
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const { data: bodyweightData } = useBodyweightHistory()
  const [showBodyweight, setShowBodyweight] = useState(true)
  const [includeUnofficial, setIncludeUnofficial] = useState(false)
  const [clothingOffset, setClothingOffset] = useState(DEFAULT_CLOTHING_OFFSET)
  const [showSmoothedBw, setShowSmoothedBw] = useState(false)
  const [query, setQuery] = useState<RecordQuery>()
  const [formQuery, setFormQuery] = useState(query ?? {})
  const displayFields = useDisplayFields(exercise)

  // const displayFields =
  const { records } = useRecords(query)

  const isDesktop = useDesktopCheck()

  const unofficialBWs = bodyweightData?.filter((bw) => bw.type === 'unofficial')
  const officialBWs = bodyweightData?.filter((bw) => bw.type === 'official')

  // to track width we want to use the size of the graph container, since that will be smaller than window width
  const { ref: graphContainerRef, width: graphContainerWidth = 0 } =
    useResizeObserver()

  // Track the full window height so the graph can be fullscreen.
  // Have to init as 0 so nextjs doesn't error out in SSR trying to find the window.
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

  const graphBodyweightData = useMemo((): GraphBodyweight[] => {
    if (!unofficialBWs || !officialBWs) return []

    const officialData = showBodyweight ? officialBWs : []

    const unofficialData = includeUnofficial
      ? unofficialBWs
          .map((bw) => ({ ...bw, value: bw.value - clothingOffset }))
          // ignore unofficial weigh-ins if an official weigh-in for that day exists
          .filter(
            (bw) =>
              !officialData.some((officialBw) => officialBw.date === bw.date)
          )
      : []

    const data = [...unofficialData, ...officialData]

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

  const convertEpochToDate = (value: number) =>
    dayjs.unix(value).format('YYYY-MM-DD')

  const getStartIndex = (dayRange = 60) => {
    let i = graphBodyweightData.length - 1

    if (i < 0) return 0

    let mostRecentDate = graphBodyweightData[i].date
    const startDate = dayjs(mostRecentDate)
      .add(-dayRange, 'day')
      .format(DATE_FORMAT)

    while (mostRecentDate > startDate) {
      // return if we reached the beginning of the array without hitting the limit
      if (!i) return i

      mostRecentDate = graphBodyweightData[--i].date
    }

    // if we did hit the limit we've gone past it by one
    return i + 1
  }

  console.log(records)

  // todo: scroll snap?
  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <RecordExerciseSelector
          mutateRecordFields={async ({ exercise, activeModifiers }) => {
            setExercise(exercise ?? null)
            setFormQuery((prev) => ({ ...prev, exercise: exercise?.name }))
            if (activeModifiers) {
              setFormQuery((prev) => ({ ...prev, modifier: activeModifiers }))
            }
          }}
          activeModifiers={formQuery.modifier ?? []}
          exercise={exercise}
          category={null}
        />
      </Grid>
      <Grid xs={12}>
        <ComboBoxField
          label="Modifiers"
          emptyPlaceholder="None"
          variant="standard"
          options={exercise?.modifiers || []}
          noOptionsText="Select an exercise to select from its available modifiers"
          initialValue={formQuery.modifier || []}
          handleSubmit={(modifiers) =>
            setFormQuery((prev) => ({ ...prev, modifier: modifiers }))
          }
          helperText=""
        />
      </Grid>
      <Grid xs={12}>
        <SelectFieldAutosave
          fullWidth
          label="Modifier Match Type"
          variant="standard"
          options={Object.values(ArrayMatchType)}
          handleSubmit={(modifierMatchType) =>
            setFormQuery((prev) => ({ ...prev, modifierMatchType }))
          }
          initialValue={
            formQuery.modifierMatchType ?? ArrayMatchType.Equivalent
          }
          helperText={ArrayMatchTypeDescription[
            formQuery.modifierMatchType ?? 'none'
          ].replaceAll('values', 'modifiers')}
        />
      </Grid>
      <Grid xs={12}>
        <SetTypeSelect
          mutateRecordFields={async ({ setType }) =>
            setFormQuery((prev) => ({ ...prev, ...setType }))
          }
          units={displayFields.units}
          emptyOption="No filter"
          setType={{
            field: formQuery.field,
            value: formQuery.value,
            operator: formQuery.operator,
            min: formQuery.min,
            max: formQuery.max,
          }}
        />
      </Grid>
      <Grid xs={8} alignItems="center" display="flex">
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
          <FormControlLabel
            disabled={!showBodyweight}
            control={
              <Switch
                checked={showSmoothedBw}
                onChange={() => setShowSmoothedBw(!showSmoothedBw)}
              />
            }
            label="Use smoothed line"
          />
        </FormGroup>
      </Grid>
      <Grid xs={4}>
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
      <Grid xs={12} display="flex" justifyContent="center">
        <Button
          variant="outlined"
          sx={{ mr: 2 }}
          disabled={isEqual(query, formQuery)}
          onClick={() => setFormQuery(query ?? {})}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          disabled={isEqual(query, formQuery)}
          onClick={() => setQuery(formQuery)}
        >
          Submit
        </Button>
      </Grid>
      <Grid xs={12}>
        <StyledDivider />
      </Grid>

      <Grid xs={12} height="100%" flex="1 1 auto"></Grid>
      <Grid container xs={12} justifyContent="center">
        {/* apparently Grid can't accept a ref (even though it works...) so adding a Box to capture the container width */}
        <Box ref={graphContainerRef} width="100%" height="100%">
          {bodyweightData && (
            // need to specify a height or the grid and container will both defer to each other and result in zero height
            <ResponsiveContainer height={windowHeight}>
              <LineChart
                data={graphBodyweightData}
                margin={{
                  top: 20,
                  right: 5,
                  left: 15,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="epochDate"
                  type="number"
                  tickFormatter={(value) =>
                    dayjs.unix(value).format(DATE_FORMAT)
                  }
                  domain={['auto', 'auto']}
                  angle={-25}
                  scale="time"
                  textAnchor="end"
                  tickMargin={10}
                  height={80}
                />
                <YAxis
                  name="weight"
                  dataKey="value"
                  type="number"
                  unit=" kg"
                  domain={['auto', 'auto']}
                ></YAxis>
                {/* line color is "stroke" */}
                {showSmoothedBw ? (
                  <Line
                    name="bodyweight (smoothed)"
                    dataKey="value"
                    type="basis"
                  />
                ) : (
                  <Line name="bodyweight" dataKey="value" type="monotone" />
                )}
                {/* todo: possible to show weigh-in type in tooltip? */}
                <Tooltip
                  trigger={isDesktop ? 'hover' : 'click'}
                  labelFormatter={convertEpochToDate}
                  formatter={(value, _, { payload }) =>
                    `${value} kg${
                      payload.type === 'unofficial' ? ' (unofficial)' : ''
                    }`
                  }
                />
                {/* todo: only show if multiple lines */}
                <Legend verticalAlign="top" height={30} />
                <Brush
                  dataKey="epochDate"
                  tickFormatter={convertEpochToDate}
                  // these doesn't accept percentages...
                  width={graphContainerWidth * 0.6}
                  // could only eyeball this trying to get it centered.
                  x={graphContainerWidth * 0.2}
                  // todo: startIndex ~30 days prior to highest date
                  startIndex={getStartIndex()}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Grid>
      <Grid xs={12}>
        <HistoryCardsSwiper
          query={query}
          actions={['recordNotes', 'exerciseNotes', 'manage']}
          content={['exercise', 'modifiers', 'setType', 'sets']}
          cardProps={{ elevation: 3, sx: { m: 0.5, px: 1 } }}
        />
      </Grid>
    </Grid>
  )
}

// todo in graph:
// brush for panning / zooming
// date axis
