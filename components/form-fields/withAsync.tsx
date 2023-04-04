import {
  AutocompleteRenderInputParams,
  CircularProgress,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { GenericAutocompleteProps } from 'lib/util'
import { ComponentType, useCallback, useEffect, useState } from 'react'

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

export interface WithAsyncProps {
  label?: string
  startAdornment?: JSX.Element
  placeholder?: string
  variant?: TextFieldProps['variant']
  /** if the input has an adornment with a dropdown, the dropdown can interfere with the autocomplete dropdown. This value can indicate whether the adornment dropdown is open.  */
  adornmentOpen?: boolean
  // a few textFieldProps are extracted for convenience, but others can be added here
  textFieldProps?: TextFieldProps
  alwaysShowLoading?: boolean
}
// T here is the type of the base component's props. Eg, T = SelectorBaseProps<Exercise, NamedStub>
// ts aggressively complains that "options" is missing. Searched for a way to get the generic signature
// out of T to pass to AutocompleteProps instead of any, but couldn't find a way to do it.
export default function withAsync<
  T extends Partial<GenericAutocompleteProps<T>>
>(Component: ComponentType<T>) {
  return function ({
    label,
    startAdornment,
    placeholder,
    variant,
    textFieldProps,
    adornmentOpen = false,
    alwaysShowLoading = false,
    ...baseComponentProps
  }: WithAsyncProps & T) {
    const [open, setOpen] = useState(false)
    const [waitingToOpen, setWaitingToOpen] = useState(false)
    const loading = (alwaysShowLoading || open) && !baseComponentProps.options

    const handleOpen = useCallback(() => {
      if (!adornmentOpen) {
        setOpen(true)
      } else {
        setWaitingToOpen(true)
      }
    }, [adornmentOpen])

    const handleClose = () => {
      setOpen(false)
    }

    useEffect(() => {
      if (adornmentOpen) {
        handleClose()
        // the adornment dropdown closes before state gets updated so waitingToOpen makes sure it will be able to open.
      } else if (!adornmentOpen && waitingToOpen) {
        handleOpen()
        setWaitingToOpen(false)
      }
    }, [adornmentOpen, handleOpen, waitingToOpen])

    return (
      <Component
        // This must match up with what Component is expecting, so we have to assure TS it's really type T
        {...(baseComponentProps as T)}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
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
