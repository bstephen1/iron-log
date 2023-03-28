import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ReplayIcon from '@mui/icons-material/Replay'
import StopIcon from '@mui/icons-material/Stop'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useReducer } from 'react'

const formatTime = (totalSeconds: number) => {
  const hours = ('0' + Math.floor(totalSeconds / 3600)).slice(-2)
  const minutes = ('0' + Math.floor((totalSeconds / 60) % 60)).slice(-2)
  const seconds = ('0' + Math.floor(totalSeconds % 60)).slice(-2)
  // tracking ms seems like overkill.
  // const totalMs = totalSeconds * 1000
  // const ms = ('0' + (totalMs - Math.floor(totalMs))).slice(-2)

  return `${hours}:${minutes}:${seconds}`
}

interface State {
  enabled: boolean
  isRunning: boolean
  /** Value displayed, in ms */
  displayValue: number
  /** When the timer was initially started. Used to calculate total time. Total time cannot be paused or reset. */
  startTime: number
  /** When the timer was started / resumed. */
  resumeTime: number
  /** Delta time between current and resume time is added here when timer is paused */
  accumulatedTime: number
}

interface Action {
  type: 'start' | 'stop' | 'reset' | 'tick' | 'pause' | 'resume'
}

const initialTimerState: State = {
  enabled: false,
  startTime: 0,
  resumeTime: 0,
  isRunning: false,
  displayValue: 0,
  accumulatedTime: 0,
}

// this is essentially a stopwatch with limited functionality (we probably don't want/need a full stopwatch here)
function clockReducer(state: State, action: Action): State {
  const now = dayjs().valueOf()
  const deltaTime = state.isRunning ? now - state.resumeTime : 0
  switch (action.type) {
    case 'start':
      return {
        ...state,
        startTime: now,
        resumeTime: now,
        isRunning: true,
        enabled: true,
      }
    case 'stop':
      return initialTimerState
    case 'reset':
      return {
        ...state,
        resumeTime: dayjs().valueOf(),
        accumulatedTime: 0,
        displayValue: 0,
      }
    case 'pause':
      return {
        ...state,
        isRunning: false,
        accumulatedTime: state.accumulatedTime + deltaTime,
      }
    case 'resume':
      return { ...state, isRunning: true, resumeTime: now, startTime: now }
    case 'tick':
      return {
        ...state,
        displayValue: deltaTime + state.accumulatedTime,
      }
    default:
      throw new Error('unexpected action type given to reducer')
  }
}

// todo: blink on pause?
// const blink = keyframes`
//   from { opacity: 0; }
//   to { opacity: 1; }
// `

// const BlinkedBox = styled('div')({
//   animation: `${blink} 1s linear infinite`,
// })

export default function RestTimer() {
  const [state, dispatch] = useReducer(clockReducer, initialTimerState)
  const { isRunning, displayValue } = state
  // this needs to be <1000 so the rest time can tick out of sync with the total time
  const millisecondsPerInterval = 100

  const formatDeltaTime = (ms: number) => formatTime(ms / 1000)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      // calculating a delta is more accurate and reliable than incrementing the time
      // based on the interval (esp when the app loses focus)
      dispatch({ type: 'tick' })
    }, millisecondsPerInterval)

    return () => clearInterval(interval)
  }, [isRunning])

  return (
    <>
      <Stack justifyContent="center">
        {!state.enabled ? (
          // extra box so button isn't full width
          <Box display="flex" justifyContent="center">
            <Button onClick={() => dispatch({ type: 'start' })}>
              Start Rest Timer
            </Button>
          </Box>
        ) : (
          <>
            {/* <Typography>Total time: {formatDeltaTime(deltaTime)}</Typography> */}
            <Typography
              variant="h3"
              textAlign="center"
              // component={isRunning ? Box : BlinkedBox}
            >
              {formatDeltaTime(displayValue)}
            </Typography>
            <Stack
              direction="row"
              justifyContent="center"
              spacing={2}
              sx={{ pb: 2, pt: 1 }}
            >
              {isRunning ? (
                <IconButton
                  onClick={() => dispatch({ type: 'pause' })}
                  color="primary"
                  sx={{ height: 40 }}
                >
                  <PauseIcon />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => dispatch({ type: 'resume' })}
                  color="primary"
                >
                  <PlayArrowIcon />
                </IconButton>
              )}
              <IconButton
                onClick={() => dispatch({ type: 'reset' })}
                color="primary"
              >
                <ReplayIcon />
              </IconButton>
              <IconButton
                onClick={() => dispatch({ type: 'stop' })}
                color="primary"
              >
                <StopIcon />
              </IconButton>
            </Stack>
          </>
        )}
      </Stack>
    </>
  )
}
