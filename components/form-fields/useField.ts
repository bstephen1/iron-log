import { ChangeEvent, useRef, useState } from 'react'
import * as yup from 'yup'
import { Schema, ZodError } from 'zod'

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
  /** zod schema that determines whether the value is valid */
  valueSchema?: Schema
  /** the validator should be for a single field. Run reach() to specify the field to use. */
  yupValidator?: ReturnType<typeof yup.reach>
  debounceMilliseconds?: number
  /** handleSubmit should be provided unless manually handling submit (eg, combobox) */
  handleSubmit?: (value: T) => void
  /** required so we can determine the type. Cannot be undefined. */
  initialValue: T
  /** submit onBlur and on debounce. Defaults to true. */
  autoSubmit?: boolean
}
export default function useField<T = string>({
  valueSchema,
  yupValidator,
  debounceMilliseconds = 800,
  autoSubmit = true,
  handleSubmit,
  ...props
}: Props<T>) {
  const timerRef = useRef<NodeJS.Timeout>(undefined)
  const [error, setError] = useState('')
  // initialValue must be stored in state so we can determine if the prop has changed
  const [initialValue, setInitialValue] = useState(props.initialValue)
  const [value, setValue] = useState(props.initialValue)
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
      typeof value === 'string' &&
      console.log(
        `validating ${value !== initialValue ? 'dirty' : 'clean'}: ${value}`
      )

    if (valueSchema) {
      try {
        valueSchema.parse(value)
      } catch (e) {
        // zod returns an array of errors, so we have to extract the actual error
        if (e instanceof ZodError) {
          setError(e.errors[0].message)
        }
        return false
      }
    }

    return true

    // updating yup to v1 changed reach() to return Schema | Reference
    // yup has no documentation about what a reference is. Reference makes typescript
    // complain because it has no validate() property. Quick fix is to just guard it here.
    // See (unanswered): https://stackoverflow.com/questions/75704105/yup-1-x-how-to-validate-against-the-schema-of-a-specific-field
    if (
      !yupValidator ||
      value === initialValue ||
      !yup.isSchema(yupValidator)
    ) {
      return true
    }

    return await yupValidator
      .validate(value)
      .then(() => {
        setError('')
        return true
      })
      .catch((e: unknown) => {
        // error type will be yup.ValidationError
        if (e instanceof Error) {
          setError(e.message)
        }
        return false
      })
  }

  const submit = async (newValue = value) => {
    if (!handleSubmit) return

    if (await validate(newValue)) {
      handleSubmit(newValue)
    }
  }

  const reset = (value = initialValue) => {
    setError('')
    setValue(value)
    setInitialValue(value)
    // must make sure to clear any pending timers
    clearTimeout(timerRef.current)
  }

  if (initialValue !== props.initialValue) {
    reset(props.initialValue)
  }

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
    isDirty,
  }
}
