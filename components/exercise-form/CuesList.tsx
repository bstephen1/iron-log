import ClearIcon from '@mui/icons-material/Clear';
import { Button, Divider, IconButton, InputBase, Paper, Stack } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { ExerciseFormContext } from './useExerciseForm';


export default function CuesList() {
    // todo: this has lost its type! (and other context fields)
    const { cues, cleanExercise, setField } = useContext(ExerciseFormContext)

    function handleDeleteCue(i: number) {
        const newCues = cues.slice(0, i).concat(cues.slice(i + 1))
        setField('cues', newCues)
    }

    function handleUpdateCue(newCue: string, i: number) {
        const newCues = cues.slice(0, i).concat(newCue).concat(cues.slice(i + 1))
        setField('cues', newCues)
    }

    return (
        <>
            {/* todo: center text? outline? divider style in the middle? */}
            <Divider textAlign='center'>
                Cues
            </Divider>
            {/* todo: Component for each ListItem. drag n drop? */}
            <Button
                disabled={!cleanExercise}
                onClick={() => setField('cues', ['', ...cues])}
            >
                Add
            </Button>
            <Stack spacing={2}>
                {cues?.map((cue, i) => (
                    <CueInput
                        key={i}
                        index={i}
                        value={cue}
                        handleDelete={handleDeleteCue}
                        handleUpdate={handleUpdateCue}
                    />))}
            </Stack>
        </>
    )
}


interface Props {
    index: number,
    value: string,
    handleDelete: (key: any) => void,
    handleUpdate: (value: string, index: number) => void,
}
function CueInput(props: Props) {
    const { index, handleDelete, handleUpdate } = props
    const [value, setValue] = useState(props.value)

    function handleBlur() {
        //no edits. Note this means a fresh, blank cue will not be deleted on blur
        if (value === props.value) {
            return
        }

        //todo: do we want to automatically delete an empty cue here? Or wait til submit?
        if (!value) {
            handleDelete(index)
        } else {
            handleUpdate(value, index)
        }
    }


    //props.value will change when deleting an element or switching exercise,
    //but the EditableListItems will not rerender because they still exist in the new screen.
    //So we have to let them know to update value's state with the new props
    useEffect(() => {
        setValue(props.value)
    }, [props.value])

    return (
        <Paper
            component='form'
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder='Add cue'
                autoFocus={!value}
                multiline
                value={value}
                onBlur={handleBlur}
                onKeyDown={(e) => e.key === 'Enter' && (document.activeElement as HTMLElement).blur()}
                onChange={(e) => setValue(e.target.value)}
                inputProps={{ 'aria-label': 'Add cue' }}
            />
            <IconButton
                type='button'
                sx={{ p: '10px' }}
                aria-label='delete cue'
                onClick={() => handleDelete(index)}
            >
                <ClearIcon />
            </IconButton>
        </Paper>
    )
}