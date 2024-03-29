import ListIcon from '@mui/icons-material/List'
import {
  Badge,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import { useRecords } from '../../../lib/frontend/restService'

const maxRecords = 10

interface Props {
  /** name of the exercise */
  name: string
  buttonProps?: ButtonProps
}
export default function UsageButton({ name, buttonProps }: Props) {
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  const { records } = useRecords({ exercise: name, limit: maxRecords + 1 })

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        startIcon={
          <Badge
            badgeContent={records?.length}
            max={maxRecords}
            color="primary"
            aria-label={`used in ${records?.length} record${records?.length !== 1 ? 's' : ''}`}
          >
            <ListIcon />
          </Badge>
        }
        disabled={!records?.length}
        {...buttonProps}
      >
        Usage
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Usage for {name}</DialogTitle>
        <DialogContent>
          <Stack spacing={0.5}>
            {records?.slice(0, maxRecords).map(({ date }) => (
              <Link key={date} href={`/sessions/${date}`}>
                {date}
              </Link>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
