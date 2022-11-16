import { Box, IconButton, Stack, useTheme } from '@mui/material'
import { Dayjs } from 'dayjs'
import { DATE_FORMAT } from '../../lib/frontend/constants'
import {
  addRecord,
  deleteSessionRecord,
  updateSession,
  useSession,
} from '../../lib/frontend/restService'
import Exercise from '../../models/Exercise'
import Record from '../../models/Record'
import Session from '../../models/Session'
import WeightUnitConverter from '../WeightUnitConverter'
import Clock from './Clock'
import RecordInput from './RecordInput'
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
import { useEffect, useRef, useState } from 'react'
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
  const { session, isError, mutate } = useSession(date)
  // when the record is empty it will be null, but if it still hasn't returned yet it will be undefined
  // it looks offputting putting a skeleton in when loading since there can be any number of exerciseRecords,
  // so for now we just hide the add exercise button so the records don't pop in above it
  const isLoading = session === undefined

  const updateSwiper = (swiper: SwiperClass) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }

  // todo: this is a placeholder
  if (isError) {
    return <>Error fetching data!</>
  }

  const handleAddRecord = (exercise: Exercise) => {
    if (isLoading) return // make typescript happy

    // todo: include a set too
    const record = new Record(date.format(DATE_FORMAT), exercise)
    addRecord(record)
    // todo: updateSessionField
    const newSession = session
      ? {
          ...session,
          records: session.records.concat(record._id),
        }
      : new Session(date.format(DATE_FORMAT), [record._id])
    updateSession(newSession)
    mutate(newSession)
  }

  const handleSwapRecords = (i: number, j: number) => {
    if (!session) return

    const length = session.records.length
    if (i < 0 || i >= length || j < 0 || j >= length) {
      console.error(`Tried swapping records out of range: ${i}, ${j}`)
      return
    }

    const newRecords = [...session.records]
    ;[newRecords[j], newRecords[i]] = [newRecords[i], newRecords[j]]
    const newSession = { ...session, records: newRecords }
    updateSession(newSession)
    mutate(newSession)
  }

  const handleDeleteRecord = (recordId: string) => {
    if (!session) return

    const newRecords = session.records.filter((id) => id !== recordId)
    deleteSessionRecord(session.date, recordId)
    // todo: not sure if disabling revalidation fixes glitchiness
    mutate({ ...session, records: newRecords }, { revalidate: false })
  }

  // todo: compare with last of this day type
  return (
    <Stack spacing={2}>
      <TitleBar date={date} />
      <Clock />
      <WeightUnitConverter />
      <Box>
        <Box
          className="pagination"
          display="flex"
          justifyContent="center"
          pt={2}
        />
        <Stack direction="row">
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
          {/*  todo: loading */}
          {!isLoading && (
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
                renderBullet: function (index, className) {
                  return `<span class="${className}"></span>`
                },
              }}
              style={{ padding: '15px 10px', flexGrow: '1' }}
            >
              {session &&
                session.records.map((id, i) => (
                  <SwiperSlide key={id}>
                    <RecordInput
                      id={id}
                      deleteRecord={handleDeleteRecord}
                      swapRecords={handleSwapRecords}
                      index={i}
                    />
                  </SwiperSlide>
                ))}
              <SwiperSlide>
                <AddRecord handleAdd={handleAddRecord} />
              </SwiperSlide>
            </Swiper>
          )}
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
    </Stack>
  )
}
