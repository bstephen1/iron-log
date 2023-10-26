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
import { doNothing } from 'lib/util'
import {
  DisplayFields,
  ORDERED_DISPLAY_FIELDS,
  printFieldWithUnits,
  VisibleField,
} from 'models/DisplayFields'
import { Fragment, useMemo } from 'react'
import useRecordCard from '../useRecordCard'

interface Props extends Partial<SelectProps<string[]>> {
  handleSubmit?: (displayFields: DisplayFields) => void
  displayFields: DisplayFields
  showSplitWeight?: boolean
}
export default function SetHeader({
  handleSubmit = doNothing,
  displayFields,
  showSplitWeight: showSplitWeightOverride,
  ...selectProps
}: Props) {
  const { exercise, extraWeight } = useRecordCard()
  // also check attributes incase bodyweight is set to true but no bodyweight exists
  const showSplitWeight =
    showSplitWeightOverride ??
    (exercise?.attributes?.bodyweight || !!extraWeight)
  const showUnilateral = exercise?.attributes?.unilateral

  // Note that other records may need to update when the current record updates.
  // Eg, multiple RecordCards with the same exercise, or history cards.
  const selectedNames =
    displayFields?.visibleFields.map((field) => field.name) || []

  const options: VisibleField[] = useMemo(
    () =>
      ORDERED_DISPLAY_FIELDS.filter(
        (field) =>
          (field.enabled?.unilateral == undefined ||
            field.enabled.unilateral === showUnilateral) &&
          (field.enabled?.splitWeight == undefined ||
            field.enabled.splitWeight === showSplitWeight)
      ),
    [showSplitWeight, showUnilateral]
  )

  const handleChange = (rawSelectedNames: string | string[]) => {
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
      newSelectedNames.some((name) => name === optionField.name)
    )

    // Make sure we aren't submitting if there aren't actually any changes.
    // Should only need to check the length because if there is a change the length must change.
    // todo: test for this
    if (newVisibleFields.length !== selectedNames.length) {
      handleSubmit({ ...displayFields, visibleFields: newVisibleFields })
    }
  }

  return (
    <FormControl fullWidth>
      <InputLabel variant="standard" shrink={true}>
        Sets
      </InputLabel>
      {/* Select's generic type must match Props  */}
      <Select<string[]>
        multiple
        fullWidth
        displayEmpty
        value={selectedNames}
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
            {!selectedNames.length ? (
              <MenuItem disabled sx={{ p: 0 }}>
                <em>Select a display field to add sets.</em>
              </MenuItem>
            ) : (
              // there shouldn't be selectedNames that are outside the options, but it seems
              // to happen occasionally, probably from async updates
              options
                .filter((option) => selectedNames.includes(option.name))
                .map((field) => {
                  return (
                    <Fragment key={field.name}>
                      <Box
                        display="flex"
                        flexGrow="1"
                        // flexBasis makes it so flexGrow is based on the full element width, not just the extra space
                        flexBasis="0"
                        justifyContent="center"
                        textOverflow="ellipsis"
                        // todo: this will clip HH:MM:SS if using a lot of fields on a small screen
                        overflow="clip"
                      >
                        {' '}
                        {field.unitPrefix ?? ''}
                        {displayFields.units[field.source]}
                      </Box>
                    </Fragment>
                  )
                })
            )}
          </Stack>
        )}
        {...selectProps}
      >
        <MenuItem disabled value="">
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
}
