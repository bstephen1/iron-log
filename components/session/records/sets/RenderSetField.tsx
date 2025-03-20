import { Box, Stack, TextFieldProps } from '@mui/material'
import { memo } from 'react'
import { TIME_FORMAT } from '../../../../lib/frontend/constants'
import { UpdateFields } from '../../../../lib/util'
import { VisibleField } from '../../../../models/DisplayFields'
import { Set } from '../../../../models/Set'
import { DB_UNITS, Units, convertUnit } from '../../../../models/Units'
import NumericFieldAutosave from '../../../form-fields/NumericFieldAutosave'
import SetFieldSide from './SetFieldSide'
import SetFieldTimeMask from './SetFieldTimeMask'

const delimiterWidth = '15px'
type ComponentType = 'side' | 'time' | 'default'

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
  props: Props<S>
) {
  const { index, unit, delimiter, source } = props

  const componentType: ComponentType =
    source === 'side' ? 'side' : unit === TIME_FORMAT ? 'time' : 'default'

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
      <SetFieldComponent {...{ ...props, componentType }} />
      {/* pad the right side to be equal to the left side */}
      {index > 0 && <Box minWidth={delimiterWidth}></Box>}
    </Stack>
  )
})

// pick only the props actually used so fields that use
// generics don't conflict with component types
const sharedProps: Pick<TextFieldProps, 'slotProps' | 'sx'> = {
  slotProps: {
    htmlInput: { sx: { textAlign: 'center' } },
    input: { disableUnderline: true },
  },
  sx: { flexGrow: 1, flexBasis: 0 },
}

/** Choose which component to use for the set field.
 *  This is extracted out of the main component to prevent unecessary rerenders.
 *  Otherwise, on submit the input will rerender and lose focus.
 */
function SetFieldComponent<S extends keyof Units>({
  componentType,
  ...props
}: Props<S> & { componentType: ComponentType }) {
  const { value, handleSetChange } = props

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
    case 'default':
      return <SetFieldNumeric {...props} {...sharedProps} />
  }
}

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
      {...sharedProps}
      slotProps={{
        ...sharedProps.slotProps,
        input: {
          readOnly,
          ...sharedProps.slotProps?.input,
        },
      }}
    />
  )
}
