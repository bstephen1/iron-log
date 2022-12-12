import { FilterAltOutlined } from '@mui/icons-material'
import { Chip, IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'
import Category from '../models/Category'

interface Props {
  anchorEl?: HTMLElement
  categories?: Category[]
  categoryFilter: Category | null
  setCategoryFilter: Dispatch<SetStateAction<Category | null>>
}
export default function CategoryFilter({
  categories,
  categoryFilter,
  setCategoryFilter,
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
      {!!categoryFilter ? (
        <Chip
          label={categoryFilter.name}
          onClick={handleOpen}
          onDelete={() => setCategoryFilter(null)}
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
          categories.map((category) => (
            <MenuItem
              key={category.name}
              value={category.name}
              // for some reason e.target.value is NOT returning the value, even though it is visible in e.target
              onClick={(_) => {
                setCategoryFilter(category)
                setAnchorEl(null)
              }}
            >
              {category.name}
            </MenuItem>
          ))}
      </Menu>
    </>
  )
}
