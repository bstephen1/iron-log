import ClearIcon from '@mui/icons-material/Clear'
import { Box, IconButton, Input, MenuItem, Select, Stack } from '@mui/material'
import { blue, grey, lightGreen } from '@mui/material/colors'
import { useMemo } from 'react'
import { doNothing } from '../../../lib/util'
import { DisplayFields } from '../../../models/DisplayFields'
import { convertUnit, DB_UNITS, Set } from '../../../models/Set'
import NumericFieldAutosave from '../../form-fields/NumericFieldAutosave'

const delimiterWidth = '15px'

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

  // todo: make customizable ?
  const background = useMemo(() => {
    switch (set.side) {
      case 'L':
        return `${blue[100]}`
      case 'R':
        return `${lightGreen[100]}`
      default:
        return `${grey[100]}`
    }
  }, [set.side])

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
        background,
        py: pyStack,
        pl: 1,
      }}
    >
      {displayFields.visibleFields.map((field, i) => (
        <Stack
          direction="row"
          key={i}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexGrow: 1,
            flexBasis: 0,
          }}
        >
          {/* extra mt to visually align delimiters with setInput values. They're slightly off center otherwise.  */}
          {i > 0 && (
            <Box width={delimiterWidth} mt={0.5}>
              {field.delimiter ?? '/'}
            </Box>
          )}
          {field.source === 'side' ? (
            <Select<Set['side']>
              variant="standard"
              displayEmpty
              fullWidth
              autoWidth
              input={<Input disableUnderline sx={{ textAlign: 'center' }} />}
              inputProps={{ sx: { pr: '0px !important' } }} // disable baked in padding for IconComponent
              IconComponent={() => null}
              value={set[field.source] ?? ''}
              onChange={(e) =>
                handleSubmit({
                  side: (e.target.value as Set['side']) || undefined,
                })
              }
              renderValue={(selected) => <Box>{selected}</Box>}
            >
              {/* values must match type from Set['side'], except empty string which is converted to undefined */}
              <MenuItem value="">
                <em>Both</em>
              </MenuItem>
              <MenuItem value="L">L</MenuItem>
              <MenuItem value="R">R</MenuItem>
            </Select>
          ) : (
            <NumericFieldAutosave
              initialValue={convertUnit(
                set[field.source],
                field.source,
                DB_UNITS[field.source],
                displayFields.units[field.source],
                // this isn't a super robust way to handle conversions, but it works ok
                // when there's only one field that ever needs a conversion.
                field.name === 'totalWeight' ? extraWeight : 0,
                2
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
              sx={{ flexGrow: 1, flexBasis: 0 }}
            />
          )}
          {/* pad the right side to be equal to the left side */}
          {i > 0 && <Box minWidth={delimiterWidth}></Box>}
        </Stack>
      ))}
      {/* todo: maybe make this a "more..." with failed/warmup/delete options */}
      {readOnly ? (
        // insert a box for padding when clear icon is hidden
        <Box minWidth={'32px'} />
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
          <ClearIcon />
        </IconButton>
      )}
    </Stack>
  )
}
