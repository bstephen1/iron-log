import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import {
  Checkbox,
  Input,
  ListItemText,
  MenuItem,
  Select,
  SelectProps,
} from '@mui/material'
import { useState } from 'react'
import TagChips from './TagChips'

type Props = {
  options?: string[]
  /** use a singleton array if multiple is false */
  selectedTags?: string[]
  multiple?: boolean
  handleUpdate: (tags: string[]) => void
} & Partial<SelectProps<string | string[]>>
/** this should be used as a start adornment in an input to render tags for that input */
export default function TagSelect({
  options = [],
  selectedTags = [],
  handleUpdate,
  multiple,
  ...selectProps
}: Props) {
  const [open, setOpen] = useState(false)

  const handleChange = (value: string | string[]) =>
    handleUpdate(typeof value === 'string' ? [value] : value)

  return (
    <Select
      open={open}
      multiple={multiple}
      autoWidth
      displayEmpty
      // prevent error with "notched" by avoiding outlined variant. The variant is invisible so doesn't matter.
      variant="standard"
      onClose={() => setOpen(false)}
      onOpen={() => options.length && setOpen(true)}
      // if not multiple we need to ensure the value is not undefined
      // so the component is always controlled
      value={multiple ? selectedTags : (selectedTags[0] ?? '')}
      onChange={(e) => handleChange(e.target.value)}
      input={<Input disableUnderline />}
      IconComponent={() => null}
      renderValue={(value) => <TagChips {...{ value, multiple }} />}
      sx={{ pr: 2 }}
      slotProps={{
        input: { sx: { pr: '0px !important' } },
      }}
      {...selectProps}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {multiple && (
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon />}
              checkedIcon={<CheckBoxIcon />}
              style={{ marginRight: 8 }}
              checked={selectedTags.includes(option)}
            />
          )}
          <ListItemText primary={option} />
        </MenuItem>
      ))}
    </Select>
  )
}
