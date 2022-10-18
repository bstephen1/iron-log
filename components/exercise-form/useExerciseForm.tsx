import { createContext, useEffect, useState } from 'react';
import Exercise from '../../models/Exercise';

//todo: define the type
export const ExerciseFormContext = createContext<any>(null)

//actually need to use a type here over interface (called a mapped type)
export type FormValidity = {
    [field in keyof Exercise]?: FieldValidity
}
export interface FieldValidity {
    field: keyof Exercise,
    isValid: boolean,
    reason: string,
}

interface Props {
    cleanExercise: Exercise | null,
    children?: JSX.Element,
}
export function ExerciseFormProvider({ children, cleanExercise }: Props) {
    const [dirtyExercise, setDirtyExercise] = useState<Exercise | null>(cleanExercise)
    const [formValidity, setFormValidity] = useState<FormValidity>({})

    //todo: value type. Should be something like typeof Exercise[field]
    const setField = (field: keyof Exercise, value: any) => dirtyExercise && setDirtyExercise({ ...dirtyExercise, [field]: value })
    const setValidity = (field: keyof Exercise, validity: FieldValidity) => setFormValidity({ ...formValidity, [field]: validity })
    const resetExercise = () => setDirtyExercise(cleanExercise)
    useEffect(() => {
        setDirtyExercise(cleanExercise)
        setFormValidity({})
    }, [cleanExercise])

    //todo: add validity field
    return (
        <ExerciseFormContext.Provider
            value={{
                cleanExercise,
                dirtyExercise,
                ...dirtyExercise, //spread lets each component select only the fields they use
                setField,
                formValidity,
                setValidity,
                resetExercise,
            }}
        >
            {children}
        </ExerciseFormContext.Provider>
    )
}
