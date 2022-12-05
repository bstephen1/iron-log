import { Notes } from '@mui/icons-material'
import { Badge, Dialog } from '@mui/material'
import { useState } from 'react'

export default function RecordNotesDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Badge badgeContent={4} color="primary">
        <Notes />
      </Badge>
      <Dialog open={open}></Dialog>
    </>
  )
}
