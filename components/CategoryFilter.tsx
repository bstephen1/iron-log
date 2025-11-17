import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import type { SxProps } from '@mui/material/styles'
import type { Dispatch, SetStateAction } from 'react'
import Tooltip from './Tooltip'

interface Props {
  categories?: string[]
  category: string | null
  setCategory: (category: string | null) => void
  sx?: SxProps
  /** Determines whether menu is open. Null means it is closed. */
  anchorEl: HTMLElement | null
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>
}
export default function CategoryFilter({
  categories,
  category,
  setCategory,
  sx,
  anchorEl,
  setAnchorEl,
}: Props) {
  const open = !!anchorEl
  const id = open ? 'exercise-filter-popper' : undefined

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={sx}>
      <Tooltip title="Select category">
        {category ? (
          <Chip
            label={category}
            onClick={handleOpen}
            onDelete={() => setCategory(null)}
          />
        ) : (
          <IconButton onClick={handleOpen} sx={{ p: '4px' }}>
            <FilterAltOutlinedIcon />
          </IconButton>
        )}
      </Tooltip>
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
          value=""
          onClick={() => {
            setCategory(null)
            handleClose()
          }}
        >
          <em>No category</em>
        </MenuItem>
        {!!categories &&
          categories.map((newCategory) => (
            <MenuItem
              key={newCategory}
              value={newCategory}
              // mui does not provide a way to access the value of MenuItems.
              onClick={(_) => {
                setCategory(newCategory)
                handleClose()
              }}
            >
              {newCategory}
            </MenuItem>
          ))}
      </Menu>
    </Box>
  )
}
