import {
  Box,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Switch,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import StyledDivider from 'components/StyledDivider'
import QueryForm from 'components/history/QueryForm'
import RecordDisplay from 'components/history/RecordDisplay'
import RecordDisplaySelect from 'components/history/RecordDisplaySelect'
import HistoryCardsSwiper from 'components/session/history/HistoryCardsSwiper'
import dayjs from 'dayjs'
import { DATE_FORMAT, DEFAULT_CLOTHING_OFFSET } from 'lib/frontend/constants'
import { useBodyweightHistory, useRecords } from 'lib/frontend/restService'
import useDesktopCheck from 'lib/frontend/useDesktopCheck'
import Record from 'models/Record'
import { Set } from 'models/Set'
import { RecordHistoryQuery } from 'models/query-filters/RecordQuery'
import { useCallback, useEffect, useMemo, useState } from 'react'
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

interface GraphData {
  epochDate: number
  /** value can be either a raw number, or formatted string representing a number */
  value: number | string
}

const convertEpochToDate = (value: number) =>
  dayjs.unix(value).format('YYYY-MM-DD')

/** Get the earliest index within the given dayRange.
 *  There can be an arbitrary amount of data points within the range,
 *  so we need to calculate where to start by looking at the dates.
 */
const getStartIndex = (data: GraphData[], dayRange = 60) => {
  let i = data.length - 1

  if (i < 0) return 0

  let mostRecentDate = data[i].epochDate
  const startDate = dayjs(mostRecentDate).add(-dayRange, 'day').unix()

  while (mostRecentDate > startDate) {
    // return if we reached the beginning of the array without hitting the limit
    if (!i) return i

    mostRecentDate = data[--i].epochDate
  }

  // if we did hit the limit we've gone past it by one
  return i + 1
}
interface Props {
  query?: RecordHistoryQuery
}
export default function HistoryGraph({ query }: Props) {
  const { data: bodyweightData } = useBodyweightHistory()
  const [showBodyweight, setShowBodyweight] = useState(true)
  const [includeUnofficial, setIncludeUnofficial] = useState(false)
  const [clothingOffset, setClothingOffset] = useState(DEFAULT_CLOTHING_OFFSET)
  const [smoothLine, setSmoothLine] = useState(false)
  const lineType = smoothLine ? 'basis' : 'monotone'
  const [recordDisplay, setRecordDisplay] = useState<RecordDisplay>({
    field: 'weight',
    operator: 'highest',
  })
  const { palette } = useTheme()
  const { records } = useRecords(query, !!query)

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

  const setReducer = useCallback(
    (prev: number, set: Set, i: number) => {
      let reducer
      switch (recordDisplay.operator) {
        case 'highest':
          reducer = Math.max
          break
        case 'lowest':
          reducer = Math.min
          break
        case 'average':
          // calculates the running average, instead of dividing at the end
          reducer = (avg: number, next: number, i: number) =>
            (next + (i + 1) * avg) / (1 + 2)
          break
        case 'total':
          // total weight should have weight x reps (or add a volume field?)
          reducer = (a: number, b: number) => a + b
          break
      }
      return reducer(prev, Number(set[recordDisplay.field]) || 0, i)
    },
    [recordDisplay.field, recordDisplay.operator]
  )

  const recordGraphData = useMemo((): GraphData[] => {
    if (!records) return []

    return records
      .map((record) => ({
        epochDate: dayjs(record.date).unix(),

        value: record.sets
          .reduce(
            setReducer,
            recordDisplay.operator === 'lowest' ? Infinity : 0
          )
          .toFixed(2),
      }))
      .sort((a, b) => a.epochDate - b.epochDate)
  }, [recordDisplay.operator, records, setReducer])

  const bodyweightGraphData = useMemo((): GraphData[] => {
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
      .map((bw) => ({ value: bw.value, epochDate: dayjs(bw.date).unix() }))
      .sort((a, b) => a.epochDate - b.epochDate)
  }, [
    unofficialBWs,
    officialBWs,
    showBodyweight,
    includeUnofficial,
    clothingOffset,
  ])

  return (
    <Grid container spacing={2}>
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
                checked={smoothLine}
                onChange={() => setSmoothLine(!smoothLine)}
              />
            }
            label="Use smoothed line"
          />
        </FormGroup>
      </Grid>
      <Grid xs={4}>
        <TextField
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

      <Grid xs={12}>
        <RecordDisplaySelect
          recordDisplay={recordDisplay}
          updateRecordDisplay={(changes) =>
            setRecordDisplay((prev) => ({ ...prev, ...changes }))
          }
        />
      </Grid>

      <Grid xs={12} height="100%" flex="1 1 auto"></Grid>
      <Grid container xs={12} justifyContent="center">
        {/* apparently Grid can't accept a ref (even though it works...) so adding a Box to capture the container width */}
        <Box ref={graphContainerRef} width="100%" height="100%">
          {bodyweightData && (
            // need to specify a height or the grid and container will both defer to each other and result in zero height
            <ResponsiveContainer height={windowHeight}>
              <LineChart
                margin={{
                  top: 20,
                  right: 5,
                  left: 15,
                  bottom: 10,
                }}
                onClick={(s) => console.log(s)}
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
                  // Prevent tooltip from not showing correct values when multiple lines exist.
                  // This is apparently an open bug, because it should only affect an XAxis with type="category"
                  // See: https://github.com/recharts/recharts/issues/3044#issuecomment-1322056012
                  allowDuplicatedCategory={false}
                />
                <YAxis
                  yAxisId="bodyweight"
                  name="weight"
                  dataKey="value"
                  type="number"
                  unit=" kg"
                  orientation="right"
                  stroke="green"
                  domain={['auto', 'auto']}
                />
                {showBodyweight && (
                  <Line
                    yAxisId="bodyweight"
                    name="bodyweight"
                    dataKey="value"
                    type={lineType}
                    stroke="green"
                    data={bodyweightGraphData}
                  />
                )}
                <YAxis
                  yAxisId="exercise"
                  name="weight"
                  dataKey="value"
                  type="number"
                  unit=" kg"
                  orientation="left"
                  // line color
                  stroke={palette.primary.dark}
                  domain={['auto', 'auto']}
                />
                <Line
                  yAxisId="exercise"
                  name={query?.exercise}
                  dataKey="value"
                  stroke={palette.primary.dark}
                  type={lineType}
                  data={recordGraphData}
                />
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
                  startIndex={getStartIndex(bodyweightGraphData)}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Grid>
    </Grid>
  )
}
