import { Check, ExpandMore } from '@mui/icons-material'
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { useState } from 'react'
import { WeighInType } from '../../models/Bodyweight'

interface Props {
  type: WeighInType
  handleTypeChange: (change: WeighInType) => void
}
export default function BodyweightInputToggle({
  type,
  handleTypeChange,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const open = !!anchorEl
  const id = open ? 'bodyweight-options-popper' : undefined

  return (
    <>
      <Tooltip title="options">
        <IconButton onClick={handleOpen} sx={{ p: '2px' }}>
          <ExpandMore />
        </IconButton>
      </Tooltip>
      <Menu
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <BodyweightMenuItem
          selected={type === 'official'}
          text="official weigh-ins"
          handleClick={() => handleTypeChange('official')}
        />
        <BodyweightMenuItem
          selected={type === 'unofficial'}
          text="unofficial weigh-ins"
          handleClick={() => handleTypeChange('unofficial')}
        />
      </Menu>
    </>
  )
}

function BodyweightMenuItem({
  selected,
  text,
  handleClick,
}: {
  selected: boolean
  text: string
  handleClick: () => void
}) {
  return (
    <MenuItem onClick={handleClick}>
      <ListItemIcon>{selected ? <Check /> : <></>}</ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  )
}
