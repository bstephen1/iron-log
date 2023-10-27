import { Box, Card, CardContent, CardHeader, Stack } from '@mui/material'
import { ComboBoxField } from 'components/form-fields/ComboBoxField'
import StyledDivider from 'components/StyledDivider'
import { doNothing } from 'lib/util'
import { DisplayFields } from 'models/DisplayFields'
import { useRouter } from 'next/router'
import RecordNotesButton from '../records/actions/ReccordNotesButton'
import RenderSets from '../records/sets/RenderSets'
import SetTypeSelect from '../records/SetTypeSelect'
import useCurrentRecord from '../records/useCurrentRecord'

interface Props {
  /** Must use the displayFields of the parent record.
   * The history record's displayFields will be stale if the parent's fields change.
   */
  displayFields: DisplayFields
  /** if true, some record fields will be hidden since they are the same as the parent  */
  shouldSync?: boolean
}
export default function HistoryCard({ displayFields, shouldSync }: Props) {
  const router = useRouter()
  const { date, sets, activeModifiers, setType } = useCurrentRecord()
  // use splitWeight if parent record is using it, even if this history record doesn't have the
  // right modifiers for it to be active
  const showSplitWeight = displayFields.visibleFields.some((field) =>
    ['plateWeight', 'totalWeight'].includes(field.name)
  )

  return (
    <Card elevation={0}>
      <CardHeader
        title={
          <Box
            // todo: Could add the record number so swiper can directly link to the record.
            // May not be worth the effort tho.
            onClick={() => router.push(date)}
            sx={{ cursor: 'pointer' }}
            width="fit-content"
          >
            {date}
          </Box>
        }
        titleTypographyProps={{ variant: 'h6' }}
        action={<RecordNotesButton readOnly />}
      />
      <StyledDivider elevation={0} sx={{ height: 2, my: 0 }} />

      {/* Note -- cannot override pb normally. See: https://stackoverflow.com/questions/54236623/cant-remove-padding-bottom-from-card-content-in-material-ui */}
      <CardContent sx={{ px: 1 }}>
        <Stack spacing={2}>
          {!shouldSync && (
            <ComboBoxField
              label="Modifiers"
              options={activeModifiers}
              initialValue={activeModifiers}
              variant="standard"
              helperText=""
              readOnly
            />
          )}
          {!shouldSync && (
            <SetTypeSelect
              units={displayFields.units}
              setType={setType}
              sets={sets}
              handleSubmit={doNothing}
              readOnly
              showTotal
            />
          )}
          <RenderSets
            displayFields={displayFields}
            showSplitWeight={showSplitWeight}
          />
        </Stack>
      </CardContent>
    </Card>
  )
}
