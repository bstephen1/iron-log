import { Box, Stack, TextFieldProps } from '@mui/material'
import { memo } from 'react'
import { UpdateFields } from '../../../../lib/util'
import { VisibleField } from '../../../../models/DisplayFields'
import { DB_UNITS, Set, Units, convertUnit } from '../../../../models/Set'
import NumericFieldAutosave from '../../../form-fields/NumericFieldAutosave'
import SetFieldSide from './SetFieldSide'
import SetFieldTimeMask from './SetFieldTimeMask'

const delimiterWidth = '15px'

// pick only the props actually used so fields that use
// generics don't conflict with component types
const sharedProps: Pick<TextFieldProps, 'inputProps' | 'InputProps' | 'sx'> = {
  inputProps: { sx: { textAlign: 'center' } },
  InputProps: {
    disableUnderline: true,
  },
  sx: { flexGrow: 1, flexBasis: 0 },
}

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
/** chooses which set field type to render, and renders delimiter */
export default memo(function RenderSetField<S extends keyof Units>(
  props: Props<S>,
) {
  const { index, handleSetChange, value, unit, delimiter, source } = props

  const componentType =
    source === 'side' ? 'side' : unit === 'HH:MM:SS' ? 'time' : 'default'

  const SetFieldComponent = () => {
    switch (componentType) {
      case 'side':
        return (
          <SetFieldSide
            value={value as Set['side']}
            handleSetChange={handleSetChange}
            {...sharedProps}
          />
        )
      case 'time':
        return (
          <SetFieldTimeMask
            handleSetChange={handleSetChange}
            rawInitialValue={value as number}
            {...sharedProps}
          />
        )
      default:
        return <SetFieldNumeric {...props} {...sharedProps} />
    }
  }

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
      <SetFieldComponent />
      {/* pad the right side to be equal to the left side */}
      {index > 0 && <Box minWidth={delimiterWidth}></Box>}
    </Stack>
  )
})

/** This should only be used on S where the value is a number.
 *  We can't indicate that with ts without a lot of effort
 */
function SetFieldNumeric<S extends keyof Units>({
  value,
  source,
  unit,
  name,
  handleSetChange,
  readOnly,
  extraWeight,
}: Props<S>) {
  return (
    <NumericFieldAutosave
      initialValue={convertUnit(
        value as number,
        source,
        DB_UNITS[source],
        unit,
        // this isn't a super robust way to handle conversions, but it works ok
        // when there's only one field that ever needs a conversion.
        name === 'totalWeight' ? extraWeight : 0,
        2,
      )}
      // todo: add validation that this is a number
      handleSubmit={(value) =>
        handleSetChange({
          [source]: convertUnit(
            value,
            source,
            unit,
            DB_UNITS[source],
            name === 'totalWeight' ? -extraWeight : 0,
          ),
        })
      }
      {...sharedProps}
      InputProps={{
        readOnly,
        ...sharedProps.InputProps,
      }}
    />
  )
}
