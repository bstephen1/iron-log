import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import type { TextFieldProps } from '@mui/material/TextField'
import { memo } from 'react'
import { TIME_FORMAT } from '../../../../lib/frontend/constants'
import type { PartialUpdate } from '../../../../lib/types'
import type { VisibleField } from '../../../../models/DisplayFields'
import type { Set } from '../../../../models/Set'
import { convertUnit, DB_UNITS, type Units } from '../../../../models/Units'
import NumericFieldAutosave from '../../../form-fields/NumericFieldAutosave'
import SetFieldSide from './SetFieldSide'
import SetFieldTimeMask from './SetFieldTimeMask'

export const delimiterWidth = '15px'

type ComponentType = 'side' | 'time' | 'default'
type SharedProps = Pick<TextFieldProps, 'slotProps' | 'sx'>
interface Props<S extends keyof Units>
  extends Partial<Pick<VisibleField, 'delimiter' | 'name'>> {
  index: number
  handleSetChange: PartialUpdate<Set>
  value?: Set[S]
  unit: Units[S]
  readOnly?: boolean
  extraWeight?: number
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
        alignItems: 'center',
        flexGrow: 1,
        flexBasis: 0,
      }}
    >
      <Box
        minWidth={delimiterWidth}
        sx={{ display: 'flex', justifyContent: 'center' }}
      >
        {index > 0 ? (delimiter ?? '/') : ''}
      </Box>

      <SetFieldComponent {...{ ...props, componentType }} />
    </Stack>
  )
})

/** Choose which component to use for the set field.
 *  This is extracted out of the main component to prevent unecessary rerenders.
 *  Otherwise, on submit the input will rerender and lose focus.
 */
function SetFieldComponent<S extends keyof Units>({
  componentType,
  ...props
}: Props<S> & { componentType: ComponentType }) {
  const { value, handleSetChange, source } = props

  // pick only the props actually used so fields that use
  // generics don't conflict with component types
  const sharedProps: SharedProps = {
    slotProps: {
      htmlInput: { sx: { textAlign: 'center' }, 'aria-label': source },
      input: { disableUnderline: true, multiline: true },
    },
    sx: { flexGrow: 1, flexBasis: 0 },
  }

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
  name = source,
  handleSetChange,
  readOnly,
  extraWeight = 0,
  sx,
  slotProps,
}: Props<S> & SharedProps) {
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
      sx={sx}
      slotProps={{
        ...slotProps,
        input: {
          readOnly,
          ...slotProps?.input,
        },
      }}
    />
  )
}
