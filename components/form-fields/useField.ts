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

interface Props<T = string> {
  // the validator should be for a single field. Run reach() to specify the field to use.
  yupValidator?: ReturnType<typeof yup.reach>
  debounceMilliseconds?: number
  onChange?: any
  onBlur?: () => void
  onSubmit: (value: T) => void // todo: generic with ref?
  initialValue: T // required so we can determine the type. Cannot be undefined!
  useDebounce?: boolean
}
export default function useField<T>({
  yupValidator,
  debounceMilliseconds = 800,
  onSubmit,
  useDebounce = true,
  ...props
}: Props<T>) {
  // If initialValue is an empty array / object, React will create a new object
  // every render, thus triggering the useEffect to reset to the new initialValue infinitely.
  // useRef persists the object between renders to avoid this problem.
  const initialValue = useRef(props.initialValue)
  const timerRef = useRef<NodeJS.Timeout>()
  const [error, setError] = useState('')
  const [value, setValue] = useState(initialValue.current)
  const [isTouched, setIsTouched] = useState(false)

  // Spread this into an input component to set up the value.
  // If the input is simple this may be all that's needed!
  const control = (label?: string) => {
    return {
      label,
      value,
      onBlur,
      onChange: props.onChange ?? onChange,
    }
  }

  // providing an onBlur() won't override updating isTouched
  const onBlur = () => {
    setIsTouched(true)
    if (props.onBlur) props.onBlur()
  }

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value as T) // todo: tell ts this is for strings only
    useDebounce && debouncedSubmit()
  }

  const debouncedSubmit = () => {
    clearTimeout(timerRef.current)
    validate()
    timerRef.current = setTimeout(() => onSubmit(value), debounceMilliseconds)
  }

  const validate = () => {
    if (!yupValidator || !isTouched) return

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

  const reset = (value: T) => {
    setError('')
    setValue(value)
    setIsTouched(false)
  }

  useEffect(() => {
    console.log(initialValue.current)
    reset(initialValue.current)
  }, [initialValue.current])

  // todo: validator is running twice after error
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
    value,
    setValue,
    isEmpty: !value,
  }
}
