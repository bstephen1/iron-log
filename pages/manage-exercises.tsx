import { CheckBoxOutlineBlank } from '@mui/icons-material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete, Box, Checkbox, Divider, Grid, Input, InputAdornment, List, ListItem, MenuItem, OutlinedInput, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useExercises, useModifiers } from '../lib/frontend/restService';
import Exercise from '../models/Exercise';
import { ExerciseStatus } from '../models/ExerciseStatus';


export default function ManageExercisesPage() {
    const { exercises } = useExercises()
    const { modifiers } = useModifiers()
    const [edit, setEdit] = useState(false)
    const [exercise, setExercise] = useState<Exercise | null>(null)

    // useEffect(() => {
    //     console.log(exercise)
    //     console.log(exercise?.status === ExerciseStatus.ACTIVE)
    // }, [exercise])

    if (!exercises || !modifiers) {
        return <></>
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
                <Autocomplete
                    // open={true}
                    options={exercises}
                    groupBy={exercise => exercise.status}
                    getOptionLabel={option => option.name}
                    value={exercise}
                    onChange={(e, newExercise) => setExercise(newExercise)}
                    renderInput={(params) => <TextField {...params} label='Exercise' />}
                />
            </Grid>
            <Grid item xs={12} md={9}>
                {/* form */}
                <Stack direction='row' justifyContent='space-between'>
                    <TextField label='Name' required value={exercise?.name} InputLabelProps={{ shrink: true }} />
                    <TextField select label='Status' required value={exercise?.status} sx={{ width: 150 }}>
                        {Object.values(ExerciseStatus).map(status => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>
            </Grid>
            <Grid item xs={6}>
                {/* list for cues */}
                <Typography variant='h6'>
                    Cues
                </Typography>
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
            <Grid item xs={6}>
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
            </Grid>
        </Grid >
    )

}