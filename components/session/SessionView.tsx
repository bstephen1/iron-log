import { Box, IconButton, Stack, useTheme } from '@mui/material'
import {
  addRecord,
  deleteSessionRecord,
  updateSessionLog,
  useGuaranteedSessionLog,
} from 'lib/frontend/restService'
import Exercise from 'models/Exercise'
import Record from 'models/Record'
import SessionLog from 'models/SessionLog'
import RecordCard from './records/RecordCard'
import TitleBar from './upper/TitleBar'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useState } from 'react'
import {
  A11y,
  Keyboard,
  Navigation,
  Pagination,
  Scrollbar,
  Swiper as SwiperClass,
} from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import AddRecordCard from './AddRecordCard'
import HistoryFilter from './history/HistoryFilter'

// Swiper needs all these css classes to be imported too
import dayjs from 'dayjs'
import { Index } from 'lib/util'
import Bodyweight from 'models/Bodyweight'
import Note from 'models/Note'
import 'swiper/css'
import 'swiper/css/bundle'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import CopySessionCard from './CopySessionCard'
import SessionModules from './upper/SessionModules'
import usePaginationSize from './usePaginationSize'

interface Props {
  sessionLog: SessionLog
  records: Index<Record>
  bodyweight: Bodyweight | null
}
export default function SessionView(initial: Props) {
  const paginationSize = usePaginationSize()
  const theme = useTheme()
  const [isBeginning, setIsBeginning] = useState(false)
  const [isEnd, setIsEnd] = useState(false)
  // This is used to alert when a record changes an exercise, so other records can
  // be notified and mutate themselves to retrieve the new exercise data.
  const [mostRecentlyUpdatedExercise, setMostRecentlyUpdatedExercise] =
    useState<Exercise | null>(null)
  const { sessionLog, mutate } = useGuaranteedSessionLog(initial.sessionLog)
  const sessionHasRecords = !!sessionLog.records.length
  const { date } = sessionLog

  const updateSwiper = (swiper: SwiperClass) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }

  const handleUpdateSession = async (newSessionLog: SessionLog) => {
    mutate(updateSessionLog(newSessionLog), {
      optimisticData: newSessionLog,
      revalidate: false,
    })
  }

  const handleAddRecord = async (exercise: Exercise) => {
    const record = new Record(date, { exercise })
    record.sets.push({})
    const newSessionLog = sessionLog
      ? {
          ...sessionLog,
          records: sessionLog.records.concat(record._id),
        }
      : new SessionLog(date, [record._id])
    mutate(updateSessionLog(newSessionLog), {
      optimisticData: newSessionLog,
      revalidate: false,
    })
    await addRecord(record)
  }

  const handleNotesChange = async (notes: Note[]) => {
    if (!sessionLog) return

    const newSessionLog = { ...sessionLog, notes }
    mutate(updateSessionLog(newSessionLog), {
      optimisticData: newSessionLog,
      revalidate: false,
    })
  }

  const handleSwapRecords = async (i: number, j: number) => {
    if (!sessionLog) return

    const length = sessionLog.records.length
    if (i < 0 || i >= length || j < 0 || j >= length) {
      console.error(`Tried swapping records out of range: ${i}, ${j}`)
      return
    }

    // todo: avoid the semi colon?
    const newRecords = [...sessionLog.records]
    ;[newRecords[j], newRecords[i]] = [newRecords[i], newRecords[j]]
    const newSession = { ...sessionLog, records: newRecords }
    mutate(updateSessionLog(newSession), {
      optimisticData: newSession,
      revalidate: false,
    })
  }

  const handleDeleteRecord = async (recordId: string) => {
    if (!sessionLog) return

    const newRecords = sessionLog.records.filter((id) => id !== recordId)
    mutate(deleteSessionRecord(sessionLog.date, recordId), {
      optimisticData: { ...sessionLog, records: newRecords },
      revalidate: false,
    })
  }

  return (
    <Stack spacing={2}>
      <TitleBar date={dayjs(date)} />
      <SessionModules />
      <Box>
        <Box
          className="pagination-above"
          display="flex"
          justifyContent="center"
          pt={2}
          sx={{ ...paginationSize }}
        />
        <Stack direction="row">
          {/* todo: nav button ripples are elongated */}
          {/* todo: actually thinking of making these ListItemButtons, 
            HistoryCards are within the single Swiper, and the Icon can be sticky
            and scroll down the screen. The ListItemButton will be clickable 
            over the whole gutter. */}
          <Box display="flex" width="auto" alignItems="center">
            <IconButton
              sx={{ display: { xs: 'none', sm: 'block' } }}
              className="nav-prev"
              color="primary"
              disabled={isBeginning}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          </Box>
          <Swiper
            // for some reason passing the swiper object to state doesn't update it, so added in an intermediary function
            onSwiper={updateSwiper}
            onSlideChange={updateSwiper}
            // update when number of slides changes
            onUpdate={updateSwiper}
            noSwipingClass="swiper-no-swiping-outer"
            modules={[Navigation, Pagination, Scrollbar, A11y, Keyboard]}
            // breakpoints catch everything >= the given value
            breakpoints={{
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
            }}
            spaceBetween={20}
            keyboard
            centeredSlides
            navigation={{
              prevEl: '.nav-prev',
              nextEl: '.nav-next',
            }}
            grabCursor
            watchOverflow
            // need this for CSS to hide slides that are partially offscreen
            watchSlidesProgress
            pagination={{
              el: '.pagination-above',
              clickable: true,
              // todo: maybe add a custom render and make the last one a "+" or something.
              // Kind of tricky to do though.
            }}
            style={{ padding: '15px 10px', flexGrow: '1' }}
          >
            {!!sessionLog &&
              sessionLog.records.map((id, i) => (
                <SwiperSlide key={id}>
                  <RecordCard
                    initialRecord={initial.records[id]}
                    date={dayjs(date)}
                    deleteRecord={handleDeleteRecord}
                    swapRecords={handleSwapRecords}
                    swiperIndex={i}
                    updateSessionNotes={handleNotesChange}
                    sessionNotes={sessionLog.notes}
                    setMostRecentlyUpdatedExercise={
                      setMostRecentlyUpdatedExercise
                    }
                    mostRecentlyUpdatedExercise={mostRecentlyUpdatedExercise}
                  />
                  <Box py={3}>
                    <HistoryFilter
                      initialRecord={initial.records[id]}
                      key={id}
                    />
                  </Box>
                </SwiperSlide>
              ))}

            <SwiperSlide
              // if no records, disable swiping. The swiping prevents you from being able to close date picker
              className={sessionHasRecords ? '' : 'swiper-no-swiping-outer'}
            >
              <Stack spacing={2}>
                <AddRecordCard handleAdd={handleAddRecord} />
                {!sessionHasRecords && (
                  <CopySessionCard
                    date={dayjs(date)}
                    handleUpdateSession={handleUpdateSession}
                  />
                )}
              </Stack>
            </SwiperSlide>
          </Swiper>
          <Box display="flex" alignItems="center">
            <IconButton
              sx={{ display: { xs: 'none', sm: 'block' } }}
              className="nav-next"
              color="primary"
              disabled={isEnd}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Stack>
      </Box>
    </Stack>
  )
}
