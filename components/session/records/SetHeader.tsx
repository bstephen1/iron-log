import {
  Box,
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectProps,
  Stack,
} from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import { doNothing } from '../../../lib/util'
import { DisplayFields } from '../../../models/DisplayFields'
import { Set } from '../../../models/Set'

interface Props extends Partial<SelectProps<(keyof Set)[]>> {
  displayFields: DisplayFields
  handleSubmit?: (displayFields: DisplayFields) => void
}
export default function SetHeader({
  displayFields,
  handleSubmit = doNothing,
  ...selectProps
}: Props) {
  // The Select will submit to db on change so we could just use displayFields,
  // but using state allows for quicker visual updates on change. Just have to add a useEffect.
  const [selected, setSelected] = useState(displayFields?.visibleFields || [])
  // todo: dnd this? user pref? per exercise?
  const fieldOrder: (keyof Set)[] = [
    'weight',
    'distance',
    'time',
    'reps',
    'effort',
  ]

  // A different record may update displayFields.
  useEffect(() => {
    setSelected(displayFields.visibleFields)
  }, [displayFields])

  const handleChange = (value: string | string[]) => {
    // According to MUI docs: "On autofill we get a stringified value"
    // reassigning value isn't updating the type so assigning a new const
    const valueAsArray = typeof value === 'string' ? value.split(',') : value

    // we want to ensure the order is consistent
    const newSelected = fieldOrder.filter((field) =>
      valueAsArray.some((item) => item === field)
    )
    setSelected(newSelected)
    handleSubmit({ ...displayFields, visibleFields: newSelected })
  }

  return (
    <FormControl fullWidth>
      <InputLabel variant="standard" shrink={true}>
        Sets
      </InputLabel>
      {/* Select's generic type must match Props  */}
      <Select<typeof selected>
        multiple
        fullWidth
        displayEmpty
        value={selected}
        label="Set Fields"
        onChange={(e) => handleChange(e.target.value)}
        input={<Input />}
        renderValue={() => (
          <Stack
            direction="row"
            alignItems="center"
            // border is from TextField underline
            sx={{
              pl: 1,
            }}
          >
            {!selected.length ? (
              <MenuItem disabled sx={{ p: 0 }}>
                <em>Select a display field to add sets.</em>
              </MenuItem>
            ) : (
              selected.map((field, i) => (
                <Fragment key={i}>
                  <Box
                    display="flex"
                    flexGrow="1"
                    justifyContent="center"
                    textOverflow="ellipsis"
                    overflow="clip"
                  >
                    {' '}
                    {displayFields.units[field]}
                  </Box>
                </Fragment>
              ))
            )}
          </Stack>
        )}
        {...selectProps}
      >
        <MenuItem disabled value="">
          <em>Select fields to display</em>
        </MenuItem>
        {fieldOrder.map((field) => (
          <MenuItem key={field} value={field}>
            <Checkbox checked={selected.indexOf(field) > -1} />
            <ListItemText
              primary={`${field} ${
                displayFields.units[field] === field
                  ? ''
                  : `(${displayFields.units[field]})`
              }`}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
