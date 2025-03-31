import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabled'
import HourglassFullIcon from '@mui/icons-material/HourglassFull'
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import TooltipIconButton from '../../components/TooltipIconButton'
import { ArrayMatchType } from '../../models/query-filters/ArrayMatchType'

type MatchTypeDescriptions = { [matchType in ArrayMatchType]: string }

const matchTypeOptions = {
  [ArrayMatchType.Exact]: {
    name: 'Exact match',
    value: ArrayMatchType.Exact,
    Icon: <HourglassFullIcon />,
  },
  [ArrayMatchType.Partial]: {
    name: 'Partial match',
    value: ArrayMatchType.Partial,
    Icon: <HourglassBottomIcon />,
  },
  [ArrayMatchType.Any]: {
    name: 'Disabled',
    value: ArrayMatchType.Any,
    Icon: <HourglassDisabledIcon />,
  },
}

interface Props {
  matchType: ArrayMatchType
  updateMatchType: (matchType: ArrayMatchType) => void
  options: ArrayMatchType[]
  /** Add an optional description to an option */
  descriptions?: Partial<MatchTypeDescriptions>
}
export default function MatchTypeSelector({
  matchType,
  updateMatchType,
  options,
  descriptions,
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
        title="Select match type"
        sx={{ p: '4px' }}
        onClickButton={handleOpen}
      >
        {matchTypeOptions[matchType].Icon}
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
        {options.map((option) => {
          const { value, Icon, name } = matchTypeOptions[option]
          const description = descriptions?.[option]

          return (
            <MenuItem
              key={value}
              value={value}
              onClick={() => handleClick(value)}
              selected={matchType === value}
            >
              <ListItemIcon>{Icon}</ListItemIcon>
              <ListItemText primary={name} secondary={description} />
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}
