import {
  Box,
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
} from '@mui/material'
import { Fragment, useState } from 'react'
import { DEFAULT_UNITS } from '../../lib/frontend/constants'
import Set from '../../models/Set'

interface Props {
  initialSelected?: (keyof Set)[]
  handleSubmit: (value: (keyof Set)[]) => void
}
export default function SetHeader({ initialSelected, handleSubmit }: Props) {
  const [selected, setSelected] = useState(initialSelected || [])
  // todo: dnd this? user pref? per exercise?
  const FIELD_ORDER: (keyof Set)[] = [
    'weight',
    'distance',
    'time',
    'reps',
    'effort',
  ]

  const handleChange = (value: string | string[]) => {
    // According to MUI docs: "On autofill we get a stringified value"
    // reassigning value isn't updating the type so assigning a new const
    const valueAsArray = typeof value === 'string' ? value.split(',') : value

    // we want to ensure the order is consistent
    setSelected(
      FIELD_ORDER.filter((field) => valueAsArray.some((item) => item === field))
    )
  }

  return (
    <FormControl fullWidth>
      <InputLabel variant="standard" shrink={true}>
        Sets
      </InputLabel>
      <Select
        multiple
        fullWidth
        displayEmpty
        value={selected}
        label="Set Fields"
        // todo: do a check to only submit if selected is different from initialSelected?
        onBlur={() => handleSubmit(selected)}
        onClose={() => handleSubmit(selected)}
        onChange={(e) => handleChange(e.target.value)}
        input={
          <Input
          // disableUnderline
          // sx={{
          //   borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
          // }}
          />
        }
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
                    {DEFAULT_UNITS[field] ?? field}
                  </Box>
                </Fragment>
              ))
            )}
          </Stack>
        )}
      >
        <MenuItem disabled value="">
          <em>Select fields to display</em>
        </MenuItem>
        {FIELD_ORDER.map((field) => (
          <MenuItem key={field} value={field}>
            <Checkbox checked={selected.indexOf(field) > -1} />
            <ListItemText
              primary={
                field +
                (DEFAULT_UNITS[field] ? ` (${DEFAULT_UNITS[field]})` : '')
              }
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
