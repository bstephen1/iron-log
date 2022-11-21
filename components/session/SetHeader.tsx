import {
  Box,
  Checkbox,
  Input,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Stack,
} from '@mui/material'
import { grey } from '@mui/material/colors'
import { Dispatch, Fragment } from 'react'
import { DEFAULT_UNITS } from '../../lib/frontend/constants'

interface Props {
  selected: string[]
  setSelected: Dispatch<string[]>
}
export default function SetHeader({ selected, setSelected }: Props) {
  // todo: dnd this? user pref? per exercise?
  const FIELD_ORDER = ['weight', 'distance', 'time', 'reps', 'effort']

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
    <ListItemButton sx={{ p: 0 }}>
      <Select
        multiple
        fullWidth
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
        input={
          <Input
            disableUnderline
            sx={{
              borderBottom: '2px solid rgba(0, 0, 0, 0.42)',
              background: `${grey[100]}`,
            }}
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
            {selected.map((field, i) => (
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
            ))}
          </Stack>
        )}
      >
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
    </ListItemButton>
  )
}
