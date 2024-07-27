import BuildIcon from '@mui/icons-material/Build'
import HomeIcon from '@mui/icons-material/Home'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'
import TimelineIcon from '@mui/icons-material/Timeline'
import TodayIcon from '@mui/icons-material/Today'
import ArticleIcon from '@mui/icons-material/Article'
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
import { ComponentProps, useState } from 'react'
import {
  DATE_FORMAT,
  guestUserName,
  sampleLogDate,
} from '../lib/frontend/constants'
import { useSession } from 'next-auth/react'

const today = dayjs().format(DATE_FORMAT)

export default function NavbarDrawer() {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(!open)
  const { data } = useSession()
  const user = data?.user?.name
  const sessionDate = user === guestUserName ? sampleLogDate : today

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
            href={`/sessions/${sessionDate}`}
            text="Today"
            Icon={TodayIcon}
          />
          <NavbarLink href="/manage" text="Manage" Icon={BuildIcon} />
          <NavbarLink href="/history" text="History" Icon={TimelineIcon} />
          <NavbarLink href="/settings" text="Settings" Icon={SettingsIcon} />
          <NavbarLink
            href="https://github.com/bstephen1/iron-log/wiki"
            text="User guides"
            Icon={ArticleIcon}
          />
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
