import { AppBar, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import NavbarDrawer from './NavbarDrawer';

export default function Navbar() {

    return (
        <AppBar position='sticky' sx={{ mb: 2 }}>
            <Toolbar>
                <NavbarDrawer />
                <Typography variant='h5'>
                    <Link href={'/'}>
                        <a>Iron Log</a>
                    </Link>
                </Typography>
            </Toolbar>
        </AppBar>
    )
}