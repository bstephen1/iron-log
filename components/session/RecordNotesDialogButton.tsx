import { Notes } from '@mui/icons-material'
import { Badge, Dialog } from '@mui/material'
import { ComponentProps, useState } from 'react'
import RecordHeaderButton from './RecordHeaderButton'

export default function RecordNotesDialogButton(
  props: Partial<ComponentProps<typeof RecordHeaderButton>>
) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <RecordHeaderButton title="Record Notes" {...props}>
        <Badge badgeContent={4} color="primary">
          <Notes />
        </Badge>
      </RecordHeaderButton>
      <Dialog open={open}></Dialog>
    </>
  )
}
