import { Card, CardContent, CardHeader } from '@mui/material'
import StyledDivider from 'components/StyledDivider'
import useExtraWeight from 'lib/frontend/useExtraWeight'
import { DisplayFields } from 'models/DisplayFields'
import Record from 'models/Record'
import Link from 'next/link'
import { memo } from 'react'
import RecordNotesButton from '../records/header/ReccordNotesButton'
import RenderSets from '../records/sets/RenderSets'

interface Props {
  /** Must use the displayFields of the parent record.
   * The history record's displayFields will be stale if the parent's fields change.
   */
  displayFields: DisplayFields
  record: Record
  isQuickRender?: boolean
}
export default memo(function HistoryCard({
  displayFields,
  record,
  isQuickRender,
}: Props) {
  const { sets, _id, notes, date } = record
  const extraWeight = useExtraWeight(record)

  // use splitWeight if parent record is using it
  const showSplitWeight = displayFields.visibleFields.some((field) =>
    ['plateWeight', 'totalWeight'].includes(field.name)
  )

  return isQuickRender ? (
    <></>
  ) : (
    <Card elevation={0}>
      <CardHeader
        title={
          <Link
            // todo: Could add the record number so swiper can directly link to the record.
            // May not be worth the effort tho.
            href={date}
          >
            {date}
          </Link>
        }
        titleTypographyProps={{ variant: 'h6' }}
        action={<RecordNotesButton {...{ notes, sets }} />}
      />
      <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />

      {/* Note -- cannot override pb normally. See: https://stackoverflow.com/questions/54236623/cant-remove-padding-bottom-from-card-content-in-material-ui */}
      <CardContent sx={{ px: 1 }}>
        <RenderSets
          {...{ displayFields, showSplitWeight, sets, _id, extraWeight }}
        />
      </CardContent>
    </Card>
  )
})
