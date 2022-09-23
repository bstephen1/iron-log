import { AppBar, Toolbar, Typography } from '@mui/material';
import NavbarDrawer from './NavbarDrawer';

export default function Navbar() {

    return (
        <AppBar position='sticky'>
            <Toolbar>
                <NavbarDrawer />
                <Typography variant='h5'>
                    Iron Journal
                </Typography>
            </Toolbar>
        </AppBar>
    )
}