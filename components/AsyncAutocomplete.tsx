import {
  Autocomplete,
  AutocompleteRenderInputParams,
  CircularProgress,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { GenericAutocompleteProps } from 'lib/util'
import { useCallback, useEffect, useState } from 'react'

export interface AsyncAutocompleteProps<T>
  extends Partial<GenericAutocompleteProps<T>> {
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
}
export default function AsyncAutocomplete<T>({
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
}: AsyncAutocompleteProps<T>) {
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
