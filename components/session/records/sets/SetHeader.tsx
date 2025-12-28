import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Select, { type SelectProps } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useNoSwipingDesktop from '../../../../lib/frontend/useNoSwipingDesktop'
import {
  type DisplayFields,
  ORDERED_DISPLAY_FIELDS,
  printFieldWithUnits,
  type VisibleField,
} from '../../../../models/DisplayFields'
import { useExerciseUpdate } from '../useRecordUpdate'
import { delimiterWidth } from './RenderSetField'

type Props = {
  exerciseId?: string
  displayFields: DisplayFields
  showSplitWeight?: boolean
  showUnilateral?: boolean
} & Partial<SelectProps<string[]>>
export default function SetHeader({
  exerciseId,
  displayFields,
  showSplitWeight = false,
  showUnilateral = false,
  ...selectProps
}: Props) {
  const noSwipingDesktop = useNoSwipingDesktop()
  const updateExercise = useExerciseUpdate(exerciseId)
  // Note that other records may need to update when the current record updates.
  // Eg, multiple RecordCards with the same exercise, or history cards.
  const selectedNames = displayFields.visibleFields.map((field) => field.name)

  const options: VisibleField[] = ORDERED_DISPLAY_FIELDS.filter(
    (field) =>
      (field.enabled?.unilateral === undefined ||
        field.enabled.unilateral === showUnilateral) &&
      (field.enabled?.splitWeight === undefined ||
        field.enabled.splitWeight === showSplitWeight)
  )

  const handleChange = (rawSelectedNames: string | string[]) => {
    // According to MUI docs: "On autofill we get a stringified value",
    // which is the array stringified into a comma separated string.
    // Reassigning the value isn't updating the type so have to assign to a new var
    /* v8 ignore next */
    const newSelectedNames =
      typeof rawSelectedNames === 'string'
        ? rawSelectedNames.split(',')
        : rawSelectedNames

    // We want to ensure the order is consistent,
    // so don't use the raw value since that will append new values to the end.
    const newVisibleFields = options.filter((optionField) =>
      newSelectedNames.some((name) => name === optionField.name)
    )

    // Make sure we aren't submitting if there aren't actually any changes.
    // Should only need to check the length because if there is a change the length must change.
    if (newVisibleFields.length !== selectedNames.length) {
      updateExercise({
        displayFields: {
          ...displayFields,
          visibleFields: newVisibleFields,
        },
      })
    }
  }

  return (
    <FormControl fullWidth variant="standard">
      <InputLabel shrink={true} id="set-header-label">
        Sets
      </InputLabel>
      {/* Select's generic type must match Props  */}
      <Select<string[]>
        className={noSwipingDesktop}
        id="set-header"
        labelId="set-header-label"
        multiple
        fullWidth
        displayEmpty
        value={selectedNames}
        onChange={(e) => handleChange(e.target.value)}
        input={<Input />}
        // Remove the dropdown icon and padding, which messes up the
        // precise formatting desired to align with set rows.
        // Instead, we render the icon in renderValue for better style control.
        IconComponent={() => null}
        sx={{
          '& .MuiInput-input': {
            paddingRight: '0px !important',
          },
        }}
        renderValue={() => (
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              role: 'button',
              pl: '24px', // line up with set row padding
            }}
          >
            {!selectedNames.length ? (
              <Typography sx={{ opacity: 0.5, width: '100%' }}>
                <em>No display fields selected</em>
              </Typography>
            ) : (
              // there shouldn't be selectedNames that are outside the options, but it seems
              // to happen occasionally, probably from async updates
              options
                .filter((option) => selectedNames.includes(option.name))
                .map((field) => {
                  return (
                    <Box
                      key={field.name}
                      display="flex"
                      flexGrow="1"
                      // flexBasis makes it so flexGrow is based on the full element width, not just the extra space
                      flexBasis="0"
                      justifyContent="center"
                      pl={delimiterWidth}
                    >
                      {field.unitPrefix ?? ''}
                      {displayFields.units[field.source]}
                    </Box>
                  )
                })
            )}
            <Box
              minWidth="40px"
              display="flex"
              alignItems="center"
              justifyContent="right"
            >
              <ArrowDropDownIcon />
            </Box>
          </Stack>
        )}
        {...selectProps}
      >
        <MenuItem disabled>
          <em>Select fields to display</em>
        </MenuItem>
        {options.map((field) => (
          // MenuItem's value is what determines the values of selected. It has to be a primitive type,
          // so we can't use the field objects directly
          <MenuItem key={field.name} value={field.name}>
            <Checkbox
              checked={selectedNames.some((name) => name === field.name)}
              disableRipple
            />
            <ListItemText
              primary={printFieldWithUnits(field, displayFields.units)}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
