import { Stack, useTheme } from '@mui/material'
import NavigationBar from 'components/slider/NavigationBar'
import dayjs from 'dayjs'
import {
  addRecord,
  deleteSessionRecord,
  updateSessionLog,
  useSessionLog,
} from 'lib/frontend/restService'
import Exercise from 'models/Exercise'
import Note from 'models/Note'
import Record from 'models/Record'
import SessionLog from 'models/SessionLog'
import { useState } from 'react'
import { Keyboard, Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import AddRecordCard from './AddRecordCard'
import CopySessionCard from './CopySessionCard'
import RecordCard from './records/RecordCard'
import SessionModules from './upper/SessionModules'
import TitleBar from './upper/TitleBar'

interface Props {
  date: string
}
export default function SessionView({ date }: Props) {
  const theme = useTheme()
  // This is used to alert when a record changes an exercise, so other records can
  // be notified and mutate themselves to retrieve the new exercise data.
  const [mostRecentlyUpdatedExercise, setMostRecentlyUpdatedExercise] =
    useState<Exercise | null>(null)
  const { sessionLog, mutate, isLoading } = useSessionLog(date)
  const sessionHasRecords = !!sessionLog?.records.length
  const paginationClassName = 'pagination-record-cards'
  const navPrevClassName = 'nav-prev-record-cards'
  const navNextClassName = 'nav-next-records-cards'

  const handleUpdateSession = async (newSessionLog: SessionLog) => {
    mutate(updateSessionLog(newSessionLog), {
      optimisticData: newSessionLog,
      revalidate: false,
    })
  }

  // todo: add the current record instead of having to fetch it
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

  // todo: add blank space or something under the swiper. On the longest record
  // if you swap between history it scrolls up when a small history is selected, but won't scroll back down
  // when a bigger one appears.
  return (
    <Stack spacing={2}>
      <TitleBar date={dayjs(date)} />
      <SessionModules />
      {!isLoading && (
        // after making changes to the swiper component the page needs to be reloaded
        <Swiper
          // Note: it is CRITICAL to not use state to track slide changes in the
          // component that contains a Swiper. A state change during a slide transition
          // will cause the entire component to re-render, and if that component contains
          // the transitioning swiper it will pause the transition and cause noticeable
          // lag on every swipe. Any state manipulation should be handled by isolated
          // child components that will only re-render themselves.
          // Note that the useSwiperSlide hook uses state internally, so it will cause
          // this same lag.
          noSwipingClass="swiper-no-swiping-record"
          modules={[Navigation, Pagination, Keyboard]}
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
          // Change the default where dragging will only work on the slides, but not the space between them.
          touchEventsTarget="container"
          centeredSlides
          navigation={{
            prevEl: `.${navPrevClassName}`,
            nextEl: `.${navNextClassName}`,
          }}
          grabCursor
          watchOverflow
          // need this for CSS to hide slides that are partially offscreen
          // watchSlidesProgress
          pagination={{
            el: `.${paginationClassName}`,
            clickable: true,
            // todo: maybe add a custom render and make the last one a "+" or something.
            // Kind of tricky to do though.
          }}
          style={{ padding: '11px 4px', flexGrow: '1' }}
        >
          {/* Originally had the arrows in line with slides, but there isn't a good
                  way to do that while keeping them inside the swiper to take advantage of 
                  the useSwiper hook. Could manually pass them the swiper ref instead.
                  This solves another problem though: variable slide height moving the arrows
                  around. And, it allows the history swiper to also have nav arrows.  */}
          <NavigationBar
            {...{
              navNextClassName,
              navPrevClassName,
              paginationClassName,
              slot: 'container-start',
            }}
          />
          {sessionLog?.records.map((id, i) => (
            <SwiperSlide key={id}>
              <RecordCard
                id={id}
                deleteRecord={handleDeleteRecord}
                swapRecords={handleSwapRecords}
                swiperIndex={i}
                updateSessionNotes={handleNotesChange}
                sessionNotes={sessionLog.notes}
                setMostRecentlyUpdatedExercise={setMostRecentlyUpdatedExercise}
                mostRecentlyUpdatedExercise={mostRecentlyUpdatedExercise}
              />
            </SwiperSlide>
          ))}

          <SwiperSlide
            // if no records, disable swiping. The swiping prevents you from being able to close date picker
            className={sessionHasRecords ? '' : 'swiper-no-swiping-record'}
          >
            <Stack spacing={2} sx={{ p: 0.5 }}>
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
      )}
    </Stack>
  )
}
