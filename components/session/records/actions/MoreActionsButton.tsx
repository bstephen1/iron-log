import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Menu, MenuItem } from '@mui/material'
import { ReactNode, useState } from 'react'
import RecordHeaderButton from '../RecordHeaderButton'

interface Props {
  actionButtons: ReactNode[]
  visibleActions: number
}
export default function MoreActionsButton({
  visibleActions,
  actionButtons,
}: Props) {
  const isVisible = visibleActions < actionButtons.length
  const [moreButtonsAnchorEl, setMoreButtonsAnchorEl] =
    useState<null | HTMLElement>(null)

  const closeMenu = () => setMoreButtonsAnchorEl(null)

  return isVisible ? (
    <>
      <RecordHeaderButton
        title="More..."
        onClick={(e) => setMoreButtonsAnchorEl(e.currentTarget)}
      >
        <MoreVertIcon />
      </RecordHeaderButton>
      <Menu
        id="more options menu"
        anchorEl={moreButtonsAnchorEl}
        open={!!moreButtonsAnchorEl}
        onClose={closeMenu}
      >
        {actionButtons.slice(visibleActions).map((Action, i) => (
          // close onClick here in case Action opens another dialog
          <MenuItem key={i} onClick={closeMenu}>
            {Action}
          </MenuItem>
        ))}
      </Menu>
    </>
  ) : (
    <></>
  )
}
