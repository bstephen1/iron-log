import BuildIcon from '@mui/icons-material/Build'
import HomeIcon from '@mui/icons-material/Home'
import MenuIcon from '@mui/icons-material/Menu'
import TimelineIcon from '@mui/icons-material/Timeline'
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
import { DATE_FORMAT } from 'lib/frontend/constants'
import Link from 'next/link'
import { ComponentProps, useState } from 'react'

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
        <List onClick={() => setOpen(false)}>
          <NavbarLink href="/" text="Home" Icon={HomeIcon} />
          <NavbarLink
            href={`/sessions/${today}`}
            text="Today"
            Icon={TodayIcon}
          />
          <NavbarLink href="/manage" text="Manage" Icon={BuildIcon} />
          <NavbarLink href="/history" text="History" Icon={TimelineIcon} />
        </List>
      </Drawer>
    </>
  )
}

interface NavbarLinkProps extends ComponentProps<typeof Link> {
  text: string
  Icon: typeof HomeIcon
}
function NavbarLink({ text, Icon, ...linkProps }: NavbarLinkProps) {
  // Shallow routing only works within the same url, so it won't do anything here.
  return (
    <Link {...linkProps}>
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
