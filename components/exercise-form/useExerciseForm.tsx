import { createContext, useEffect, useState } from 'react';
import Exercise from '../../models/Exercise';

//todo: define the type
export const ExerciseFormContext = createContext<any>(null)

//actually need to use a type here over interface (called a mapped type)
export type InvalidFields = {
    [field in keyof Exercise]?: string
}

interface Props {
    cleanExercise: Exercise | null,
    children?: JSX.Element,
}
export function ExerciseFormProvider({ children, cleanExercise }: Props) {
    const [dirtyExercise, setDirtyExercise] = useState<Exercise | null>(cleanExercise)
    const [invalidFields, setInvalidFields] = useState<InvalidFields>({})

    //todo: value type. Should be something like typeof Exercise[field]
    const setField = (field: keyof Exercise, value: any) => dirtyExercise && setDirtyExercise({ ...dirtyExercise, [field]: value })

    const resetExercise = () => {
        setDirtyExercise(cleanExercise)
        setInvalidFields({})
    }

    const setValidity = (field: keyof Exercise, isValid: boolean, reason: string) => {
        isValid
            ? invalidFields[field] && setInvalidFields({ ...invalidFields, [field]: undefined })
            : setInvalidFields({ ...invalidFields, [field]: reason })
    }

    useEffect(() => {
        console.log(invalidFields)
    }, [invalidFields])

    useEffect(() => {
        setDirtyExercise(cleanExercise)
        setInvalidFields({})
    }, [cleanExercise])

    return (
        <ExerciseFormContext.Provider
            value={{
                cleanExercise,
                dirtyExercise,
                ...dirtyExercise, //spread lets each component select only the fields they use
                setField,
                invalidFields,
                setValidity,
                resetExercise,
            }}
        >
            {children}
        </ExerciseFormContext.Provider>
    )
}
