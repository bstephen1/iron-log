import BuildIcon from '@mui/icons-material/Build'
import HomeIcon from '@mui/icons-material/Home'
import MenuIcon from '@mui/icons-material/Menu'
import TodayIcon from '@mui/icons-material/Today'
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useState } from 'react'
import { DATE_FORMAT } from '../lib/frontend/constants'

const today = dayjs().format(DATE_FORMAT)

export default function NavbarDrawer() {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(!open)

  return (
    <>
      <IconButton onClick={toggleOpen} aria-label="open navbar menu drawer">
        <MenuIcon />
      </IconButton>
      {/* todo: manage exercises, graphs, light/dark toggle, program management, user account (in top right navbar) */}
      {/* todo: settings -- kg/lbs; rpe/rir  */}
      <Drawer anchor="left" open={open} onClose={toggleOpen}>
        <List>
          <NavbarLink link="/" text="Home" Icon={HomeIcon} />
          <NavbarLink
            link={`/sessions/${today}`}
            text="Today"
            Icon={TodayIcon}
          />
          <NavbarLink link="/manage" text="Manage" Icon={BuildIcon} />
        </List>
      </Drawer>
    </>
  )
}

interface LinkProps {
  link: string
  text: string
  Icon: typeof HomeIcon
}
function NavbarLink({ link, text, Icon }: LinkProps) {
  return (
    <Link href={link}>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    </Link>
  )
}
