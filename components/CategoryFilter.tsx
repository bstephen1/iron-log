import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  SxProps,
  Tooltip,
} from '@mui/material'
import { Dispatch, SetStateAction } from 'react'

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

  // todo: onClose without selection: don't focus ExerciseSelector input
  // todo: use the TagSelect from notes list? add category to db?

  return (
    <Box sx={sx}>
      <Tooltip title="Select Category">
        {!!category ? (
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
        {!!categories &&
          categories.map((newCategory) => (
            <MenuItem
              key={newCategory}
              value={newCategory}
              // for some reason e.target.value is NOT returning the value, even though it is visible in e.target
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
