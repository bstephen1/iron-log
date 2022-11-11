import {
  AutocompleteRenderInputParams,
  CircularProgress,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { ComponentType, useState } from 'react'

/*
 * HOC to add async loading state to an Autocomplete.
 *
 * This takes in a non-async react component which returns an Autocomplete,
 * uses an inner function to take in the props of the original react component,
 * then renders the original component with additional props and logic that handle the loading state.
 *
 * The component this function takes in must extend Autocomplete so it can accept the added props.
 *
 * This component must be able to see the options to show the loading state correctly.
 * Eg, withAsync(withOptions(BaseComponent)) will not work because the options are hydrated after withAsync().
 *
 * Likewise, any editing to the inner TextField must be wrapped outside of this component
 * since this component overwrites the Textfield to add the loading spinner adornment.
 *
 */

interface WithAsyncProps {
  label?: string
  startAdornment?: JSX.Element
  placeholder?: string
  variant?: TextFieldProps['variant']
  // a few textFieldProps are extracted for convenience, but others can be added here
  textFieldProps?: TextFieldProps
}
// T here is the type of the base component's props. Eg, T = SelectorBaseProps<Exercise, NamedStub>
// ts aggressively nags that "options" is missing. Manually extending it like this is clunky, but works.
export default function withAsync<T extends { options?: unknown[] }>(
  Component: ComponentType<T>
) {
  return function ({
    label,
    startAdornment,
    placeholder,
    variant,
    textFieldProps,
    ...baseComponentProps
  }: WithAsyncProps & T) {
    const [open, setOpen] = useState(false)
    const loading = open && !baseComponentProps.options

    return (
      <Component
        // This must match up with what Component is expecting, so we have to assure TS it's really type T
        {...(baseComponentProps as T)}
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
