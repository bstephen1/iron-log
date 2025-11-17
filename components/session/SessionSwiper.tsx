'use client'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import { useEffect, useRef, useState } from 'react'
import 'swiper/css'
import 'swiper/css/pagination'
import { useSearchParams } from 'next/navigation'
import { Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, type SwiperRef, SwiperSlide } from 'swiper/react'
import { noSwipingRecord } from '../../lib/frontend/constants'
import { useRecords, useSessionLog } from '../../lib/frontend/restService'
import LoadingSpinner from '../loading/LoadingSpinner'
import NavigationBar from '../swiper/NavigationBar'
import AddRecordCard from './AddRecordCard'
import CopySessionCard from './CopySessionCard'
import RecordCard from './records/RecordCard'

interface Props {
  date: string
}
export default function SessionSwiper({ date }: Props) {
  const theme = useTheme()
  const { data: sessionLog } = useSessionLog(date)
  const searchParams = useSearchParams()
  const records = useRecords({ date })
  const [isFirstRender, setIsFirstRender] = useState(true)
  const swiperElRef = useRef<SwiperRef>(null)
  const sessionHasRecords = !!sessionLog?.records.length
  const paginationClassName = 'pagination-record-cards'
  const navPrevClassName = 'nav-prev-record-cards'
  const navNextClassName = 'nav-next-records-cards'

  useEffect(() => {
    setIsFirstRender(false)
    // Updating the searchParam on every slide change is too laggy.
    // Record id is used over slide index so we only need to know the record,
    // not the whole sessionLog.
    const initialRecord = searchParams.get('record')
    if (initialRecord) {
      const index = sessionLog?.records.indexOf(initialRecord) ?? 0
      swiperElRef.current?.swiper.slideTo(index)
    }
  }, [searchParams.get, sessionLog?.records.indexOf])

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
      }}
      // Extra padding lets autoHeight remember scroll position for longer slides.
      // Has to be large enough to still be showing swiper on AddRecord slide,
      // but small enough that it isn't bigger than record cards
      style={{ paddingBottom: '60vh' }}
    >
      {/* Keeping navigation above slides instead of inline to the left/right solves problem of 
          how to vertically align them given variable slide height.  */}
      {/* navbar needs to be setup on init (first render). It won't work otherwise */}
      <NavigationBar
        {...{
          navNextClassName,
          navPrevClassName,
          paginationClassName,
          sx: { pb: 1, pt: 3 },
          slot: 'container-start',
        }}
      />
      {/* First render MUST be client side. The server does not contain any info about 
          the browser window so the swiper layout is broken on first render if SSR is used. 
          So even though the data is available immediately we must employ a loading state 
          so that swiper can initialize properly. The loader is placed here within 
          the swiper so the more expensive swiper parent can be setup on first render 
          and only the slides need to be re-rendered. */}
      {isFirstRender ? (
        <LoadingSpinner />
      ) : (
        <>
          {sessionLog?.records.map(
            (id, i) =>
              records.index[id] && (
                <SwiperSlide key={id}>
                  <RecordCard record={records.index[id]} swiperIndex={i} />
                </SwiperSlide>
              )
          )}
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
