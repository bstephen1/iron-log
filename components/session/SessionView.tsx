import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { Dayjs } from 'dayjs'
import { DATE_FORMAT } from '../../lib/frontend/constants'
import {
  addRecord,
  deleteSessionRecord,
  updateSessionLog,
  useSessionLog,
} from '../../lib/frontend/restService'
import Exercise from '../../models/Exercise'
import Record from '../../models/Record'
import SessionLog from '../../models/SessionLog'
import WeightUnitConverter from '../WeightUnitConverter'
import Clock from './Clock'
import RecordCard from './RecordCard'
import TitleBar from './TitleBar'

import {
  A11y,
  Keyboard,
  Navigation,
  Pagination,
  Scrollbar,
  Swiper as SwiperClass,
} from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material'
import { useState } from 'react'
import 'swiper/css'
import 'swiper/css/bundle'
import 'swiper/css/effect-cards'
import 'swiper/css/effect-creative'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import AddRecord from './AddRecord'

export default function SessionView({ date }: { date: Dayjs }) {
  const theme = useTheme()
  const [isBeginning, setIsBeginning] = useState(false)
  const [isEnd, setIsEnd] = useState(false)
  // SWR caches this, so it won't need to call the API every render
  const { sessionLog, isError, isLoading, mutate } = useSessionLog(date)

  // todo: this is a placeholder
  if (isError) {
    return <>Error fetching data!</>
  }

  const updateSwiper = (swiper: SwiperClass) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }

  const handleAddRecord = async (exercise: Exercise) => {
    if (isLoading) return // make typescript happy

    const record = new Record(date.format(DATE_FORMAT), exercise)
    record.sets.push({})
    addRecord(record)
    const newSession = sessionLog
      ? {
          ...sessionLog,
          records: sessionLog.records.concat(record._id),
        }
      : new SessionLog(date.format(DATE_FORMAT), [record._id])
    await updateSessionLog(newSession)
    mutate(newSession)
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
    await updateSessionLog(newSession)
    mutate(newSession)
  }

  const handleDeleteRecord = async (recordId: string) => {
    if (!sessionLog) return

    const newRecords = sessionLog.records.filter((id) => id !== recordId)
    await deleteSessionRecord(sessionLog.date, recordId)
    mutate({ ...sessionLog, records: newRecords })
  }

  // todo: compare with last of this day type
  return (
    <Stack spacing={2}>
      <TitleBar date={date} />
      <Clock />
      <WeightUnitConverter />
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Box
            className="pagination"
            display="flex"
            justifyContent="center"
            pt={2}
          />
          <Stack direction="row">
            {/* todo: nav button ripples are elongated */}
            <Box display="flex" width="auto" alignItems="center">
              <IconButton
                sx={{ display: { xs: 'none', sm: 'block' } }}
                className="nav-prev"
                color="primary"
                disabled={isBeginning}
              >
                <ArrowBackIosNew />
              </IconButton>
            </Box>
            <Swiper
              // for some reason passing the swiper object to state doesn't update it, so added in an intermediary function
              onSwiper={updateSwiper}
              onSlideChange={updateSwiper}
              // update when number of slides changes
              onUpdate={updateSwiper}
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
                el: '.pagination',
                clickable: true,
                // todo: numbered list? Make last one AddIcon ?
                renderBullet: function (_index, className) {
                  return `<span class="${className}"></span>`
                },
              }}
              style={{ padding: '15px 10px', flexGrow: '1' }}
            >
              {!!sessionLog &&
                sessionLog.records.map((id, i) => (
                  <SwiperSlide key={id}>
                    <RecordCard
                      id={id}
                      deleteRecord={handleDeleteRecord}
                      swapRecords={handleSwapRecords}
                      swiperIndex={i}
                    />
                  </SwiperSlide>
                ))}
              <SwiperSlide>
                <AddRecord handleAdd={handleAddRecord} />
              </SwiperSlide>
            </Swiper>
            <Box display="flex" alignItems="center">
              <IconButton
                sx={{ display: { xs: 'none', sm: 'block' } }}
                className="nav-next"
                color="primary"
                disabled={isEnd}
              >
                <ArrowForwardIos />
              </IconButton>
            </Box>
          </Stack>
        </Box>
      )}

      <Typography variant="h5" textAlign="center">
        History
      </Typography>
    </Stack>
  )
}
