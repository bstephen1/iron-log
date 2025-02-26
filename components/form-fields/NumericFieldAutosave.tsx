import InputFieldAutosave, {
  InputFieldAutosaveProps,
} from './InputFieldAutosave'

// This has to be a type because TextFieldProps isn't "statically known".
// Which means unlike an interface, we can't extend and override fields.
// We need to omit fields like initialValue or the type will be
// (number | undefined) & (string | undefined) => undefined
type Props = {
  initialValue?: number | null
  handleSubmit: (value?: number) => void
} & Omit<InputFieldAutosaveProps, 'initialValue' | 'handleSubmit'>
/** A wrapper for InputFields that takes in a number and converts it to a string for the InputField. */
export default function NumericFieldAutosave({
  initialValue,
  handleSubmit: handleNumberSubmit,
  ...inputFieldAutosaveProps
}: Props) {
  return (
    <InputFieldAutosave
      // String(undefined) causes a warning
      initialValue={String(initialValue ?? '')}
      handleSubmit={(str) => handleNumberSubmit(convertValueToNumber(str))}
      variant="standard"
      defaultHelperText=""
      isNumeric
      {...inputFieldAutosaveProps}
    />
  )
}

const convertValueToNumber = (value: string) => {
  value = value.trim()
  // have to explicitly handle an empty string because isNaN treats it as zero
  if (!value) {
    return undefined
  }
  // for some reason isNaN is requiring a number even though it casts to a number
  return isNaN(Number(value)) ? undefined : Number(value)
}
