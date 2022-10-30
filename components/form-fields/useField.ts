import { ChangeEvent, useEffect, useRef, useState } from 'react'
import * as yup from 'yup'

/*
 * This hook is based off the behavior of react-hook-form's useForm hook,
 * but focused on our use cases, namely:
 *  - Individual field validation rather than a complete form
 *  - Autosaving onBlur or after debounce if validation passes
 *  - Reset to defaultValue if it changes
 *
 * Initially this was following react-hook-form's philosophy of using uncontrolled
 * inputs, which should be theoretically more performant as they minimizes re-renders.
 * However, it was having issues with updating defaultValues properly so it was
 * replaced with using controlled values, which are easier to work with.
 *
 */

interface Props {
  // the validator should be for a single field. Run reach() to specify the field to use.
  yupValidator?: ReturnType<typeof yup.reach>
  debounceMilliseconds?: number
  onChange?: any
  onBlur?: any
  onSubmit: (value: any) => void // todo: generic with ref?
  initialValue?: any
}
export default function useField({
  yupValidator,
  debounceMilliseconds = 800,
  onSubmit,
  initialValue = '',
  ...props
}: Props) {
  const timerRef = useRef<NodeJS.Timeout>()
  const [error, setError] = useState('')
  const [value, setValue] = useState(initialValue)

  // Spread this into an input component to set up the value.
  // If the input is simple this may be all that's needed!
  const control = (label?: string) => {
    return {
      label,
      value,
      onBlur: props.onBlur ?? submit,
      onChange: props.onChange ?? onChange,
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value)
    debouncedSubmit()
  }

  const debouncedSubmit = () => {
    clearTimeout(timerRef.current)
    validate()
    timerRef.current = setTimeout(() => onSubmit(value), debounceMilliseconds)
  }

  const validate = () => {
    if (!yupValidator) return

    yupValidator
      .validate(value)
      .then(setError(''))
      .catch((e: yup.ValidationError) => setError(e.message))
  }

  const submit = () => {
    validate()
    // todo: don't think this stops submitting if validate() fails
    onSubmit(value)
  }

  const reset = (value = '') => {
    setValue(value)
    setError('')
  }

  useEffect(() => {
    reset(initialValue)
  }, [initialValue])

  // todo: validator is running twice after error; also don't validate until touched
  useEffect(() => {
    validate()
  }, [value])

  return {
    control,
    debouncedSubmit,
    validate,
    submit,
    error,
    reset,
    isEmpty: !value,
  }
}
