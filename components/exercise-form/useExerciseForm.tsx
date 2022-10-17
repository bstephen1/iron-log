import { createContext, useContext, useEffect, useState } from 'react';
import Exercise from '../../models/Exercise';

//todo: define the type
export const ExerciseFormContext = createContext<any>(null)

interface Props {
    exercise: Exercise | null,
    children?: JSX.Element,
}
export function ExerciseFormProvider({ children, exercise }: Props) {
    const [dirtyExercise, setDirtyExercise] = useState<Exercise | null>(exercise)

    //todo: value type. Should be something like typeof Exercise[field]
    const setField = (field: keyof Exercise, value: any) => dirtyExercise && setDirtyExercise({ ...dirtyExercise, [field]: value })

    useEffect(() => {
        setDirtyExercise(exercise)
    }, [exercise])

    //todo: add validity field
    return (
        <ExerciseFormContext.Provider
            value={{
                dirtyExercise,
                ...dirtyExercise, //spread lets each component select only the fields they use
                setField,
            }}
        >
            {children}
        </ExerciseFormContext.Provider>
    )
}
