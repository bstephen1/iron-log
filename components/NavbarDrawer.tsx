import BuildIcon from '@mui/icons-material/Build'
import HomeIcon from '@mui/icons-material/Home'
import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'
import TimelineIcon from '@mui/icons-material/Timeline'
import TodayIcon from '@mui/icons-material/Today'
import ArticleIcon from '@mui/icons-material/Article'

import dayjs from 'dayjs'
import Link from 'next/link'
import { type ComponentProps, useState } from 'react'
import {
  DATE_FORMAT,
  guestUserName,
  sampleLogDate,
  userGuideLink,
} from '../lib/frontend/constants'
import { useSession } from 'next-auth/react'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

const today = dayjs().format(DATE_FORMAT)

export default function NavbarDrawer() {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(!open)
  const { data } = useSession()
  const user = data?.user?.name
  const sessionDate = user === guestUserName ? sampleLogDate : today

  return (
    <>
      <IconButton
        onClick={toggleOpen}
        aria-label="open navbar menu drawer"
        sx={{ mr: 1 }}
      >
        <MenuIcon />
      </IconButton>
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
            href={userGuideLink}
            text="User guide"
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
