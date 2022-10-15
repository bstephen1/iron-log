import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Input, InputAdornment, ListItem, Stack, Typography } from '@mui/material';
import { useState } from 'react';



interface Props {
    key?: any,
    value: any,
    edit?: boolean,
}
export default function EditableListItem(props: Props) {
    const { key } = props
    const [edit, setEdit] = useState(!!props.edit)
    const [value, setValue] = useState(props.value)

    //todo: cursor position at end of input on mount, or where mouse is clicking
    //todo: input is shrinking width compared with text only
    return (
        <ListItem key={key}>
            <Stack direction='row'>
                <CircleIcon sx={{ height: 7, pt: 1 }} />
                {edit
                    ?
                    <>
                        {/* <Box width={24} /> */}
                        <Input
                            autoFocus
                            // disableUnderline
                            // onFocus={(e) => e.target.select()} //select all text on init
                            value={value}
                            multiline
                            fullWidth
                            onChange={(e) => setValue(e.target.value)}
                            onBlur={() => setEdit(false)}
                            sx={{ p: 0 }}
                            onKeyDown={e => e.key === 'Enter' && e.preventDefault()} //allow multiline but without arbitrary new lines
                            endAdornment={
                                <InputAdornment position='end'>
                                    <DeleteIcon onClick={() => setEdit(false)} />
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