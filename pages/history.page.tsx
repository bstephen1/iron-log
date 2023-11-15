import {
  Box,
  Divider,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import StyledDivider from 'components/StyledDivider'
import QueryForm from 'components/history/QueryForm'
import HistoryCardsSwiper from 'components/session/history/HistoryCardsSwiper'
import dayjs from 'dayjs'
import { DATE_FORMAT, DEFAULT_CLOTHING_OFFSET } from 'lib/frontend/constants'
import { useBodyweightHistory } from 'lib/frontend/restService'
import useDesktopCheck from 'lib/frontend/useDesktopCheck'
import Bodyweight from 'models/Bodyweight'
import { RecordHistoryQuery } from 'models/query-filters/RecordQuery'
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
import useResizeObserver from 'use-resize-observer'

interface GraphBodyweight extends Bodyweight {
  epochDate: number
}

type HistoryMode = 'graph' | 'card'

export default function HistoryPage() {
  const theme = useTheme()
  const { data: bodyweightData } = useBodyweightHistory()
  const [showBodyweight, setShowBodyweight] = useState(true)
  const [includeUnofficial, setIncludeUnofficial] = useState(false)
  const [clothingOffset, setClothingOffset] = useState(DEFAULT_CLOTHING_OFFSET)
  const [showSmoothedBw, setShowSmoothedBw] = useState(false)
  const [query, setQuery] = useState<RecordHistoryQuery>()
  const [mode, setMode] = useState<HistoryMode>('card')

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

  // todo: scroll snap?
  return (
    <Grid container spacing={2}>
      <Grid xs={12} display="flex" justifyContent="center">
        <Typography>History</Typography>
      </Grid>
      <Grid xs={12}>
        <QueryForm {...{ query, setQuery }} />
        {/* <QueryCard {...{ query, setQuery }} /> */}
      </Grid>
      <Grid xs={12}>
        <Divider sx={{ pb: 2 }}>Graph</Divider>
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
      <Grid xs={12} height="100%" flex="1 1 auto">
        {/* thinking there shouldn't be an option, just show both at once */}
        <ToggleButtonGroup
          color="primary"
          value={mode}
          exclusive
          size="small"
          onChange={(_, value) => setMode(value)}
          aria-label="History mode"
        >
          <ToggleButton value="card">Cards</ToggleButton>
          <ToggleButton value="graph">Graph</ToggleButton>
        </ToggleButtonGroup>
      </Grid>

      <Grid xs={12}>
        <StyledDivider />
      </Grid>

      <Grid xs={12} display={mode === 'card' ? 'block' : 'none'}>
        <HistoryCardsSwiper
          query={query}
          actions={['recordNotes', 'exerciseNotes', 'manage']}
          content={['exercise', 'modifiers', 'setType', 'sets']}
          cardProps={{ elevation: 3, sx: { m: 0.5, px: 1 } }}
          swiperProps={{
            breakpoints: {
              [theme.breakpoints.values.sm]: {
                slidesPerView: 1,
              },
              [theme.breakpoints.values.md]: {
                slidesPerView: 2,
                centeredSlides: false,
                centerInsufficientSlides: true,
              },
              [theme.breakpoints.values.lg]: {
                slidesPerView: 3,
                centeredSlides: true,
                centerInsufficientSlides: false,
              },
            },
          }}
        />
      </Grid>
      <Grid xs={12} height="100%" flex="1 1 auto"></Grid>
      <Grid
        container
        xs={12}
        justifyContent="center"
        display={mode === 'graph' ? 'block' : 'none'}
      >
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
    </Grid>
  )
}

// todo in graph:
// brush for panning / zooming
// date axis
