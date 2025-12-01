import dayjs from 'dayjs'
import { useReducer } from 'react'

interface State {
  enabled: boolean
  isRunning: boolean
  /** When the session is marked as finished the timer will show the total session time. */
  isFinished: boolean
  /** Value displayed, in ms */
  displayValue: number
  /** When the timer was initially started. Used to calculate total time. Total time cannot be paused or reset. */
  startTime: number
  /** When the timer was started / resumed. Note: pause/resume has been removed. */
  resumeTime: number
  /** Delta time between current and resume time is added here when timer is paused */
  accumulatedTime: number
}

interface Action {
  type: 'start' | 'stop' | 'reset' | 'tick' | 'finish'
}

const initialTimerState: State = {
  enabled: false,
  isRunning: false,
  isFinished: false,
  startTime: 0,
  resumeTime: 0,
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
    case 'finish':
      return {
        ...state,
        isRunning: false,
        isFinished: true,
        displayValue: now - state.startTime,
      }
    case 'reset':
      return {
        ...state,
        resumeTime: dayjs().valueOf(),
        isRunning: true,
        accumulatedTime: 0,
        displayValue: 0,
        isFinished: false,
      }
    case 'tick':
      return {
        ...state,
        displayValue: deltaTime + state.accumulatedTime,
      }
  }
}

export default function useClockReducer() {
  return useReducer(clockReducer, initialTimerState)
}
