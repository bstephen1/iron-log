import {
  Box,
  capitalize,
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
import { Fragment, useEffect, useMemo, useState } from 'react'
import { doNothing } from '../../../lib/util'
import {
  DisplayFields,
  ORDERED_DISPLAY_FIELDS,
  VisibleField,
} from '../../../models/DisplayFields'

interface Props extends Partial<SelectProps<string[]>> {
  displayFields: DisplayFields
  handleSubmit?: (displayFields: DisplayFields) => void
  showSplitWeight?: boolean
  showUnilateral?: boolean
}
export default function SetHeader({
  displayFields,
  handleSubmit = doNothing,
  showSplitWeight = false,
  showUnilateral = false,
  ...selectProps
}: Props) {
  // The Select will submit to db on change so we could just use displayFields,
  // but using state allows for quicker visual updates on change. Just have to add a useEffect.
  const [selectedNames, setSelectedNames] = useState(
    displayFields?.visibleFields.map((field) => field.name) || []
  )

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

  // when options change, some selectedNames may have been removed from visible options, but still are
  // selected internally. We have to unselect them. Also, if weight / split weight were selected, swap
  // to the newly visible option
  useEffect(() => {
    const hiddenSelected = selectedNames.filter(
      (name) => !options.find((field) => field.name === name)
    )
    let newSelected = selectedNames.filter(
      (name) => !hiddenSelected.includes(name)
    )

    if (hiddenSelected.includes('weight')) {
      newSelected = [...newSelected, 'plateWeight', 'totalWeight']
    } else if (
      hiddenSelected.some(
        (name) => name === 'plateWeight' || name === 'totalWeight'
      )
    ) {
      newSelected = [...newSelected, 'weight']
    }

    handleChange(newSelected)

    // do not want to call this if handleChange or selectedNames change, only options.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options])

  // A different record may update displayFields.
  useEffect(() => {
    setSelectedNames(displayFields.visibleFields.map((field) => field.name))
  }, [displayFields])

  const handleChange = (rawSelectedNames: string | string[]) => {
    // According to MUI docs: "On autofill we get a stringified value",
    // which is the array stringified into a comma separated string.
    // Reassigning the value isn't updating the type so have to assign to a new var
    const selectedNames =
      typeof rawSelectedNames === 'string'
        ? rawSelectedNames.split(',')
        : rawSelectedNames

    // We want to ensure the order is consistent,
    // so don't use the raw value since that will append new values to the end.
    const newVisibleFields = options.filter((optionField) =>
      selectedNames.some((name) => name === optionField.name)
    )

    setSelectedNames(newVisibleFields.map((field) => field.name))
    handleSubmit({ ...displayFields, visibleFields: newVisibleFields })
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
              primary={`${field.label ?? capitalize(field.name)} ${
                displayFields.units[field.source] === field.name
                  ? ''
                  : `(${field.unitPrefix ?? ''}${
                      displayFields.units[field.source]
                    })`
              }`}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
