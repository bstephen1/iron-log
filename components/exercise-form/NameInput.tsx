import { TextField } from '@mui/material';
import { useExercises } from '../../lib/frontend/restService';
import { useExerciseFormContext } from './useExerciseForm';

export default function NameInput() {
    const { exercises } = useExercises() //this should be cached from the top level form (so no additional network request)
    const { name, setField, cleanExercise, invalidFields, setValidity } = useExerciseFormContext()

    function validateChange(newName: string) {
        let isValid = true
        let reason = ''

        if (!newName) {
            isValid = false
            reason = `Can't have an empty name!`
        } else if (cleanExercise?.name === newName) {
            //valid -- explicity stated to avoid unnecessary find()
        } else if (exercises?.find(e => e.name === newName)) {
            isValid = false
            reason = 'This exercise already exists!'
        }

        setField('name', newName)
        setValidity('name', isValid, reason)
    }

    return (
        <TextField
            required
            label='Name'
            error={!!invalidFields.name}
            disabled={name == null}
            helperText={invalidFields.name ?? ' '} //always keep at least a single space to keep consistent padding
            value={name ?? ''}
            InputLabelProps={{ shrink: !!name }} //doesn't always recognize a name exists when switching exercises
            onChange={(e) => validateChange(e.target.value)}
        />
    )
}