import { FilterAltOutlined } from '@mui/icons-material'
import { Chip, IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import { useState } from 'react'
import Category from '../models/Category'

interface Props {
  anchorEl?: HTMLElement
  categories?: Category[]
  category: Category | null
  setCategory: (category: Category | null) => void
}
export default function CategoryFilter({
  categories,
  category,
  setCategory,
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
    <>
      {!!category ? (
        <Chip
          label={category.name}
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
              key={newCategory.name}
              value={newCategory.name}
              // for some reason e.target.value is NOT returning the value, even though it is visible in e.target
              onClick={(_) => {
                setCategory(newCategory)
                setAnchorEl(null)
              }}
            >
              {newCategory.name}
            </MenuItem>
          ))}
      </Menu>
    </>
  )
}
