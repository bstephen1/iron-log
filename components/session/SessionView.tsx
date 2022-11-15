import { Stack } from '@mui/material'
import { Dayjs } from 'dayjs'
import { DATE_FORMAT } from '../../lib/frontend/constants'
import {
  addRecord,
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

import { A11y, Navigation, Pagination, Scrollbar } from 'swiper'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/bundle'
import 'swiper/css/effect-cards'
import 'swiper/css/effect-creative'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import AddRecord from './AddRecord'

export default function SessionView({ date }: { date: Dayjs }) {
  // SWR caches this, so it won't need to call the API every render
  const { session, isError, mutate } = useSession(date)
  // when the record is empty it will be null, but if it still hasn't returned yet it will be undefined
  // it looks offputting putting a skeleton in when loading since there can be any number of exerciseRecords,
  // so for now we just hide the add exercise button so the records don't pop in above it
  const isLoading = session === undefined

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

  const handleDeleteRecord = (i: number) => {
    if (!session) return

    const newRecords = session.records.filter((_, j) => j !== i)
    updateSession({ ...session, records: newRecords })
    mutate({ ...session, records: newRecords })
  }

  // todo: compare with last of this day type
  return (
    <Stack spacing={2}>
      <TitleBar date={date} />
      <Clock />
      <WeightUnitConverter />
      {/*  todo: loading */}
      {/* todo: breakpoints. sm => hide navigation; lg => ~3 slidesPerView */}
      {!isLoading && (
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={80}
          slidesPerView={1}
          // allowTouchMove={false}
          navigation
          grabCursor
          // loop
          // autoHeight // todo: not sure about this, kinda jumpy. Also doesn't refresh height when adding new record
          pagination={{
            clickable: true,
            // todo: numbered list? Make last one AddIcon ?
            renderBullet: function (index, className) {
              return `<span class="${className}"></span>`
            },
          }}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log('slide change')}
          style={{ padding: '50px' }}
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
    </Stack>
  )
}
