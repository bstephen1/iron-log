import Autocomplete, {
  type AutocompleteProps,
  type AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import { useEffect, useState, type JSX } from 'react'

// Extending Autocomplete is a lesson in frustration.
// Long story short, it needs to have a generic signature that exactly matches
// the generics from AutocompleteProps.
// Autocomplete infers its type from the generics, so if they aren't right
// all the other props will have the wrong type too.
// Anything that extends this also needs to add the same generic signature.
// For our case, we don't currently want FreeSolo, so we
// can set them as false to avoid some of the tedium.
// Note also that multiple, freeSolo etc can't be called as props for the base
// autocomplete, they must be called in the parent component.
// See: https://github.com/mui/material-ui/issues/25502
export interface AsyncAutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
> extends Partial<AutocompleteProps<T, Multiple, DisableClearable, false>> {
  label?: string
  startAdornment?: JSX.Element
  placeholder?: string
  variant?: TextFieldProps['variant']
  /** if the input has an adornment with a dropdown, the dropdown can interfere with the autocomplete dropdown. This value can indicate whether the adornment dropdown is open.  */
  adornmentOpen?: boolean
  /** A few textFieldProps are extracted for convenience, but others can be added here.
   *  Note: slotProps are not handled; they will be ignored.
   */
  textFieldProps?: Omit<TextFieldProps, 'slotProps'>
  alwaysShowLoading?: boolean
  loadingText?: string
  /** for normal Autocompletes options are required, but in async they may be undefined while loading */
  options?: T[]
  /** freeSolo is disabled. To enable it must be added as a generic. */
  freeSolo?: false
  /** onOpen is overwritten internally */
  onOpen?: undefined
  /** onClose is internally overwritten */
  onClose?: undefined
}
export default function AsyncAutocomplete<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
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
}: AsyncAutocompleteProps<T, Multiple, DisableClearable>) {
  const [open, setOpen] = useState(false)
  const loading = (alwaysShowLoading || open) && !options

  const handleOpen = () => {
    // extra guard prevents opening both menus via keypresses
    !adornmentOpen && setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  // with app router the input is rendered on first load, but it needs to
  // be hydrated for event handlers to be registered so it actually works
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
  }, [])

  return (
    <Autocomplete
      {...autocompleteProps}
      openOnFocus
      loadingText={loadingText}
      options={options ?? []}
      loading={loading}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          {...textFieldProps}
          placeholder={placeholder}
          label={label}
          variant={variant}
          disabled={!hydrated}
          slotProps={{
            input: {
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
            },
          }}
        />
      )}
    />
  )
}
