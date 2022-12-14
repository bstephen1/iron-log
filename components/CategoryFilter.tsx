import { FilterAltOutlined } from '@mui/icons-material'
import {
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  SxProps,
  Tooltip,
} from '@mui/material'
import { useState } from 'react'

interface Props {
  anchorEl?: HTMLElement
  categories?: string[]
  category: string | null
  setCategory: (category: string | null) => void
  sx?: SxProps
}
export default function CategoryFilter({
  categories,
  category,
  setCategory,
  sx,
  ...props
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(props.anchorEl ? props.anchorEl : e.currentTarget)
  }

  // todo: onClose without selection: don't focus ExerciseSelector input
  // todo: use the TagSelect from notes list? add category to db?

  const open = !!anchorEl
  const id = open ? 'exercise-filter-popper' : undefined

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
            <FilterAltOutlined />
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
