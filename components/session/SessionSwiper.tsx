import { Stack, useMediaQuery, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import LoadingSpinner from '../../components/loading/LoadingSpinner'
import NavigationBar from '../../components/slider/NavigationBar'
import { noSwipingRecord } from '../../lib/frontend/constants'
import AddRecordCard from './AddRecordCard'
import CopySessionCard from './CopySessionCard'
import RecordCard from './records/RecordCard'
import useCurrentSessionLog from './useCurrentSessionLog'

// todo: look into prefetching data / preloading pages
// https://swr.vercel.app/docs/prefetching

export default function SessionSwiper() {
  const theme = useTheme()
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
      // Swiper prevents clicks from passing through to certain elements by default,
      // which had been preventing Select dropdowns from being able to open.
      // To fix, we tell swiper to not trigger preventDefault().
      touchStartPreventDefault={false}
      // Because swiper normally tries to preventDefault for clicks, it allows you to specify
      // certain elements that it will allow to pass through and be focusable.
      // However, swiper still manually handles focusing/blurring these elements, which causes
      // issues with autocompletes (swiper calls onBlur too often and causes dropdowns to immediately close and
      // open again whenever you click on them).
      // We've already set touchStartPreventDefault to false to stop swiper intercepting clicks, but swiper still
      // uses custom logic assuming that prop is set to true. So here we overwrite focusableElements to a nonsense list
      // to ensure no real elements are affected.
      // See (search for "blur"): https://github.com/nolimits4web/swiper/blob/master/src/core/events/onTouchStart.mjs
      focusableElements="none"
      // Now we can set activeElement blurring how we actually want it: blur once the swiper starts moving.
      // This closes any open dropdowns only if the user starts moving the swiper.
      // Swiper's default behavior is to blur immediately on click, which causes dropdowns to immediately close and
      // reopen as described above.
      onTouchMove={() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      }}
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
              />
            </SwiperSlide>
          ))}
          <SwiperSlide>
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
