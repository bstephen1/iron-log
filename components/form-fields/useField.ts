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
  handleSubmit: (value: T) => void

  // required so we can determine the type. Cannot be undefined.
  // Note: If T is an array/object, use a const defined outside the component for
  // empty values or useEffect will infinitely re-render with a new object every render
  initialValue: T
  autoSubmit?: boolean
}
export default function useField<T = string>({
  yupValidator,
  debounceMilliseconds = 800,
  initialValue,
  autoSubmit = true,
  handleSubmit,
}: Props<T>) {
  const timerRef = useRef<NodeJS.Timeout>()
  const [error, setError] = useState('')
  const [value, setValue] = useState(initialValue)
  const isDirty = value !== initialValue

  // Spread this into an input component to set up the value.
  // If the input is simple this may be all that's needed!
  const control = (label?: string) => {
    return {
      label,
      value,
      onBlur,
      onChange,
    }
  }

  // todo: there's some weird behavior right after validating an error (debounce stops working)

  // initial we tracked isTouched but that behavior isn't fluid with an autosaving field.
  // The only benefit of onBlur is that we can immediately submit rather than wait for the debounce
  const onBlur = () => {
    clearTimeout(timerRef.current)

    autoSubmit && isDirty && submit()
  }

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value as T
    setValue(newValue)
    // Get instant feedback on whether value is valid.
    // submit() will also run validate so no need to pass the result to debouncedSubmit().
    validate(newValue)

    autoSubmit && debouncedSubmit(newValue)
  }

  const debouncedSubmit = (value: T) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => submit(value), debounceMilliseconds)
  }

  /** validate value and return whether the value is valid (true) or not (false) */
  const validate = async (value: T): Promise<boolean> => {
    process.env.NEXT_PUBLIC_BROWSER_LOG_LEVEL === 'verbose' &&
      console.log(
        `validating ${value !== initialValue ? 'dirty' : 'clean'}: ${value}`
      )
    if (!yupValidator || value === initialValue) {
      return true
    }

    return await yupValidator
      .validate(value)
      .then(() => {
        setError('')
        return true
      })
      .catch((e: yup.ValidationError) => {
        setError(e.message)
        return false
      })
  }

  const submit = async (newValue = value) => {
    if (await validate(newValue)) {
      handleSubmit(newValue)
    }
  }

  const reset = useRef((value = initialValue) => {
    setError('')
    setValue(value)
    // must make sure to clear any pending timers
    clearTimeout(timerRef.current)
  })

  useEffect(() => {
    reset.current(initialValue)
  }, [initialValue])

  return {
    control,
    debouncedSubmit,
    validate,
    submit,
    error,
    reset: reset.current,
    value,
    setValue,
    isEmpty: !value,
    isDirty,
  }
}
