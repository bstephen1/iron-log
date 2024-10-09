import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
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
  Typography,
} from '@mui/material'
import { memo, useState } from 'react'
import isEqual from 'react-fast-compare'
import { fixSelectBackground } from '../../../../lib/frontend/constants'
import useNoSwipingDesktop from '../../../../lib/frontend/useNoSwipingDesktop'
import { UpdateFields } from '../../../../lib/util'
import Exercise from '../../../../models/AsyncSelectorOption/Exercise'
import {
  DisplayFields,
  ORDERED_DISPLAY_FIELDS,
  printFieldWithUnits,
  VisibleField,
} from '../../../../models/DisplayFields'

type Props = {
  mutateExerciseFields?: UpdateFields<Exercise>
  displayFields: DisplayFields
  showSplitWeight?: boolean
  showUnilateral?: boolean
} & Partial<SelectProps<string[]>>
export default memo(function SetHeader({
  mutateExerciseFields,
  displayFields,
  showSplitWeight,
  showUnilateral,
  ...selectProps
}: Props) {
  const noSwipingDesktop = useNoSwipingDesktop()
  // Note that other records may need to update when the current record updates.
  // Eg, multiple RecordCards with the same exercise, or history cards.
  const selectedNames =
    displayFields?.visibleFields.map((field) => field.name) || []

  const options: VisibleField[] = ORDERED_DISPLAY_FIELDS.filter(
    (field) =>
      (field.enabled?.unilateral == undefined ||
        field.enabled.unilateral === showUnilateral) &&
      (field.enabled?.splitWeight == undefined ||
        field.enabled.splitWeight === showSplitWeight),
  )

  const handleChange = (rawSelectedNames: string | string[]) => {
    if (!mutateExerciseFields) return

    // According to MUI docs: "On autofill we get a stringified value",
    // which is the array stringified into a comma separated string.
    // Reassigning the value isn't updating the type so have to assign to a new var
    const newSelectedNames =
      typeof rawSelectedNames === 'string'
        ? rawSelectedNames.split(',')
        : rawSelectedNames

    // We want to ensure the order is consistent,
    // so don't use the raw value since that will append new values to the end.
    const newVisibleFields = options.filter((optionField) =>
      newSelectedNames.some((name) => name === optionField.name),
    )

    // Make sure we aren't submitting if there aren't actually any changes.
    // Should only need to check the length because if there is a change the length must change.
    // todo: test for this
    if (newVisibleFields.length !== selectedNames.length) {
      mutateExerciseFields({
        displayFields: {
          ...displayFields,
          visibleFields: newVisibleFields,
        },
      })
    }
  }

  // todo: this Select doesn't focus when you click on it. SetTypeSelect also doesn't when you click on the renderValue portion (it does with the label)
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
        IconComponent={(props) => (
          <ArrowDropDownIcon
            {...props}
            // override absolute positioning that shifts it off center
            sx={{ right: '0 !important' }}
          />
        )}
        renderValue={() => (
          <Stack
            direction="row"
            alignItems="center"
            // border is from TextField underline
            sx={{
              px: 1,
              role: 'button',
            }}
          >
            {!selectedNames.length ? (
              <Typography sx={{ opacity: 0.5 }}>
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
                      textOverflow="ellipsis"
                      // todo: this will clip HH:MM:SS if using a lot of fields on a small screen
                      overflow="clip"
                    >
                      {field.unitPrefix ?? ''}
                      {displayFields.units[field.source]}
                    </Box>
                  )
                })
            )}
          </Stack>
        )}
        {...fixSelectBackground}
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
            />
            <ListItemText
              primary={printFieldWithUnits(field, displayFields.units)}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}, isEqual)
