import ListIcon from '@mui/icons-material/List'

import Link from 'next/link'
import { useState } from 'react'
import { useRecords } from '../../../lib/frontend/restService'
import { stringifySetType } from '../../../models/Set'
import Badge from '@mui/material/Badge'
import Button, { type ButtonProps } from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

const maxRecords = 10

interface Props {
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
            aria-label={`used in ${records?.length ?? 0} record${records?.length !== 1 ? 's' : ''}`}
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
        <DialogContent sx={{ py: 0 }}>
          <List disablePadding>
            {records
              ?.slice(0, maxRecords)
              .map(({ date, setType, sets, exercise }) => (
                // Note: this is Nextjs Link, not mui
                <Link key={date} href={`/sessions/${date}`}>
                  <ListItem disablePadding>
                    <ListItemButton sx={{ p: 0 }}>
                      <ListItemText
                        primary={date}
                        secondary={`${sets.length} set${sets.length === 1 ? '' : 's'} of ${stringifySetType(setType, exercise?.displayFields?.units)}`}
                      />
                    </ListItemButton>
                  </ListItem>
                </Link>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
