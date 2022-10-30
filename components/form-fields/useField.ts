import { useEffect, useRef, useState } from 'react'
import * as yup from 'yup'

/*
 * This hook is based off the behavior of react-hook-form's useForm hook,
 * but focused on our use cases, namely:
 *  - Individual field validation rather than a complete form
 *  - Autosaving onBlur or after debounce if validation passes
 *  - Reset to defaultValue if it changes
 *
 * Additionally, the hook strives to follow react-hook-form in preferring to use
 * uncontrolled fields to minimize re-renders.
 *
 */

interface Props {
  // the validator should be for a single field. Run reach() to specify the field to use.
  yupValidator?: ReturnType<typeof yup.reach>
  debounceMilliseconds?: number
  onChange?: any
  onBlur?: any
  onSubmit: (value: any) => void // generic with ref?
  defaultValue?: any // generic?
}
export default function useField({
  yupValidator,
  debounceMilliseconds = 800,
  onChange,
  onBlur,
  onSubmit,
  defaultValue = '',
}: Props) {
  const timerRef = useRef<NodeJS.Timeout>()
  const ref = useRef<any>()
  const [error, setError] = useState('')

  // spread this into an input, or inputProps in a MUI component.
  // As a function rather than a direct object it's a bit easier to work with
  // (an object would need to be defined after all of the values it uses)
  const register = () => ({
    ref: ref,
    onBlur: onBlur ?? submit,
    onChange: onChange ?? debouncedSubmit,
    defaultValue: defaultValue,
  })

  const debouncedSubmit = () => {
    clearTimeout(timerRef.current)
    validate()
    timerRef.current = setTimeout(submit, debounceMilliseconds)
  }

  const validate = () => {
    if (!yupValidator) return

    yupValidator
      .validate(ref.current.value)
      .then(setError(''))
      .catch((e: yup.ValidationError) => setError(e.message))
  }

  const submit = () => {
    validate()
    // todo: don't think this stops submitting if validate() fails
    onSubmit(ref.current.value)
  }

  const reset = (value?: string) => {
    ref.current.value = value ?? ''
    setError('')
  }

  useEffect(() => {
    reset(defaultValue)
  }, [defaultValue])

  return {
    register,
    debouncedSubmit,
    validate,
    submit,
    error,
    reset,
    isEmpty: !ref.current?.value, // todo
  }
}
