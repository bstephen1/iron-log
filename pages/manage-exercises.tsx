import { CheckBoxOutlineBlank } from '@mui/icons-material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete, Box, Checkbox, Divider, Grid, Input, InputAdornment, List, ListItem, MenuItem, Stack, TextField, Typography } from '@mui/material';
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
    const [edit, setEdit] = useState(false)
    const [exercise, setExercise] = useState<Exercise | null>(null)

    interface ModifiedName {
        name: string,
        isValid: boolean,
        reason: string,
    }
    const [modifiedName, setModifiedName] = useState<ModifiedName>()
    const statuses = Object.values(ExerciseStatus)
    //todo: confirmation when you try to leave page or switch exercise that Name change will be discarded if error
    //I think this is the only field with a constraint, so everything else can save instantly
    const isNameError = !!exercise && !modifiedName?.isValid

    function handleExerciseChange(newExercise: Exercise | null) {
        setExercise(newExercise)
        setModifiedName({
            name: newExercise?.name || '',
            isValid: true,
            reason: '',
        })
    }

    function handleModifiedNameChange(newName: string) {
        let isValid = true
        let reason = ' ' //invisible HelperText to keep the height constant

        if (!newName) {
            isValid = false
            reason = `Can't have an empty name!`
        } else if (exercise?.name === newName) {
            //valid -- explicity stated to avoid unnecessary find()
        } else if (exercises?.find(e => e.name === newName)) {
            isValid = false
            reason = 'This exercise already exists!'
        }

        setModifiedName({
            name: newName,
            isValid: isValid,
            reason: reason,
        })

        if (isValid && exercise) {
            updateExercise({ ...exercise, name: newName })
            setExercise({ ...exercise, name: newName })
            mutate(exercises)
        }
    }

    function handleStatusChange(newStatus: ExerciseStatus) {
        if (exercise === null) return
        const newExercise = { ...exercise, status: newStatus }
        setExercise(newExercise)
        updateExercise(newExercise)

        //todo: exercise isn't being updated, so this should be showing the stale data, then re-fetching from db
        mutate(exercises)
    }

    if (!exercises || !modifiers) {
        return <></>
    }

    return (
        <Grid container spacing={2}>
            {/* todo: big screens. Switch to side by side? vertical divider? */}
            <Grid item xs={12} md={3}>
                <Autocomplete
                    options={exercises} //todo: should sort. localeCompare? Some kind of hardcoded list (eg, favorites > active > archived)?
                    groupBy={exercise => exercise.status}
                    getOptionLabel={option => option.name}
                    value={exercise}
                    onChange={(e, newExercise) => handleExerciseChange(newExercise)}
                    renderInput={(params) => <TextField {...params} label='Exercise' />}
                />
            </Grid>
            <Grid item xs={12}>
                <StyledDivider />
            </Grid>
            <Grid item container xs={12} md={9} spacing={2}>
                <Grid item xs={6}>
                    <Stack spacing={2}>
                        {/* todo: save after X ms of no typing, or on blur */}
                        <TextField
                            required
                            label='Name'
                            error={isNameError}
                            helperText={modifiedName?.reason || ' '}
                            value={modifiedName?.name}
                            InputLabelProps={{ shrink: !!modifiedName?.name }}
                            onChange={(e) => handleModifiedNameChange(e.target.value)}
                        />
                        <TextField
                            select
                            required
                            label='Status'
                            helperText={' '} //to keep consistent spacing with Name field
                            value={exercise?.status || null} //for some reason this NEEDS to specify null, unlike normal TextField
                            InputLabelProps={{ shrink: !!exercise?.status }}
                            onChange={(e) => handleStatusChange(e.target.value as ExerciseStatus)}
                        >
                            {statuses.map(status => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Autocomplete
                            options={modifiers}
                            value={[]}
                            getOptionLabel={modifier => modifier.name}
                            // groupBy={modifier => modifier.status}
                            // onChange={(e, newActiveModifiers) => updateRecord({ ...record, activeModifiers: newActiveModifiers }, index)}
                            multiple
                            fullWidth
                            disableCloseOnSelect
                            renderInput={(params) => <TextField {...params} variant='outlined' label='Modifiers' />}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={<CheckBoxOutlineBlank />}
                                        checkedIcon={<CheckBoxIcon />}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option.name}
                                </li>
                            )}
                        />
                    </Stack>
                </Grid>
                <Grid item xs={6}>
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
        </Grid >
    )

}