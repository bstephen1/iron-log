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
import { fixSelectBackground } from '../../../lib/frontend/constants'

interface Props extends Partial<SelectProps<string | string[]>> {
  options: string[]
  tags: string[] // single mode uses a singleton array
  multiple?: boolean
  handleUpdate: (tags: string[]) => void
}
// this should be used as a start adornment in an input to render tags for that input
export default function TagSelect({
  options,
  tags,
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
      onClose={() => setOpen(false)}
      onOpen={() => options.length && setOpen(true)}
      value={multiple ? tags : tags[0]}
      onChange={(e) => handleChange(e.target.value)}
      input={<Input disableUnderline />}
      inputProps={{ sx: { pr: '0px !important' } }} // disable baked in padding for IconComponent
      IconComponent={() => null}
      renderValue={(selected) => (
        <TagChips {...{ selected, multiple, readOnly: selectProps.readOnly }} />
      )}
      sx={{ pr: 2 }}
      {...fixSelectBackground}
      {...selectProps}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {multiple && (
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon />}
              checkedIcon={<CheckBoxIcon />}
              style={{ marginRight: 8 }}
              checked={tags.some((x) => x === option)} // todo: add a "selected" boolean map?
            />
          )}
          <ListItemText primary={option} />
        </MenuItem>
      ))}
    </Select>
  )
}
