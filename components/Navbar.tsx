import { AppBar, Toolbar, Typography } from '@mui/material';

export default function Navbar() {

    return (
        <AppBar position='sticky'>
            <Toolbar>
                <Typography variant='h5'>
                    Iron Journal
                </Typography>
            </Toolbar>
        </AppBar>
    )
}