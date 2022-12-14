import { Menu } from '@mui/icons-material'
import { Drawer, IconButton, Link, List, ListItem } from '@mui/material'
import { useState } from 'react'

export default function NavbarDrawer() {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(!open)

  return (
    <>
      <IconButton onClick={toggleOpen} aria-label="open navbar menu drawer">
        <Menu />
      </IconButton>
      {/* todo: manage exercises, graphs, light/dark toggle, program management, user account (in top right navbar) */}
      {/* todo: settings -- kg/lbs; rpe/rir  */}
      <Drawer anchor="left" open={open} onClose={toggleOpen}>
        <List sx={{ px: 2 }}>
          <ListItem>
            <Link href="/">Home</Link>
          </ListItem>
          <ListItem>
            <Link href="/manage">Manage</Link>
          </ListItem>
        </List>
      </Drawer>
    </>
  )
}
