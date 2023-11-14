import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import HourglassFullIcon from '@mui/icons-material/HourglassFull'
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import TooltipIconButton from 'components/TooltipIconButton'
import { MatchType } from 'models/query-filters/MongoQuery'
import { useState } from 'react'

interface Props {
  matchType: MatchType
  updateMatchType: (matchType: MatchType) => void
}
export default function ModifierMatchTypeSelector({
  matchType,
  updateMatchType,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = !!anchorEl
  const id = open ? 'modifier-match-type-popper' : undefined

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // somehow mui has no way to actually get the value you clicked on in a menu,
  // so we have to manually pass it in.
  const handleClick = (matchType: MatchType) => {
    updateMatchType(matchType)
    handleClose()
  }

  return (
    <>
      <TooltipIconButton
        title="Select match type"
        sx={{ p: '4px' }}
        onClickButton={handleOpen}
      >
        {matchType === MatchType.Exact ? (
          <HourglassFullIcon />
        ) : (
          <HourglassBottomIcon />
        )}
      </TooltipIconButton>
      <Menu
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem
          value={MatchType.Exact}
          onClick={() => handleClick(MatchType.Exact)}
          selected={matchType === MatchType.Exact}
        >
          <ListItemIcon>
            <HourglassFullIcon />
          </ListItemIcon>
          <ListItemText
            primary="Exact match"
            secondary="Records have only the listed modifiers"
          ></ListItemText>
        </MenuItem>
        <MenuItem
          value={MatchType.Partial}
          onClick={() => handleClick(MatchType.Partial)}
          selected={matchType === MatchType.Partial}
        >
          <ListItemIcon>
            <HourglassBottomIcon />
          </ListItemIcon>
          <ListItemText
            primary="Partial match"
            secondary="Records may have extra modifiers"
          ></ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
