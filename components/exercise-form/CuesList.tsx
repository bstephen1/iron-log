import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { Divider, Grow, IconButton, InputBase, Paper, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useExerciseFormContext } from './useExerciseForm';

export default function CuesList() {
    const { cleanExercise, dirtyExercise, setField } = useExerciseFormContext()
    const cues = dirtyExercise?.cues ?? []

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
            <Stack spacing={2}>
                {cues.map((cue, i) => (
                    <CueInputBase
                        key={i}
                        index={i}
                        value={cue}
                        handleDelete={handleDeleteCue}
                        handleUpdate={handleUpdateCue}
                    />))}
                <CueInputAdd
                    watcher={cleanExercise?.name}
                    handleAdd={(newCue: string) => {
                        console.log(newCue)
                        setField('cues', [...cues, newCue])
                    }}
                />
            </Stack>
        </>
    )
}

interface AddProps {
    watcher: any,
    handleAdd: (newCue: string) => void,
}
function CueInputAdd(props: AddProps) {
    const { watcher, handleAdd } = props
    const [value, setValue] = useState('')

    const handleClear = () => setValue('')
    function handleAddAndClear() {
        handleClear()
        handleAdd(value)
    }

    useEffect(() => {
        handleClear()
    }, [watcher])

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
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        (document.activeElement as HTMLElement).blur()
                        handleAddAndClear()
                    }
                }}
                onChange={(e) => setValue(e.target.value)}
                inputProps={{ 'aria-label': 'Add cue' }}
            />
            <Grow in={!!value}>
                <IconButton
                    type='button'
                    sx={{ p: '10px' }}
                    disabled={!value}
                    aria-label='add cue'
                    onClick={handleAddAndClear}
                >
                    <CheckIcon />
                </IconButton>
            </Grow>
            <IconButton
                type='button'
                sx={{ p: '10px' }}
                disabled={!value}
                aria-label='clear cue'
                onClick={handleClear}
            >
                <ClearIcon />
            </IconButton>
        </Paper>
    )
}

interface BaseProps {
    index: number,
    value: string,
    handleDelete: (key: any) => void,
    handleUpdate: (value: string, index: number) => void,
}
function CueInputBase(props: BaseProps) {
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
    //but this component will not rerender when it still exists in the new screen (depends on list length).
    //So we have to let it know to update state
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
                onKeyDown={(e) => e.key === 'Enter' && (document.activeElement as HTMLElement).blur()} //todo: not sure about this behavior
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