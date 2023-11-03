import { Stack, useMediaQuery, useTheme } from '@mui/material'
import LoadingSpinner from 'components/loading/LoadingSpinner'
import NavigationBar from 'components/slider/NavigationBar'
import { noSwipingRecord } from 'lib/frontend/constants'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import { useEffect, useRef, useState } from 'react'
import { Keyboard, Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import AddRecordCard from './AddRecordCard'
import CopySessionCard from './CopySessionCard'
import RecordCard from './records/RecordCard'
import useCurrentSessionLog from './useCurrentSessionLog'

// todo: look into prefetching data / preloading pages
// https://swr.vercel.app/docs/prefetching

export default function SessionSwiper() {
  const theme = useTheme()
  // This is used to alert when a record changes an exercise, so other records can
  // be notified and mutate themselves to retrieve the new exercise data.
  const [mostRecentlyUpdatedExercise, setMostRecentlyUpdatedExercise] =
    useState<Exercise | null>(null)
  const { sessionLog, date } = useCurrentSessionLog()
  // reduce load time for initial render by only rendering the visible RecordCards
  const [isFirstRender, setIsFirstRender] = useState(true)
  // on large screens there are 3 visible slides, but on init the first one is centered
  // so only 2 are actually visible
  const initialVisibleSlides = useMediaQuery(theme.breakpoints.down('sm'))
    ? 1
    : 2
  const swiperElRef = useRef<SwiperRef>(null)
  const sessionHasRecords = !!sessionLog?.records.length
  const paginationClassName = 'pagination-record-cards'
  const navPrevClassName = 'nav-prev-record-cards'
  const navNextClassName = 'nav-next-records-cards'

  // instead of using isLoading from useSessionLog do this to let ts know it's not undefined
  const isLoading = sessionLog === undefined

  useEffect(() => {
    setIsFirstRender(false)
  }, [])

  // todo: add blank space or something under the swiper. On the longest record
  // if you swap between history it scrolls up when a small history is selected, but won't scroll back down
  // when a bigger one appears.
  return (
    // Note: after making code changes to the swiper component the page needs to be reloaded
    <Swiper
      ref={swiperElRef}
      // Note: it is CRITICAL to not use state to track slide changes in the
      // component that contains a Swiper. A state change during a slide transition
      // will cause the entire component to re-render, and if that component contains
      // the transitioning swiper it will pause the transition and cause noticeable
      // lag on every swipe. Any state manipulation should be handled by isolated
      // child components that will only re-render themselves.
      // Note that the useSwiperSlide hook uses state internally, so it will cause
      // this same lag.
      noSwipingClass={noSwipingRecord}
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
      // not sure if autoheight is good. Will jump up if a smaller record appears (eg, "add record")
      // Change the default where dragging will only work on the slides, but not the space between them.
      touchEventsTarget="container"
      centeredSlides
      navigation={{
        prevEl: `.${navPrevClassName}`,
        nextEl: `.${navNextClassName}`,
      }}
      grabCursor
      pagination={{
        el: `.${paginationClassName}`,
        clickable: true,
        // todo: maybe add a custom render and make the last one a "+" or something.
        // Kind of tricky to do though.
      }}
      // Extra padding lets autoHeight remember scroll position for longer slides.
      // Has to be large enough to still be showing swiper on AddRecord slide,
      // but small enough that it isn't bigger than record cards
      style={{ paddingBottom: '60vh' }}
    >
      {/* Keeping navigation above slides instead of inline to the left/right solves problem of 
            how to vertically align them given variable slide height.  */}
      <NavigationBar
        {...{
          isLoading,
          navNextClassName,
          navPrevClassName,
          paginationClassName,
          sx: { pb: 1, pt: 3 },
          slot: 'container-start',
        }}
      />
      {/* Load inside the swiper to increase performance -- swiper is already rendered when loading finishes. 
            Pagination doesn't work properly inside the isLoading check so it has to be extracted too. */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {sessionLog?.records.map((id, i) => (
            <SwiperSlide key={id}>
              <RecordCard
                isQuickRender={isFirstRender && i >= initialVisibleSlides}
                id={id}
                swiperIndex={i}
                setMostRecentlyUpdatedExercise={setMostRecentlyUpdatedExercise}
                mostRecentlyUpdatedExercise={mostRecentlyUpdatedExercise}
              />
            </SwiperSlide>
          ))}
          <SwiperSlide
            // if no records, disable swiping. The swiping prevents you from being able to close date picker
            className={sessionHasRecords ? '' : noSwipingRecord}
          >
            <Stack spacing={2} sx={{ p: 0.5 }}>
              <AddRecordCard />
              {!sessionHasRecords && <CopySessionCard key={date} />}
            </Stack>
          </SwiperSlide>
        </>
      )}
    </Swiper>
  )
}
