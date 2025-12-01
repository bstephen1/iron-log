'use client'
import AlarmIcon from '@mui/icons-material/Alarm'
import AlarmOffIcon from '@mui/icons-material/AlarmOff'
import DoneIcon from '@mui/icons-material/Done'
import EditIcon from '@mui/icons-material/Edit'
import type PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ReplayIcon from '@mui/icons-material/Replay'
import StopIcon from '@mui/icons-material/Stop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grow from '@mui/material/Grow'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { enqueueSnackbar } from 'notistack'
import { useCallback, useEffect, useState } from 'react'
import useLocalStorageState from 'use-local-storage-state'
import { LOCAL_STORAGE } from '../../../lib/frontend/constants'
import { capitalize } from '../../../lib/util/string'
import Tooltip from '../../Tooltip'
import IntervalSettingsDialog from './IntervalSettingsDialog'
import useClockReducer from './useClockReducer'

const formatSecTime = (totalSeconds: number, hideZero?: boolean) => {
  // counting down to zero can produce a few quick glitchy frames, should just keep at 1 sec
  if (hideZero && !Math.floor(totalSeconds)) return '00:00:01'

  const hours = `0${Math.floor(totalSeconds / 3600)}`.slice(-2)
  const minutes = `0${Math.floor((totalSeconds / 60) % 60)}`.slice(-2)
  const seconds = `0${Math.floor(totalSeconds % 60)}`.slice(-2)

  return `${hours}:${minutes}:${seconds}`
}

const formatMsTime = (ms: number) => formatSecTime(ms / 1000)
// this needs to be <1000 so the rest time can tick out of sync with the total time
const millisecondsPerInterval = 100

export interface IntervalSettings {
  /** one time delay before first work rep starts, seconds. Must be greater than or equal to 0 */
  delay: number
  /** working time, seconds. Must be greater than 0 */
  work: number
  /** rest time between working reps, seconds. Must be greater than 0 */
  rest: number
}

interface IntervalTimer extends IntervalSettings {
  mode: 'delay' | 'work' | 'rest'
  /** timestamp of when the last mode switch happened, ms */
  modeStart: number
  /** reps of working intervals completed */
  reps: number
}

export default function RestTimer() {
  const [state, dispatch] = useClockReducer()
  const { isRunning, displayValue, enabled, isFinished } = state
  const [intervalTimer, setIntervalTimer] = useState<
    IntervalTimer | undefined
  >()
  const [intervalSettings] = useLocalStorageState<IntervalSettings>(
    LOCAL_STORAGE.intervalTimer
  )
  const [intervalSettingsOpen, setIntervalSettingsOpen] = useState(false)

  const intervalRemaining = intervalTimer
    ? Math.ceil(
        intervalTimer[intervalTimer.mode] -
          (dayjs().valueOf() - intervalTimer.modeStart) / 1000
      )
    : 0

  const startIntervalTimer = (settings: IntervalSettings) =>
    setIntervalTimer({
      ...settings,
      mode: 'delay',
      modeStart: dayjs().valueOf(),
      reps: 0,
    })

  useEffect(() => {
    if (!intervalTimer || intervalRemaining > 0) return

    setIntervalTimer((prev) => {
      /* c8 ignore next -- prev cannot be undefined */
      if (!prev) return prev
      const modeStart = dayjs().valueOf()

      if (prev.mode === 'delay') {
        return { ...prev, mode: 'work', modeStart }
      } else {
        return {
          ...prev,
          mode: prev.mode === 'work' ? 'rest' : 'work',
          modeStart: dayjs().valueOf(),
          reps: prev.mode === 'work' ? prev.reps + 1 : prev.reps,
        }
      }
    })
  }, [intervalRemaining, intervalTimer])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      // calculating a delta is more accurate and reliable than incrementing the time
      // based on the interval (esp when the app loses focus)
      dispatch({ type: 'tick' })
    }, millisecondsPerInterval)

    return () => clearInterval(interval)
  }, [isRunning, dispatch])

  // this needs to be in a useCallback, or outside the parent component. Will not trigger
  // clicks consistently otherwise.
  const TimerButton = useCallback(
    ({
      action,
      Icon,
      tooltip = '',
      isVisible = true,
    }: {
      action: Parameters<typeof dispatch>[0]['type'] | (() => void)
      Icon: typeof PlayArrowIcon
      tooltip?: string
      isVisible?: boolean
    }) => (
      <Tooltip title={tooltip}>
        <Grow in={isVisible}>
          <IconButton
            onClick={
              typeof action === 'function'
                ? action
                : () => dispatch({ type: action })
            }
            color="primary"
          >
            <Icon />
          </IconButton>
        </Grow>
      </Tooltip>
    ),
    [dispatch]
  )

  return (
    <Stack justifyContent="center">
      {!enabled ? (
        // extra box so button isn't full width
        <Box display="flex" justifyContent="center" pb={2}>
          <Button onClick={() => dispatch({ type: 'start' })}>
            Start rest timer
          </Button>
        </Box>
      ) : (
        <>
          <IntervalSettingsDialog
            open={intervalSettingsOpen}
            setOpen={setIntervalSettingsOpen}
            handleSubmit={(settings) => startIntervalTimer(settings)}
          />
          <Grow in={!isFinished}>
            <Typography
              textAlign="center"
              display={isFinished ? 'none' : 'block'}
            >
              {intervalTimer ? capitalize(intervalTimer.mode) : 'Rest time'}
            </Typography>
          </Grow>
          <Grow in={isFinished}>
            <Typography
              textAlign="center"
              display={isFinished ? 'block' : 'none'}
            >
              Total session time
            </Typography>
          </Grow>

          <Grow in={enabled}>
            <Typography variant="h3" textAlign="center">
              {intervalTimer
                ? formatSecTime(intervalRemaining, true)
                : formatMsTime(displayValue)}
            </Typography>
          </Grow>
          <Stack
            direction="row"
            justifyContent="center"
            spacing={2}
            sx={{ pb: 2 }}
          >
            {!intervalTimer ? (
              <>
                <TimerButton
                  action={() => {
                    intervalSettings
                      ? startIntervalTimer(intervalSettings)
                      : setIntervalSettingsOpen(true)
                  }}
                  Icon={AlarmIcon}
                  tooltip="Start interval timer"
                  isVisible={!isFinished}
                />
                <TimerButton action="reset" Icon={ReplayIcon} tooltip="Reset" />
                <TimerButton action="stop" Icon={StopIcon} tooltip="Turn Off" />
                <TimerButton
                  action="finish"
                  Icon={DoneIcon}
                  tooltip="Finish Session"
                  isVisible={!isFinished}
                />
              </>
            ) : (
              <>
                <TimerButton
                  action={() => {
                    setIntervalTimer(undefined)
                    dispatch({ type: 'reset' })
                    enqueueSnackbar({
                      message: `completed ${intervalTimer.reps} reps`,
                      severity: 'info',
                    })
                  }}
                  Icon={AlarmOffIcon}
                  tooltip="Stop interval timer"
                />
                <TimerButton
                  action={() => {
                    setIntervalSettingsOpen(true)
                  }}
                  Icon={EditIcon}
                  tooltip="Change interval settings"
                />
              </>
            )}
          </Stack>
        </>
      )}
    </Stack>
  )
}
