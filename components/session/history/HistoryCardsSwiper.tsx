import { Box, Stack, Typography } from '@mui/material'
import { useRecords } from 'lib/frontend/restService'
import { RecordQuery, SetMatchType } from 'models/query-filters/RecordQuery'
import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import HistoryCard from './HistoryCard'

import 'swiper/css'
import 'swiper/css/pagination'

import RecordCardSkeleton from 'components/loading/RecordCardSkeleton'
import NavigationBar from 'components/slider/NavigationBar'
import dayjs from 'dayjs'
import { DATE_FORMAT } from 'lib/frontend/constants'
import { DisplayFields } from 'models/DisplayFields'
import { ArrayMatchType } from 'models/query-filters/MongoQuery'
import Record from 'models/Record'
import { useDateContext } from 'pages/sessions/[date].page'
import { memo } from 'react'
import isEqual from 'react-fast-compare'
import 'swiper/css/pagination'

// todo: useSWRInfinite for infinite loading?
// https://swr.vercel.app/docs/pagination

interface Props extends Pick<Record, '_id' | 'activeModifiers' | 'setType'> {
  displayFields: DisplayFields
  exerciseName?: string
}
export default memo(function HistoryCardsSwiper({
  displayFields,
  exerciseName,
  _id,
  activeModifiers,
  setType,
}: Props) {
  const date = useDateContext()
  const filter: RecordQuery = {
    modifier: activeModifiers,
    // don't want to include the current record in its own history
    end: dayjs(date).add(-1, 'day').format(DATE_FORMAT),
    exercise: exerciseName,
    limit: 10,
    modifierMatchType: ArrayMatchType.Equivalent,
    setMatchType: SetMatchType.SetType,
    ...setType,
  }

  // todo: then fetch more if the swiper gets close to the end. (Also for future dates?)
  const { records: historyRecords, isLoading } = useRecords(
    {
      modifierMatchType: ArrayMatchType.Equivalent,
      // minimize load if filter does not set a limit
      limit: 1,
      ...filter,
    },
    !!filter
  )

  // each record's history needs a unique className
  const paginationClassName = `pagination-history-${_id}`
  const navPrevClassName = `nav-prev-history-${_id}`
  const navNextClassName = `nav-next-history-${_id}`

  if (isLoading || !historyRecords) {
    return (
      <RecordCardSkeleton
        noHeader
        noSetButton
        titleTypographyProps={{ textAlign: 'center' }}
        elevation={0}
        sx={{ px: 0, m: 0 }}
      />
    )
  }

  // assumes filter has end date set to the current record's date (so will exclude it)
  if (!historyRecords.length) {
    return (
      <Typography textAlign="center" pb={2}>
        No history found for this exercise with the same modifiers and set type
      </Typography>
    )
  }

  return (
    <Stack alignItems="center">
      {/* this box prevents Swiper from having infinite width. Width is required when the stack has alignItems centered */}
      <Box width="100%">
        <Swiper
          spaceBetween={20}
          grabCursor
          // This isn't documented, but the out of bounds behavior sets the active slide to
          // the closest valid index (first slide starting at 0). This makes it pretty easy
          // to default to the last index when length is unknown, but has a max possible value.
          initialSlide={filter?.limit}
          autoHeight
          pagination={{
            el: `.${paginationClassName}`,
            clickable: true,
            // dynamic bullets work now without crashing, but they sometimes start shrinking and disappear.
            // Normal bullets are more reliable.
          }}
          navigation={{
            prevEl: `.${navPrevClassName}`,
            nextEl: `.${navNextClassName}`,
          }}
          modules={[Pagination, Navigation]}
        >
          <NavigationBar
            {...{
              navNextClassName,
              navPrevClassName,
              paginationClassName,
              slot: 'container-start',
            }}
          />
          {historyRecords
            ?.map((historyRecord) => (
              <SwiperSlide
                // have to recalculate autoHeight when matchesRecord changes
                key={historyRecord._id}
                // disable parent swiping
                className={
                  historyRecords.length > 1 ? 'swiper-no-swiping-record' : ''
                }
              >
                <HistoryCard
                  record={historyRecord}
                  displayFields={displayFields}
                />
              </SwiperSlide>
              // need to reverse so newest is on the right, not left. Can't do it in useRecords because
              // mongo applies sort before the limit. Also, reverse should be after map because it mutates the array.
            ))
            .reverse()}
        </Swiper>
      </Box>
    </Stack>
  )
},
isEqual)
