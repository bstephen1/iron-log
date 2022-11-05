import { CategoryOutlined } from '@mui/icons-material'
import { Chip, IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import { useState } from 'react'
import { useCategories } from '../lib/frontend/restService'

interface Props {
  anchorEl?: HTMLElement
}
export default function CategoryFilter(props: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [category, setCategory] = useState('')
  const { categories: options } = useCategories()

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(props.anchorEl ? props.anchorEl : e.currentTarget)
  }

  const open = !!anchorEl
  const id = open ? 'exercise-filter-popper' : undefined

  return (
    <>
      {!!category ? (
        <Chip
          label={category}
          onClick={handleOpen}
          onDelete={() => setCategory('')}
        />
      ) : (
        <Tooltip title="Select Category">
          <IconButton onClick={handleOpen} sx={{ p: '4px' }}>
            <CategoryOutlined />
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
        {!!options &&
          options.map((option, i) => (
            <MenuItem
              key={option.name}
              value={option.name}
              // for some reason e.target.value is NOT returning the value, even though it is visible in e.target
              onClick={(_) => {
                setCategory(option.name)
                setAnchorEl(null)
              }}
            >
              {option.name}
            </MenuItem>
          ))}
      </Menu>
    </>
  )
}
