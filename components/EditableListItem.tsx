import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Input, InputAdornment, ListItem, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';



interface Props {
    index: number,
    value: string,
    editToggle?: boolean,
    handleDelete: (key: any) => void,
}
export default function EditableListItem(props: Props) {
    const { index, editToggle, handleDelete } = props
    const [edit, setEdit] = useState(editToggle || props.value === '')
    const [value, setValue] = useState(props.value)

    useEffect(() => {
        setEdit(editToggle)
    }, [editToggle])

    //props.value will change when deleting an element or switching exercise,
    //but the EditableListItems will not rerender because they still exist in the new screen.
    //So we have to let them know to update value's state with the new props
    useEffect(() => {
        setValue(props.value)
    }, [props.value])

    //todo: cursor position at end of input on mount, or where mouse is clicking
    //todo: input is shrinking width compared with text only
    return (
        <ListItem key={index}>
            <Stack direction='row'>
                <CircleIcon sx={{ height: 7, pt: 1 }} />
                {edit
                    ?
                    <>
                        {/* <Box width={24} /> */}
                        <Input
                            autoFocus={!editToggle || props.value === ''}
                            // disableUnderline
                            // onFocus={(e) => e.target.select()} //select all text on init
                            value={value}
                            multiline
                            fullWidth
                            onChange={(e) => setValue(e.target.value)}
                            // onBlur={() => !editToggle && setEdit(false)}
                            sx={{ p: 0 }}
                            onKeyDown={e => e.key === 'Enter' && e.preventDefault()} //allow multiline but without arbitrary new lines
                            endAdornment={
                                <InputAdornment position='end'>
                                    <DeleteIcon onClick={() => handleDelete(index)} sx={{ cursor: 'pointer' }} />
                                </InputAdornment>}
                        />
                    </>
                    : <>
                        <Typography
                            sx={{ flex: '1 1 auto', display: 'flex' }}
                            onClick={() => setEdit(true)}
                        >
                            {value}
                        </Typography>
                    </>
                }
            </Stack>
        </ListItem >
    )
}