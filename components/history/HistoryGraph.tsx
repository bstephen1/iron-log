import Box from '@mui/material/Box'
import { green, grey } from '@mui/material/colors'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'
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
import type { CategoricalChartFunc } from 'recharts/types/chart/types'
import type RecordDisplay from '../../components/history/RecordDisplay'
import type { RecordDisplayGrouping } from '../../components/history/RecordDisplay'
import {
  DATE_FORMAT,
  DEFAULT_CLOTHING_OFFSET,
} from '../../lib/frontend/constants'
import { useBodyweights, useRecords } from '../../lib/frontend/restService'
import useDesktopCheck from '../../lib/frontend/useDesktopCheck'
import type { PartialUpdate } from '../../lib/types'
import type { Bodyweight } from '../../models/Bodyweight'
import { DEFAULT_DISPLAY_FIELDS } from '../../models/DisplayFields'
import type { Record, RecordQuery } from '../../models/Record'
import type { Set } from '../../models/Set'
import useDarkMode from '../useDarkMode'
import GraphOptionsForm, { type GraphOptions } from './GraphOptionsForm'

// Note: values must be numbers. Y axis scaling gets messed up with strings.
interface GraphData {
  unixDate: number
  value?: number
  bodyweight?: number
}

const emptyBwArray: Bodyweight[] = []

