import { CheckBoxOutlineBlank } from '@mui/icons-material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import { useModifiers } from '../../lib/frontend/restService'
import { useExerciseFormContext } from './useExerciseForm'

export default function ModifiersInput() {
  const { modifiers } = useModifiers()
  const { validModifiers, setField } = useExerciseFormContext()
  const modifierNames = modifiers?.map((modifier) => modifier.name) || []
  const [open, setOpen] = useState(false) //need this to show loading only while open
  const loading = !modifiers && open //probably unlikely to ever see this since it's nested deep in the form

  //todo: can the loader be extracted to a component? Could use it for other autocompletes
  return (
    <Autocomplete
      multiple
      fullWidth
      disabled={!validModifiers}
      options={modifierNames}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      loading={loading}
      loadingText="Loading..."
      value={validModifiers || []}
      disableCloseOnSelect
      autoHighlight
      onChange={(e, newModifiers) => setField('validModifiers', newModifiers)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Valid Modifiers"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, modifierName, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<CheckBoxOutlineBlank />}
            checkedIcon={<CheckBoxIcon />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {modifierName}
        </li>
      )}
    />
  )
}
