import { Box, Input, MenuItem, Select, Stack } from '@mui/material'
import NumericFieldAutosave from 'components/form-fields/NumericFieldAutosave'
import { noSwipingRecord } from 'lib/frontend/constants'
import { UpdateFields } from 'lib/util'
import { VisibleField } from 'models/DisplayFields'
import { convertUnit, DB_UNITS, Set, Units } from 'models/Set'
import { memo } from 'react'

const delimiterWidth = '15px'

interface Props<S extends keyof Units>
  extends Pick<VisibleField, 'delimiter' | 'name'> {
  index: number
  handleSetChange: UpdateFields<Set>
  value?: Set[S]
  unit: Units[S]
  readOnly?: boolean
  extraWeight: number
  // source from VisibleField, extracted to add generic type
  source: S
}
export default memo(function SetFieldInput<S extends keyof Units>({
  index,
  handleSetChange,
  value,
  unit,
  readOnly,
  extraWeight,
  delimiter,
  source,
  name,
}: Props<S>) {
  return (
    <Stack
      direction="row"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexGrow: 1,
        flexBasis: 0,
      }}
    >
      {/* extra mt to visually align delimiters with setInput values. They're slightly off center otherwise.  */}
      {index > 0 && (
        <Box width={delimiterWidth} mt={0.5}>
          {delimiter ?? '/'}
        </Box>
      )}
      {source === 'side' ? (
        <Select<Set['side']>
          className={noSwipingRecord}
          variant="standard"
          displayEmpty
          fullWidth
          autoWidth
          input={<Input disableUnderline sx={{ textAlign: 'center' }} />}
          inputProps={{ sx: { pr: '0px !important' } }} // disable baked in padding for IconComponent
          IconComponent={() => null}
          value={(value as Set['side']) ?? ''}
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
            value as Set['weight'],
            source,
            DB_UNITS[source],
            unit,
            // this isn't a super robust way to handle conversions, but it works ok
            // when there's only one field that ever needs a conversion.
            name === 'totalWeight' ? extraWeight : 0,
            2
          )}
          // todo: add validation that this is a number
          handleSubmit={(value) =>
            handleSetChange({
              [source]: convertUnit(
                value,
                source,
                unit,
                DB_UNITS[source],
                name === 'totalWeight' ? -extraWeight : 0
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
      {index > 0 && <Box minWidth={delimiterWidth}></Box>}
    </Stack>
  )
})
