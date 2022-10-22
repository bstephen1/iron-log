import { Button, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useReducer } from 'react'

interface State {
  isRunning: boolean
  deltaTime: number
  deltaRestTime: number
  initialTime: number
  initialRestTime: number
}

interface Action {
  type: 'start' | 'resetRest' | 'tick'
}

//this is essentially a stopwatch with limited functionality (we probably don't want/need a full stopwatch here)
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

export default function Clock() {
  const initialClockState: State = {
    initialTime: dayjs().valueOf(),
    initialRestTime: dayjs().valueOf(),
    isRunning: false,
    deltaTime: 0,
    deltaRestTime: 0,
  }

  const [state, dispatch] = useReducer(clockReducer, initialClockState)
  const { isRunning, deltaTime, deltaRestTime } = state
  //this needs to be <1000 so the rest time can tick out of sync with the total time
  const millisecondsPerInterval = 100

  function formatDeltaTime(milliseconds: number) {
    const totalSeconds = milliseconds / 1000
    const hours = ('0' + Math.floor(totalSeconds / 3600)).slice(-2)
    const minutes = ('0' + Math.floor((totalSeconds / 60) % 60)).slice(-2)
    const seconds = ('0' + Math.floor(totalSeconds % 60)).slice(-2)

    return `${hours}:${minutes}:${seconds}`
  }

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      //calculating a delta is more accurate and reliable than incrementing the time
      //based on the interval (esp when the app loses focus)
      dispatch({ type: 'tick' })
    }, millisecondsPerInterval)

    return () => clearInterval(interval)
  }, [isRunning])

  return (
    <>
      {!isRunning && !deltaTime ? (
        <Stack direction="row" justifyContent="center">
          <Button onClick={() => dispatch({ type: 'start' })}>
            Start Session Clock
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" justifyContent="space-between">
          <Typography>Total time: {formatDeltaTime(deltaTime)}</Typography>
          <Button onClick={() => dispatch({ type: 'resetRest' })}>
            Reset Rest Time
          </Button>
          <Typography>Rest time: {formatDeltaTime(deltaRestTime)}</Typography>
        </Stack>
      )}
    </>
  )
}
