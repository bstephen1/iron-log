import ClearIcon from '@mui/icons-material/Clear'
import { Box, IconButton, Input, MenuItem, Select, Stack } from '@mui/material'
import { blue, grey, lightGreen } from '@mui/material/colors'
import NumericFieldAutosave from 'components/form-fields/NumericFieldAutosave'
import { noSwipingRecord, URI_RECORDS } from 'lib/frontend/constants'
import { updateRecordFields } from 'lib/frontend/restService'
import { DisplayFields } from 'models/DisplayFields'
import Record from 'models/Record'
import { convertUnit, DB_UNITS, Set } from 'models/Set'
import { memo } from 'react'
import { useSWRConfig } from 'swr'

const delimiterWidth = '15px'

interface Props extends Set {
  readOnly?: boolean
  index: number
  displayFields: DisplayFields
  extraWeight: number
  _id: Record['_id']
}
// todo: indicator for failing a rep
// todo: swipe to delete for xs screen; remove X button on xs too (keep swipe delete throughout?)
/** Render a set. Note the set to render must be spread into the props.
 *  This destructures the set into primitive values to avoid unecessary rerenders.
 */
export default memo(function SetInput({
  readOnly = false,
  index,
  displayFields,
  extraWeight,
  _id,
  ...set
}: Props) {
  const { mutate } = useSWRConfig()
  const pyStack = 0.5

  // todo: make customizable ?
  const background = () => {
    switch (set.side) {
      case 'L':
        return `${blue[50]}`
      case 'R':
        return `${lightGreen[50]}`
      default:
        return `${grey[100]}`
    }
  }

  if (!displayFields.visibleFields.length) {
    return <></>
  }

  const handleSetChange = async (changes: Partial<Set>) => {
    mutate<Record | null>(
      URI_RECORDS + _id,
      (cur) =>
        cur
          ? updateRecordFields(_id, {
              [`sets.${index}`]: { ...cur.sets[index], ...changes },
            })
          : null,
      {
        optimisticData: (cur: Record) => {
          if (!cur) return null
          const newSets = [...cur.sets]
          newSets[index] = { ...newSets[index], ...changes }
          return { ...cur, sets: newSets }
        },
        revalidate: false,
      }
    )
  }

  const handleDeleteSet = async () => {
    mutate<Record | null>(
      URI_RECORDS + _id,
      (cur) =>
        cur
          ? updateRecordFields(_id, {
              ['sets']: cur?.sets.filter((_, j) => j !== index),
            })
          : null,
      {
        optimisticData: (cur: Record) =>
          cur ? { ...cur, sets: cur.sets.filter((_, j) => j !== index) } : null,
        revalidate: false,
      }
    )
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
              className={noSwipingRecord}
              variant="standard"
              displayEmpty
              fullWidth
              autoWidth
              input={<Input disableUnderline sx={{ textAlign: 'center' }} />}
              inputProps={{ sx: { pr: '0px !important' } }} // disable baked in padding for IconComponent
              IconComponent={() => null}
              value={set[field.source] ?? ''}
              onChange={(e) =>
                handleSetChange({
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
                handleSetChange({
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
          onClick={handleDeleteSet}
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
})
