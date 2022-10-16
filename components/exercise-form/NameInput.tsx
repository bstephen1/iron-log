import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useExercises } from '../../lib/frontend/restService';

//todo: parent needs to know when error
interface Props {
    cleanName?: string,
    dirtyName?: string,
    handleChange: (newName: string) => void,
}
export default function NameInput({ cleanName = '', dirtyName, handleChange }: Props) {
    const { exercises } = useExercises() //this should be cached from the top level form

    interface validity {
        isError: boolean,
        reason: string,
    }
    const defaultValidity: validity = { isError: false, reason: ' ' }
    const [validity, setValidity] = useState<validity>(defaultValidity)

    useEffect(() => {
        setValidity(defaultValidity)
    }, [cleanName])

    function validateChange(newName: string) {
        let isError = false
        let reason = ' '

        if (!newName) {
            isError = true
            reason = `Can't have an empty name!`
        } else if (cleanName === newName) {
            //valid -- explicity stated to avoid unnecessary find()
        } else if (exercises?.find(e => e.name === newName)) {
            isError = true
            reason = 'This exercise already exists!'
        }

        handleChange(newName)
        setValidity({
            isError: isError,
            reason: reason,
        })
    }
    return (
        <TextField
            required
            label='Name'
            error={validity.isError}
            disabled={dirtyName == undefined}
            helperText={validity.reason} //always keep at least a single space to keep consistent padding
            value={dirtyName}
            // InputLabelProps={{ shrink: !!dirtyExercise?.name }}
            onChange={(e) => validateChange(e.target.value)}
        />
    )
}