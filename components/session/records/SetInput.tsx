import { Clear } from '@mui/icons-material'
import { Box, IconButton, Stack } from '@mui/material'
import { grey } from '@mui/material/colors'
import { Fragment } from 'react'
import { doNothing } from '../../../lib/util'
import { DisplayFields } from '../../../models/DisplayFields'
import {
  convertUnit,
  convertUnitFormatted,
  DB_UNITS,
  Set,
} from '../../../models/Set'
import NumericFieldAutosave from '../../form-fields/NumericFieldAutosave'

interface Props {
  handleSubmit?: (changes: Partial<Set>) => void
  handleDelete?: () => void
  set: Set
  displayFields: DisplayFields
  readOnly?: boolean
  /** if using split weight: plate weight + extra weight = total weight */
  extraWeight?: number
}
// todo: indicator for failing a rep
// todo: swipe to delete for xs screen; remove X button on xs too (keep swipe delete throughout?)
export default function SetInput({
  handleSubmit = doNothing,
  handleDelete = doNothing,
  set,
  displayFields,
  readOnly = false,
  extraWeight = 0,
}: Props) {
  const pyStack = 0.5

  if (!displayFields.visibleFields.length) {
    return <></>
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      // border is from TextField underline
      sx={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
        background: `${grey[100]}`, // todo
        py: pyStack,
        pl: 1,
      }}
    >
      {displayFields.visibleFields.map((field, i) => (
        <Fragment key={i}>
          {i > 0 && <Box px={1}>{field.delimiter ?? '/'}</Box>}
          <NumericFieldAutosave
            initialValue={convertUnitFormatted(
              set[field.source],
              field.source,
              DB_UNITS[field.source],
              displayFields.units[field.source],
              // this isn't a super robust way to handle conversions, but it works ok
              // when there's only one field that ever needs a conversion.
              field.name === 'totalWeight' ? extraWeight : 0
            )}
            // todo: add validation that this is a number
            handleSubmit={(value) =>
              handleSubmit({
                [field.source]: convertUnit(
                  value,
                  field.source,
                  displayFields.units[field.source],
                  DB_UNITS[field.source],
                  field.name === 'totalWeight' ? -extraWeight : 0
                ),
              })
            }
            inputProps={{ style: { textAlign: 'center' } }}
            InputProps={{
              disableUnderline: true,
              readOnly,
            }}
            sx={{ flexGrow: 1 }}
          />
        </Fragment>
      ))}
      {/* todo: maybe make this a "more..." with failed/warmup/delete options */}
      {readOnly ? (
        // insert a box for padding when clear icon is hidden
        <Box minWidth={'32px'} height="100%" />
      ) : (
        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{
            my: -pyStack,
            p: 1,
            borderRadius: 0,
            '& .MuiTouchRipple-ripple .MuiTouchRipple-child': {
              borderRadius: 0,
            },
          }}
        >
          <Clear />
        </IconButton>
      )}
    </Stack>
  )
}
