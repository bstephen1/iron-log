import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteRenderInputParams,
  CircularProgress,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { ComponentProps, ComponentType, useState } from 'react'
import { GenericAutocompleteProps } from '../../lib/util'

/*
 * HOC to add async loading state to an Autocomplete.
 *
 * This takes in a non-async react component which returns an Autocomplete,
 * uses an inner function to take in the props of the original react component,
 * then renders the original component with additional props and logic that handle the loading state.
 *
 * The component this function takes in must extend Autocomplete so it can accept the added props.
 *
 */
interface WithAsyncProps {
  label?: string
  startAdornment?: JSX.Element
  placeholder?: string
  variant?: string
  textFieldProps: TextFieldProps
}
export default function withAsync<T extends GenericAutocompleteProps<T>>(
  Component: ComponentType<T>
) {
  return function ({
    label,
    startAdornment,
    placeholder,
    variant = 'outlined',
    textFieldProps,
    ...autocompleteProps
  }: T) {
    const [open, setOpen] = useState(false)
    const loading = open && !autocompleteProps.options

    return (
      <Component
        {...autocompleteProps}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        loading={loading}
        loadingText="Loading..."
        renderInput={(params: AutocompleteRenderInputParams) => (
          <TextField
            {...params}
            placeholder={placeholder}
            label={label}
            variant={variant}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  {startAdornment}
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            {...textFieldProps}
          />
        )}
      />
    )
  }
}