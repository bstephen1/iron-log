import { Box, Button, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useReducer } from 'react'
import { formatTimeFromSeconds } from '../../../lib/util'

import { styled } from '@mui/material/styles'
import { keyframes } from '@mui/system'

interface State {
  isRunning: boolean
  deltaTime: number
  deltaRestTime: number
  initialTime: number
  initialRestTime: number
}

interface Action {
  type: 'start' | 'resetRest' | 'tick' | 'pause' | 'resume'
}

// this is essentially a stopwatch with limited functionality (we probably don't want/need a full stopwatch here)
function clockReducer(state: State, action: Action) {
  const time = dayjs().valueOf()
  switch (action.type) {
    case 'start':
      return {
        ...state,
        initialTime: time,
        initialRestTime: time,
        isRunning: true,
      }
    case 'resetRest':
      return { ...state, deltaRestTime: 0, initialRestTime: dayjs().valueOf() }
    case 'pause':
      return { ...state, isRunning: false }
    case 'resume':
      return { ...state, isRunning: true }
    case 'tick':
      return {
        ...state,
        deltaTime: time - state.initialTime,
        deltaRestTime: time - state.initialRestTime,
      }
    default:
      throw new Error('unexpected action type given to reducer')
  }
}

const blink = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const BlinkedBox = styled('div')({
  animation: `${blink} 1s linear infinite`,
})

export default function RestTimer() {
  const initialClockState: State = {
    initialTime: dayjs().valueOf(),
    initialRestTime: dayjs().valueOf(),
    isRunning: false,
    deltaTime: 0,
    deltaRestTime: 0,
  }

  const [state, dispatch] = useReducer(clockReducer, initialClockState)
  const { isRunning, deltaTime, deltaRestTime } = state
  // this needs to be <1000 so the rest time can tick out of sync with the total time
  const millisecondsPerInterval = 100

  const formatDeltaTime = (ms: number) => formatTimeFromSeconds(ms / 1000)

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
      {!isRunning && !deltaTime ? (
        <Stack direction="row" justifyContent="center">
          <Button onClick={() => dispatch({ type: 'start' })}>
            Start Rest Timer
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" justifyContent="space-between">
          {/* <Typography>Total time: {formatDeltaTime(deltaTime)}</Typography> */}
          <Typography variant="h3" component={isRunning ? Box : BlinkedBox}>
            {formatDeltaTime(deltaRestTime)}
          </Typography>
          {isRunning ? (
            <Button onClick={() => dispatch({ type: 'pause' })}>Pause</Button>
          ) : (
            <Button onClick={() => dispatch({ type: 'resume' })}>Resume</Button>
          )}
          <Button onClick={() => dispatch({ type: 'resetRest' })}>Reset</Button>
        </Stack>
      )}
    </>
  )
}
