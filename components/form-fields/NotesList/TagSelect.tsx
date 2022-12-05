import { CheckBoxOutlineBlank } from '@mui/icons-material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
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

interface Props extends Partial<SelectProps<string[]>> {
  options: string[]
  tags: string[]
  handleUpdate: (tags: string[]) => void
}
// this should be used as a start adornment in an input to render tags for that input
export default function TagSelect({
  options,
  tags,
  handleUpdate,
  ...selectProps
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Select
      multiple
      open={open}
      autoWidth
      displayEmpty
      onClose={() => setOpen(false)}
      onOpen={() => options.length && setOpen(true)}
      value={tags}
      onChange={(e) => handleUpdate(e.target.value as string[])}
      input={<Input disableUnderline placeholder="add tags" />}
      inputProps={{ sx: { pr: '0px !important' } }} // disable baked in padding for IconComponent
      IconComponent={() => null}
      renderValue={(selected) => <TagChips {...{ selected }} />}
      sx={{ pr: 2 }}
      {...selectProps}
    >
      {options.map((option) => {
        return (
          <MenuItem key={option} value={option}>
            <Checkbox
              icon={<CheckBoxOutlineBlank />}
              checkedIcon={<CheckBoxIcon />}
              style={{ marginRight: 8 }}
              checked={tags.some((x) => x === option)} // todo: add a "selected" boolean map?
            />
            <ListItemText primary={option} />
          </MenuItem>
        )
      })}
    </Select>
  )
}
