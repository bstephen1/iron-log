import {
  Autocomplete,
  AutocompleteRenderInputParams,
  CircularProgress,
  TextField,
  TextFieldProps,
} from '@mui/material'
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentType,
  useState,
} from 'react'
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
 * This component must be able to see the options to show the loading state correctly.
 * Eg, withAsync(withOptions(BaseComponent)) will not work because the options are hydrated after withAsync().
 *
 * Likewise, any editing to the inner TextField must be wrapped outside of this component
 * since this component overwrites the Textfield to add the loading spinner adornment.
 *
 */

// todo: should this be somehow ComponentType<T> or similar?
interface WithAsyncProps {
  label?: string
  startAdornment?: JSX.Element
  placeholder?: string
  variant?: TextFieldProps['variant']
  // a few textFieldProps are extracted for convenience, but others can be added here
  textFieldProps?: TextFieldProps
}
// unfortunately seems like <any> is required here. That or some esotaric ts wrangling.
// The componentType should be an extension of autocomplete, and withAsync needs to know the
// baseComponentProps' type so it can pass those off as required to whatever is calling withAsync.
export default function withAsync<T extends ComponentType<any>>(Component: T) {
  return function ({
    label,
    startAdornment,
    placeholder,
    variant = 'outlined',
    textFieldProps,
    ...baseComponentProps
  }: WithAsyncProps & ComponentPropsWithoutRef<T>) {
    const [open, setOpen] = useState(false)
    const loading = open && !baseComponentProps.options

    return (
      <Component
        // This also has to be any, probably related to the ComponentType being any.
        // But it should just be strictly the baseComponentProps, as seen by all the
        // withAsync-specific props being omitted.
        {...(baseComponentProps as any)}
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
