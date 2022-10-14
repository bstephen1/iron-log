import { CheckBoxOutlineBlank } from '@mui/icons-material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete, Box, Button, Checkbox, Divider, Input, InputAdornment, List, ListItem, MenuItem, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { useState } from 'react';
import StyledDivider from '../components/StyledDivider';
import { updateExercise, useExercises, useModifiers } from '../lib/frontend/restService';
import Exercise from '../models/Exercise';
import { ExerciseStatus } from '../models/ExerciseStatus';

//todo: disable form stuff unless exercise is selected
//todo: ui element showing "changes saved"
export default function ManageExercisesPage() {
    const { exercises, mutate } = useExercises()
    const { modifiers } = useModifiers()
    const modifierNames = modifiers?.map(modifier => modifier.name) || []
    const [edit, setEdit] = useState(false)
    const [exercise, setExercise] = useState<Exercise | null>(null)

    interface DirtyNameValidity {
        isValid: boolean,
        reason: string,
    }
    const [dirtyNameValidity, setDirtyNameValidity] = useState<DirtyNameValidity>()
    const [dirtyExercise, setDirtyExercise] = useState<Exercise | null>(null)
    const statuses = Object.values(ExerciseStatus)
    //todo: confirmation when you try to leave page or switch exercise that Name change will be discarded if error
    const isNameError = !!exercise && !dirtyNameValidity?.isValid
    const INVISIBLE_HELPER_TEXT = ' ' //use this to keep height constant when there's no helper text


    function handleReset() {
        setDirtyExercise(exercise)
    }

    //todo: let ts know that dirtyExercise can't be null if exercise is populated
    function handleSubmit() {
        updateExercise(dirtyExercise)
        setExercise(dirtyExercise)
        mutate(exercises)
    }

    function handleExerciseChange(newExercise: Exercise | null) {
        setDirtyExercise(newExercise)
        setExercise(newExercise)
        setDirtyNameValidity({
            isValid: true,
            reason: INVISIBLE_HELPER_TEXT,
        })
    }

    function handleDirtyNameChange(newName: string) {
        let isValid = true
        let reason = INVISIBLE_HELPER_TEXT

        if (!newName) {
            isValid = false
            reason = `Can't have an empty name!`
        } else if (exercise?.name === newName) {
            //valid -- explicity stated to avoid unnecessary find()
        } else if (exercises?.find(e => e.name === newName)) {
            isValid = false
            reason = 'This exercise already exists!'
        }

        setDirtyExercise({ ...dirtyExercise, name: newName })
        setDirtyNameValidity({
            isValid: isValid,
            reason: reason,
        })
    }

    function handleStatusChange(newStatus: ExerciseStatus) {
        if (!dirtyExercise) return

        const newExercise = { ...dirtyExercise, status: newStatus }
        setDirtyExercise(newExercise)
    }

    if (!exercises || !modifiers) {
        return <></>
    }

    return (
        <Grid container spacing={2}>
            {/* todo: big screens. Switch to side by side? vertical divider? */}
            <Grid xs={12} md={3}>
                <Autocomplete
                    options={exercises} //todo: should sort. localeCompare? Some kind of hardcoded list (eg, favorites > active > archived)?
                    groupBy={exercise => exercise.status}
                    getOptionLabel={option => option.name}
                    value={exercise}
                    onChange={(e, newExercise) => handleExerciseChange(newExercise)}
                    renderInput={(params) => <TextField {...params} label='Exercise' />}
                />
            </Grid>
            <Grid xs={12}>
                <StyledDivider />
            </Grid>
            <Grid container xs={12} md={9} spacing={2}>
                <Grid xs={6}>
                    <Stack spacing={2}>
                        {/* todo: save after X ms of no typing, or on blur */}
                        <TextField
                            required
                            label='Name'
                            error={isNameError}
                            helperText={dirtyNameValidity?.reason || INVISIBLE_HELPER_TEXT}
                            value={dirtyExercise?.name} //todo: this doesn't rerender after it turns null
                            InputLabelProps={{ shrink: !!dirtyExercise?.name }}
                            onChange={(e) => handleDirtyNameChange(e.target.value)}
                        />
                        <TextField
                            select
                            required
                            label='Status'
                            helperText={INVISIBLE_HELPER_TEXT}
                            value={dirtyExercise?.status || null} //for some reason this NEEDS to specify null, unlike normal TextField
                            InputLabelProps={{ shrink: !!dirtyExercise?.status }}
                            onChange={(e) => handleStatusChange(e.target.value as ExerciseStatus)}
                        >
                            {statuses.map(status => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Autocomplete
                            options={modifierNames}
                            value={dirtyExercise?.validModifiers || []}
                            // groupBy={modifier => modifier.status}
                            // onChange={(e, newActiveModifiers) => updateRecord({ ...record, activeModifiers: newActiveModifiers }, index)}
                            multiple
                            fullWidth
                            disableCloseOnSelect
                            onChange={(e, newModifiers) => setDirtyExercise({ ...dirtyExercise, validModifiers: newModifiers })}
                            renderInput={(params) => <TextField {...params} variant='outlined' label='Valid Modifiers' />}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={<CheckBoxOutlineBlank />}
                                        checkedIcon={<CheckBoxIcon />}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option}
                                </li>
                            )}
                        />
                    </Stack>
                </Grid>
                <Grid xs={6}>
                    {/* todo: center text? outline? divider style in the middle? */}
                    <Typography variant='h6'>
                        Cues
                    </Typography>
                    {/* todo: Component for each ListItem. drag n drop? */}
                    <List>
                        {exercise?.cues.map(cue => (
                            <ListItem>
                                <Box onClick={() => setEdit(!edit)}>
                                    {edit
                                        ? <Input value={cue} multiline endAdornment={<InputAdornment position='end'><DeleteIcon /></InputAdornment>} />
                                        : <Typography><CircleIcon sx={{ height: 7 }} /> {cue}</Typography>
                                    }
                                </Box>
                                <Divider />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
            <Grid xs={12}>
                <Button onClick={handleReset}>Reset</Button>
                <Button variant='contained' disabled={false} onClick={handleSubmit}>Submit</Button>
            </Grid>
        </Grid >
    )

}