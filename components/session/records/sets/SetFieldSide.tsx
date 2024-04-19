import { Box } from '@mui/material'
import useNoSwipingDesktop from '../../../../lib/frontend/useNoSwipingSmScreen'
import { UpdateFields } from '../../../../lib/util'
import { Set } from '../../../../models/Set'
import SelectFieldAutosave from '../../../form-fields/SelectFieldAutosave'
import { ComponentProps } from 'react'

interface Props
  extends Partial<ComponentProps<typeof SelectFieldAutosave<Set['side']>>> {
  value: Set['side']
  handleSetChange: UpdateFields<Set>
}
export default function SetFieldSide({
  value,
  handleSetChange,
  ...selectProps
}: Props) {
  const noSwipingClassName = useNoSwipingDesktop()

  return (
    <SelectFieldAutosave<Set['side']>
      {...selectProps}
      className={noSwipingClassName}
      variant="standard"
      label=""
      helperText=""
      initialValue={value}
      options={['L', 'R']}
      emptyOption="Both"
      inputProps={{
        sx: {
          pr: '0px !important', // disable baked in padding for IconComponent
          ...selectProps.inputProps?.sx,
        },
      }}
      fullWidth
      SelectProps={{
        autoWidth: true,
        IconComponent: () => null,
        renderValue: (selected) => <Box>{selected}</Box>,
      }}
      value={value ?? ''}
      handleSubmit={(side) =>
        handleSetChange({
          side: side,
        })
      }
    />
  )
}
