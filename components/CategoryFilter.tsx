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
import { useEffect, useState } from 'react'

interface Props {
  anchorEl?: HTMLElement
  categories?: string[]
  category: string | null
  setCategory: (category: string | null) => void
  /** function that is called when the open state changes */
  handleOpenChange?: (open: boolean) => void
  sx?: SxProps
}
export default function CategoryFilter({
  categories,
  category,
  setCategory,
  sx,
  handleOpenChange,
  ...props
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  // todo: onClose without selection: don't focus ExerciseSelector input
  // todo: use the TagSelect from notes list? add category to db?

  // essentially, anchorEl is acting as "open", this just converts it to a boolean
  const open = !!anchorEl
  const id = open ? 'exercise-filter-popper' : undefined

  useEffect(() => {
    handleOpenChange?.(open)
  }, [open, handleOpenChange])

  return (
    <Box sx={sx}>
      {!!category ? (
        <Chip
          label={category}
          onClick={handleOpen}
          onDelete={() => setCategory(null)}
        />
      ) : (
        <Tooltip title="Select Category">
          <IconButton onClick={handleOpen} sx={{ p: '4px' }}>
            <FilterAltOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
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
        {!!categories &&
          categories.map((newCategory) => (
            <MenuItem
              key={newCategory}
              value={newCategory}
              // for some reason e.target.value is NOT returning the value, even though it is visible in e.target
              onClick={(_) => {
                setCategory(newCategory)
                setAnchorEl(null)
              }}
            >
              {newCategory}
            </MenuItem>
          ))}
      </Menu>
    </Box>
  )
}
