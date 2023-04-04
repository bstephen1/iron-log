import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteRenderInputParams,
  CircularProgress,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'

// Extending Autocomplete is a lesson in frustration.
// Long story short, it needs to have a generic signature that exactly matches
// the generics from AutocompleteProps.
// Autocomplete infers its type from the generics, so if they aren't right
// all the other props will have the wrong type too.
// Anything that extends this also needs to add the same generic signature.
// For our case, we don't currently want DisableClearable or FreeSolo, so we
// can set them as false to avoid some of the tedium.
// Note also that multiple, freeSolo etc can't be called as props for the base
// autocomplete, they must be called in the parent component.
// See: https://github.com/mui/material-ui/issues/25502
export interface AsyncAutocompleteProps<T, Multiple extends boolean | undefined>
  extends Partial<AutocompleteProps<T, Multiple, false, false>> {
  label?: string
  startAdornment?: JSX.Element
  placeholder?: string
  variant?: TextFieldProps['variant']
  /** if the input has an adornment with a dropdown, the dropdown can interfere with the autocomplete dropdown. This value can indicate whether the adornment dropdown is open.  */
  adornmentOpen?: boolean
  /** a few textFieldProps are extracted for convenience, but others can be added here */
  textFieldProps?: TextFieldProps
  alwaysShowLoading?: boolean
  loadingText?: string
  /** for normal Autocompletes options are required, but in async they may be undefined while loading */
  options?: T[]
  /** freeSolo is disabled. To enable it must be added as a generic. */
  freeSolo?: false
  /** disableClearable is disabled. To enable it must be added as a generic. */
  disableClearable?: false
}
export default function AsyncAutocomplete<
  T,
  Multiple extends boolean | undefined
>({
  label,
  startAdornment,
  placeholder,
  variant,
  textFieldProps,
  adornmentOpen = false,
  alwaysShowLoading = false,
  loadingText = 'Loading...',
  options,
  ...autocompleteProps
}: AsyncAutocompleteProps<T, Multiple>) {
  const [open, setOpen] = useState(false)
  const [waitingToOpen, setWaitingToOpen] = useState(false)
  const loading = (alwaysShowLoading || open) && !options

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
    <Autocomplete
      {...autocompleteProps}
      loadingText={loadingText}
      options={options ?? []}
      loading={loading}
      open={open}
      // functions need to be careful to append to what the caller provides, not overwrite
      onOpen={(e) => {
        handleOpen()
        autocompleteProps.onOpen?.(e)
      }}
      onClose={(e, reason) => {
        handleClose()
        autocompleteProps.onClose?.(e, reason)
      }}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          {...textFieldProps}
          placeholder={placeholder}
          label={label}
          variant={variant}
          InputProps={{
            ...params.InputProps,
            ...textFieldProps?.InputProps,
            startAdornment: (
              <>
                {startAdornment}
                {params.InputProps.startAdornment}
                {textFieldProps?.InputProps?.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
                {textFieldProps?.InputProps?.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
