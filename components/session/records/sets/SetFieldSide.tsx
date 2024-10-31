import { Box, InputBaseComponentProps, SelectProps } from '@mui/material'
import { ComponentProps } from 'react'
import useNoSwipingDesktop from '../../../../lib/frontend/useNoSwipingDesktop'
import { UpdateFields } from '../../../../lib/util'
import { Set } from '../../../../models/Set'
import SelectFieldAutosave from '../../../form-fields/SelectFieldAutosave'

type Props = {
  value: Set['side']
  handleSetChange: UpdateFields<Set>
} & Partial<ComponentProps<typeof SelectFieldAutosave<Set['side']>>>
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
      fullWidth
      value={value ?? ''}
      handleSubmit={(side) =>
        handleSetChange({
          side: side,
        })
      }
      slotProps={{
        ...selectProps.slotProps,
        // @ts-ignore slotProps does not let you set the generic type of select
        select: {
          autoWidth: true,
          IconComponent: () => null,
          renderValue: (selected) => <Box>{selected}</Box>,
          ...selectProps.slotProps?.select,
        } as SelectProps<typeof value>,
        htmlInput: {
          sx: {
            pr: '0px !important', // disable baked in padding for IconComponent
            // mui does not provide proper typing to fields on slotProps
            ...(selectProps.slotProps?.htmlInput as InputBaseComponentProps)
              ?.sx,
          },
        },
      }}
    />
  )
}
