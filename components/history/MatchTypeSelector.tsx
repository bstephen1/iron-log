import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import HourglassFullIcon from '@mui/icons-material/HourglassFull'
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import TooltipIconButton from 'components/TooltipIconButton'
import { ArrayMatchType } from 'models/query-filters/MongoQuery'
import { useState } from 'react'

interface Props {
  matchType: ArrayMatchType
  updateMatchType: (matchType: ArrayMatchType) => void
  disabled?: boolean
}
export default function MatchTypeSelector({
  matchType,
  updateMatchType,
  disabled,
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
  const handleClick = (matchType: ArrayMatchType) => {
    updateMatchType(matchType)
    handleClose()
  }

  return (
    <>
      <TooltipIconButton
        title={disabled ? '' : 'Select match type'}
        sx={{ p: '4px' }}
        onClickButton={handleOpen}
        disabled={disabled}
      >
        {matchType === ArrayMatchType.Exact ? (
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
          value={ArrayMatchType.Exact}
          onClick={() => handleClick(ArrayMatchType.Exact)}
          selected={matchType === ArrayMatchType.Exact}
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
          value={ArrayMatchType.Partial}
          onClick={() => handleClick(ArrayMatchType.Partial)}
          selected={matchType === ArrayMatchType.Partial}
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
