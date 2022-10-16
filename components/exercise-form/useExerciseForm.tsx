import { createContext, useContext, useEffect, useState } from 'react';
import Exercise from '../../models/Exercise';


// const PLACEHOLDER_EXERCISE = new Exercise('')

export const ExerciseFormContext = createContext<any>(null)

interface Props {
    exercise: Exercise | null,
    children?: JSX.Element,
}
export function ExerciseFormProvider({ children, exercise }: Props) {
    const [dirtyExercise, setDirtyExercise] = useState<Exercise | null>(exercise)
    // const disabled = !exercise 

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
                // disabled: disabled,
            }}
        >
            {children}
        </ExerciseFormContext.Provider>
    )
}

// export function useExerciseForm(cleanExercise: Exercise | null) {
//     //assign a placeholder exercise rather than null to avoid a lot of null checks later
//     //since when cleanExercise is null, the whole form will be disabled 

//     const [dirtyExercise, setDirtyExercise] = useState<Exercise>(cleanExercise ?? (() => new Exercise('')))
//     const hasExercise = !!cleanExercise

//     const setField = (field: any, value: any) => setDirtyExercise({ ...dirtyExercise, [field]: value })
//     return {
//         dirtyExercise,
//         ...dirtyExercise, //spread lets each component select only the fields they use
//         setField,
//         hasExercise,
//     }
// }

// export function useDirtyExercise() {
//     const { dirtyExercise, setField } = useContext(ExerciseFormContext)
//     return { ...dirtyExercise, setField }
// }