const convertUnixToDate = (value: number, grouping: RecordDisplayGrouping) => {
  const day = dayjs.unix(value)
  switch (grouping) {
    case 'daily':
      return day.format(DATE_FORMAT)
    case 'weekly': {
      const endDate = day.endOf('week').date()
      return day.format(`MMM DD-${endDate} YYYY`)
    }
    case 'monthly':
      return day.format('MMM YYYY')
  }
}

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
  query: RecordQuery
  swipeToRecord: (i: number) => void
}
export default function HistoryGraph({ query, swipeToRecord }: Props) {
  const { palette } = useTheme()
  const isDark = useDarkMode()
  const bodyweightColor = isDark ? green[500] : green[800]
  const exerciseColor = palette.primary[isDark ? 'light' : 'dark']

  // BWs and records are sorted newest first. It looks more natural in the
  // swiper to start on the right and move left vs oldest first.
  const { data: bodyweightData } = useBodyweights({
    limit: query.limit,
    start: query.start,
    end: query.end,
  })
  const { data: earliestRecordOfficialBw } = useBodyweights({
    end: query.start,
    limit: 1,
    type: 'official',
  })
  const { data: earliestRecordAnyBw } = useBodyweights({
    end: query.start,
    limit: 1,
  })
  const [recordDisplay, setRecordDisplay] = useState<RecordDisplay>({
    grouping: 'daily',
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
  // only fetch if there is an exercise selected
  const { data: records } = useRecords(query, !!query.exercise)

  const updateRecordDisplay: PartialUpdate<RecordDisplay> = (changes) =>
    setRecordDisplay((prev) => ({ ...prev, ...changes }))
  const updateGraphOptions: PartialUpdate<GraphOptions> = (changes) =>
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
  const bodyweightGraphData = useMemo(() => {
    const baseData =
      (includeUnofficial ? bodyweightData : officialBWs) ?? emptyBwArray
    const earliestRecordBw =
      (includeUnofficial ? earliestRecordAnyBw : earliestRecordOfficialBw) ??
      emptyBwArray
    // When querying records with a set start date, there needs to be one extra bw
    // record from before the start date to associate with the first record.
    // Note: BWs are sorted newest to oldest, so it goes at the end.
    return query.exercise && query.start
      ? [...baseData, ...earliestRecordBw]
      : baseData
  }, [
    bodyweightData,
    earliestRecordAnyBw,
    earliestRecordOfficialBw,
    includeUnofficial,
    officialBWs,
    query.exercise,
    query.start,
  ])

  // to track width we want to use the size of the graph container, since that will be smaller than window width
  const { ref: graphContainerRef, width: graphContainerWidth = 0 } =
    useResizeDetector()

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

  const handleGraphClick: CategoricalChartFunc = ({
    activeLabel: unixDate,
  }) => {
    if (!records || !unixDate) return

    const date = dayjs.unix(+unixDate).format(DATE_FORMAT)
    const index = records.findIndex((record) => record.date === date)

    // have to reverse the index since swiper is also reversed
    swipeToRecord(records.length - 1 - index)
  }

  const setReducer = useCallback(
    (prev: number, set: Set, i: number) => {
      let reducer: (...args: number[]) => number
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
    // when there's no exercise, just show BW data
    if (!query.exercise || !records) {
      return bodyweightGraphData.map((bw) => ({
        unixDate: dayjs(bw.date).unix(),
        bodyweight: bw.value,
      }))
    }

    let latestBwIndex = 0
    return records
      .reduce<Record[]>((acc, record) => {
        const last = acc.pop()
        if (!last) {
          const formattedDate =
            recordDisplay.grouping === 'weekly'
              ? dayjs(record.date).startOf('week').format(DATE_FORMAT)
              : record.date
          return [{ ...record, date: formattedDate }]
        }

        switch (recordDisplay.grouping) {
          case 'daily': {
            return acc.concat([last, record])
          }
          case 'weekly': {
            const lastDay = dayjs(last.date).startOf('week')
            const curDay = dayjs(record.date).startOf('week')

            return acc.concat(
              lastDay.isSame(curDay)
                ? [{ ...last, sets: last.sets.concat(record.sets) }]
                : [last, { ...record, date: curDay.format(DATE_FORMAT) }]
            )
          }
          case 'monthly': {
            const lastDay = dayjs(last.date).startOf('month')
            const curDay = dayjs(record.date).startOf('month')

            return acc.concat(
              lastDay.isSame(curDay)
                ? [{ ...last, sets: last.sets.concat(record.sets) }]
                : [last, { ...record, date: curDay.format(DATE_FORMAT) }]
            )
          }
          default: {
            throw new Error(`unsupported grouping: ${recordDisplay.grouping}`)
          }
        }
      }, [])
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

        const latestBw =
          latestBwIndex < bodyweightGraphData.length
            ? bodyweightGraphData[latestBwIndex]
            : undefined
        const bodyweight =
          includeUnofficial && latestBw?.type === 'official'
            ? latestBw.value + clothingOffset
            : latestBw?.value

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
  }, [
    bodyweightGraphData,
    clothingOffset,
    includeUnofficial,
    query.exercise,
    recordDisplay.operator,
    records,
    setReducer,
    recordDisplay.grouping,
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
        {/* need to specify a height or the grid and container will both defer to each other and result in zero height */}
        <ResponsiveContainer height={windowHeight}>
          <LineChart
            margin={{
              top: 20,
              right: 5,
              left: 15,
              bottom: 10,
            }}
            // todo: scroll to card
            onClick={handleGraphClick}
            data={graphData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="unixDate"
              type="number"
              // always use monthly to keep it short and not cut off
              tickFormatter={(value: number) =>
                convertUnixToDate(value, 'monthly')
              }
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
                  orientation={query.exercise ? 'right' : 'left'}
                  stroke={bodyweightColor}
                  domain={['auto', 'auto']}
                />
                <Line
                  yAxisId="bodyweight"
                  name="bodyweight"
                  dataKey="bodyweight"
                  type={lineType}
                  stroke={bodyweightColor}
                  dot={false}
                />
              </>
            )}
            {query.exercise && (
              <>
                <YAxis
                  yAxisId="exercise"
                  name={recordDisplay.field}
                  dataKey="value"
                  type="number"
                  // todo: get units from exercise
                  // note the whitespace!
                  unit={` ${DEFAULT_DISPLAY_FIELDS.units[recordDisplay.field]}`}
                  orientation="left"
                  // line color
                  stroke={exerciseColor}
                  domain={['auto', 'auto']}
                />

                <Line
                  yAxisId="exercise"
                  name={query.exercise}
                  dataKey="value"
                  stroke={exerciseColor}
                  type={lineType}
                  dot={false}
                />
              </>
            )}
            {/* todo: possible to show weigh-in type in tooltip? */}
            <Tooltip
              trigger={isDesktop ? 'hover' : 'click'}
              labelFormatter={(value) =>
                convertUnixToDate(value, recordDisplay.grouping)
              }
              formatter={(value, name) =>
                // todo: add unit to RecordDisplay so it is selectzble
                `${value.toString()} ${
                  DEFAULT_DISPLAY_FIELDS.units[
                    name === 'bodyweight' ? 'weight' : recordDisplay.field
                  ]
                }`
              }
              contentStyle={isDark ? { backgroundColor: grey[800] } : undefined}
            />
            <Legend verticalAlign="top" height={30} />
            <Brush
              dataKey="unixDate"
              tickFormatter={(value) =>
                convertUnixToDate(value, recordDisplay.grouping)
              }
              // these doesn't accept percentages...
              width={graphContainerWidth * 0.6}
              // could only eyeball this trying to get it centered.
              x={graphContainerWidth * 0.2}
              startIndex={getStartIndex(graphData)}
              {...(isDark ? { fill: grey[900], stroke: '#fff' } : {})}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Stack>
  )
}
