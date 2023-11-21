import { Box, Stack, useTheme } from '@mui/material'
import RecordDisplay from 'components/history/RecordDisplay'
import { getUnit } from 'components/session/records/SetTypeSelect'
import dayjs from 'dayjs'
import { DATE_FORMAT, DEFAULT_CLOTHING_OFFSET } from 'lib/frontend/constants'
import { useBodyweightHistory, useRecords } from 'lib/frontend/restService'
import useDesktopCheck from 'lib/frontend/useDesktopCheck'
import { UpdateState } from 'lib/util'
import Bodyweight from 'models/Bodyweight'
import { DEFAULT_DISPLAY_FIELDS } from 'models/DisplayFields'
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
import GraphOptionsForm, { GraphOptions } from './GraphOptionsForm'

// Note: values must be numbers. Y axis scaling gets messed up with strings.
interface GraphData {
  unixDate: number
  value?: number
  bodyweight?: number
}

const emptyBwArray: Bodyweight[] = []

const convertUnixToDate = (value: number) =>
  dayjs.unix(value).format('YYYY-MM-DD')

/** Get the earliest index within the given dayRange.
 *  There can be an arbitrary amount of data points within the range,
 *  so we need to calculate where to start by looking at the dates.
 */
const getStartIndex = (data: GraphData[], dayRange = 60) => {
  let i = data.length - 1

  if (i < 0) return 0

  let mostRecentDate = data[i].unixDate
  const startDate = dayjs(mostRecentDate).add(-dayRange, 'day').unix()

  while (mostRecentDate > startDate) {
    // return if we reached the beginning of the array without hitting the limit
    if (!i) return i

    mostRecentDate = data[--i].unixDate
  }

  // if we did hit the limit we've gone past it by one
  return i + 1
}
interface Props {
  query?: RecordHistoryQuery
}
export default function HistoryGraph({ query }: Props) {
  // BWs and records are sorted newest first. It looks more natural in the
  // swiper to start on the right and move left vs oldest first.
  const { data: bodyweightData } = useBodyweightHistory()
  const [recordDisplay, setRecordDisplay] = useState<RecordDisplay>({
    field: 'weight',
    operator: 'highest',
  })
  const [graphOptions, setGraphOptions] = useState<GraphOptions>({
    clothingOffset: DEFAULT_CLOTHING_OFFSET,
    showBodyweight: true,
  })
  const { smoothLine, clothingOffset, showBodyweight, includeUnofficial } =
    graphOptions
  const lineType = smoothLine ? 'basis' : 'monotone'
  const { palette } = useTheme()
  // only fetch if there is an exercise selected
  const { records } = useRecords(query, !!query?.exercise)

  const updateRecordDisplay: UpdateState<RecordDisplay> = (changes) =>
    setRecordDisplay((prev) => ({ ...prev, ...changes }))
  const updateGraphOptions: UpdateState<GraphOptions> = (changes) =>
    setGraphOptions((prev) => ({ ...prev, ...changes }))

  const isDesktop = useDesktopCheck()

  const officialBWs = useMemo(
    () => bodyweightData?.filter((bw) => bw.type === 'official'),
    [bodyweightData]
  )
  /** Bodyweight will only be official weigh-ins by default,
   *  but if "includeUnofficial" is set it includes all weigh-ins, and adds clothing
   * offset to official weigh-ins to simulate an unofficial gym weight.
   */
  const bodyweightGraphData = useMemo(
    () => (includeUnofficial ? bodyweightData : officialBWs) ?? emptyBwArray,
    [bodyweightData, includeUnofficial, officialBWs]
  )

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

  const graphData = useMemo((): GraphData[] => {
    if (!records) return []

    // when there's no exercise, just show BW data
    if (!query?.exercise) {
      return bodyweightGraphData
        .map((bw) => ({
          unixDate: dayjs(bw.date).unix(),
          bodyweight: bw.value,
        }))
        .reverse() // data is sorted newest first, so we have to reverse it
    }

    let latestBwIndex = 0
    return records
      .map((record) => {
        const recordUnixDate = dayjs(record.date).unix()
        // add most recent bw to data. Takes advantage of api data being
        // presorted from newest to oldest date.
        while (
          bodyweightGraphData[latestBwIndex] &&
          dayjs(bodyweightGraphData[latestBwIndex].date).unix() > recordUnixDate
        ) {
          latestBwIndex++
        }

        const latestBw = bodyweightGraphData[latestBwIndex]
        const bodyweight =
          includeUnofficial && latestBw.type === 'official'
            ? latestBw.value + clothingOffset
            : latestBw.value

        const value = record.sets.reduce(
          setReducer,
          recordDisplay.operator === 'lowest' ? Infinity : 0
        )

        return {
          unixDate: recordUnixDate,
          // Round to 2 decimal places, while preserving number type.
          value: Math.round(value * 1e2) / 1e2,
          bodyweight: bodyweight ?? 0,
        }
      })
      .reverse()
  }, [
    bodyweightGraphData,
    clothingOffset,
    includeUnofficial,
    query?.exercise,
    recordDisplay.operator,
    records,
    setReducer,
  ])

  return (
    <Stack spacing={2}>
      <GraphOptionsForm
        {...{
          graphOptions,
          updateGraphOptions,
          recordDisplay,
          updateRecordDisplay,
        }}
      />

      <Box height="100%" flex="1 1 auto"></Box>
      <Box
        ref={graphContainerRef}
        width="100%"
        height="100%"
        justifyContent="center"
      >
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
              // todo: scroll to card
              onClick={(s) => console.log(s)}
              data={graphData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="unixDate"
                type="number"
                tickFormatter={(value) => dayjs.unix(value).format(DATE_FORMAT)}
                domain={['auto', 'auto']}
                angle={-25}
                scale="time"
                textAnchor="end"
                tickMargin={10}
                height={80}
              />
              {showBodyweight && (
                <>
                  <YAxis
                    yAxisId="bodyweight"
                    name="bodyweight"
                    dataKey="bodyweight"
                    type="number"
                    unit=" kg"
                    orientation={query?.exercise ? 'right' : 'left'}
                    stroke="green"
                    domain={['auto', 'auto']}
                  />
                  <Line
                    yAxisId="bodyweight"
                    name="bodyweight"
                    dataKey="bodyweight"
                    type={lineType}
                    stroke="green"
                  />
                </>
              )}
              {query?.exercise && (
                <>
                  <YAxis
                    yAxisId="exercise"
                    name={recordDisplay.field}
                    dataKey="value"
                    type="number"
                    // note the whitespace!
                    unit={` ${getUnit(
                      recordDisplay.field,
                      // todo: units
                      DEFAULT_DISPLAY_FIELDS.units
                    )}`}
                    orientation="left"
                    // line color
                    stroke={palette.primary.dark}
                    domain={['auto', 'auto']}
                  />

                  <Line
                    yAxisId="exercise"
                    name={query.exercise}
                    dataKey="value"
                    stroke={palette.primary.dark}
                    type={lineType}
                  />
                </>
              )}
              {/* todo: possible to show weigh-in type in tooltip? */}
              <Tooltip
                trigger={isDesktop ? 'hover' : 'click'}
                labelFormatter={convertUnixToDate}
                formatter={(value, _, { payload }) =>
                  `${value} kg${
                    payload.type === 'unofficial' ? ' (unofficial)' : ''
                  }`
                }
              />
              {/* todo: only show if multiple lines */}
              <Legend verticalAlign="top" height={30} />
              <Brush
                dataKey="unixDate"
                tickFormatter={convertUnixToDate}
                // these doesn't accept percentages...
                width={graphContainerWidth * 0.6}
                // could only eyeball this trying to get it centered.
                x={graphContainerWidth * 0.2}
                startIndex={getStartIndex(graphData)}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Stack>
  )
}
