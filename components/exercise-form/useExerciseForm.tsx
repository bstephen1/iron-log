import { createContext, useContext, useEffect, useState } from 'react'
import Exercise from '../../models/Exercise'

//the extension from DestructuredExercise allows direct access to fields. We use a mapped type to declare all fields are optional.
//It isn't strictly necessary since the full object is returned as well.
//It makes the consumer code a bit cleaner but adds some duplicate data to the return object
type DestructuredExercise = { [field in keyof Exercise]?: Exercise[field] }
interface Context extends DestructuredExercise {
  cleanExercise: Exercise | null
  dirtyExercise: Exercise | null
  setField: <K extends keyof Exercise>(field: K, value: Exercise[K]) => void
  invalidFields: InvalidFields
  setValidity: (field: keyof Exercise, isValid: boolean, reason: string) => void
  resetExercise: () => void
}

const ExerciseFormContext = createContext<Context | null>(null)

//any key with a truthy value is invalid. The value is a string with the reason for being invalid
export type InvalidFields = { [field in keyof Exercise]?: string }

//wrapper to appease ts since you could technically use the context without the provider,
//meaning it would still be the defaut value "null".
//Consumers should use this hook rather than calling useContext directly.
export const useExerciseFormContext = () => {
  const context = useContext(ExerciseFormContext)
  if (!context) {
    throw new Error('No ExerciseFormContext.Provider found!')
  }
  return context
}

interface Props {
  cleanExercise: Exercise | null
  children?: JSX.Element
}
export function ExerciseFormProvider({ children, cleanExercise }: Props) {
  const [dirtyExercise, setDirtyExercise] = useState<Exercise | null>(
    cleanExercise
  )
  const [invalidFields, setInvalidFields] = useState<InvalidFields>({})

  //need to use a generic for this! Also lookup types
  const setField = <K extends keyof Exercise>(field: K, value: Exercise[K]) => {
    dirtyExercise && setDirtyExercise({ ...dirtyExercise, [field]: value })
  }

  const resetExercise = () => {
    setDirtyExercise(cleanExercise)
    setInvalidFields({})
  }

  //fields that change from invalid to valid will be undefined, but the key will still exist
  const setValidity = (
    field: keyof Exercise,
    isValid: boolean,
    reason: string
  ) => {
    isValid
      ? invalidFields[field] &&
        setInvalidFields({ ...invalidFields, [field]: undefined })
      : setInvalidFields({ ...invalidFields, [field]: reason })
  }

  //we need to update state when the exercise changes since the context isn't rerendered
  useEffect(() => {
    setDirtyExercise(cleanExercise)
    setInvalidFields({})
  }, [cleanExercise])

  return (
    <ExerciseFormContext.Provider
      value={{
        cleanExercise,
        dirtyExercise,
        setField,
        invalidFields,
        setValidity,
        resetExercise,
        ...dirtyExercise, //spread lets each component select only the fields they use
      }}
    >
      {children}
    </ExerciseFormContext.Provider>
  )
}
