import { Box, Divider, Stack, Typography, useTheme } from '@mui/material'
import { useRecords } from 'lib/frontend/restService'
import { RecordQuery } from 'models/query-filters/RecordQuery'
import { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import HistoryCard from './HistoryCard'

import 'swiper/css'
import 'swiper/css/pagination'

import RecordCardSkeleton from 'components/loading/RecordCardSkeleton'
import NavigationBar from 'components/slider/NavigationBar'
import { DisplayFields } from 'models/DisplayFields'
import { ArrayMatchType } from 'models/query-filters/MongoQuery'
import 'swiper/css/pagination'
import { RecordContext } from '../records/RecordContext'

// todo: useSWRInfinite for infinite loading?
// https://swr.vercel.app/docs/pagination

interface Props {
  isQuickRender?: boolean
  paginationId: string
  /** A record's displayFields are only up to date on fetch, so the current value must
   * be passed in to ensure it is in sync */
  displayFields: DisplayFields
  /** filter to query for record history. If no filter is provided no records will be fetched. */
  filter?: RecordQuery
}
export default function HistoryCardsSwiper({
  isQuickRender,
  paginationId,
  displayFields,
  filter,
}: Props) {
  // todo: then fetch more if the swiper gets close to the end. (Also for future dates?)
  const { records, isLoading } = useRecords(
    {
      modifierMatchType: ArrayMatchType.Equivalent,
      // minimize load if filter does not set a limit
      limit: 1,
      ...filter,
    },
    !!filter
  )

  // each record's history needs a unique className
  const paginationClassName = `pagination-history-${paginationId}`
  const navPrevClassName = `nav-prev-history-${paginationId}`
  const navNextClassName = `nav-next-history-${paginationId}`

  if (isQuickRender || isLoading || !records) {
    return (
      <>
        <HistoryTitle />
        <RecordCardSkeleton
          noHeader
          noSetButton
          titleTypographyProps={{ textAlign: 'center' }}
          elevation={0}
          sx={{ px: 0, m: 0 }}
        />
      </>
    )
  }

  // assumes filter has end date set to the current record's date (so will exclude it)
  if (!records.length) {
    return (
      <>
        <HistoryTitle />
        <RecordCardSkeleton
          noHeader
          titleTypographyProps={{ textAlign: 'center' }}
          elevation={0}
          sx={{ px: 0, m: 0 }}
          Content={
            <>
              <Typography textAlign="center">
                No history found for this exercise!
              </Typography>
              <Typography textAlign="center">
                Try changing the filters.
              </Typography>
            </>
          }
        />
      </>
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
          {records
            ?.map((record) => (
              <SwiperSlide
                // have to recalculate autoHeight when matchesRecord changes
                key={record._id}
                className={records.length > 1 ? 'swiper-no-swiping-record' : ''}
              >
                <RecordContext.Provider value={{ record }}>
                  <HistoryCard
                    {...{
                      displayFields,
                    }}
                  />
                </RecordContext.Provider>
              </SwiperSlide>
              // need to reverse so newest is on the right, not left. Can't do it in useRecords because
              // mongo applies sort before the limit. Also, reverse should be after map because it mutates the array.
            ))
            .reverse()}
        </Swiper>
      </Box>
    </Stack>
  )
}

function HistoryTitle() {
  const theme = useTheme()

  return (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Divider
        sx={{
          fontSize: 12,
          width: '80%',
          '&::before, &::after': {
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <Typography variant="h6">History</Typography>
      </Divider>
    </Box>
  )
}
