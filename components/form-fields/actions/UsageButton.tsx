import ListIcon from '@mui/icons-material/List'

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
import Link from 'next/link'
import { useState } from 'react'
import { useRecords } from '../../../lib/frontend/data/useQuery'
import { stringifySetType } from '../../../models/Set'
import LoadingSpinner from '../../loading/LoadingSpinner'
import TooltipIconButton from '../../TooltipIconButton'

export const usageLimit = 11

interface Props {
  exercise?: string
  buttonProps?: ButtonProps
  type: 'text' | 'icon'
}
export default function UsageButton({ exercise, type, buttonProps }: Props) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const { data: records, isLoading } = useRecords(
    {
      exercise,
      limit: usageLimit,
    },
    !!exercise && (open || type === 'text')
  )

  return (
    <>
      {type === 'text' ? (
        <Button
          onClick={handleOpen}
          startIcon={
            <Badge
              badgeContent={records?.length}
              max={usageLimit}
              color="primary"
              aria-label={`used in ${records?.length ?? 0} record${records?.length !== 1 ? 's' : ''}`}
            >
              <ListIcon />
            </Badge>
          }
          disabled={!records?.length}
          loading={isLoading}
          loadingPosition="start"
          {...buttonProps}
        >
          Usage
        </Button>
      ) : (
        <TooltipIconButton
          title="Recent usage"
          onClick={handleOpen}
          disabled={!exercise}
        >
          <ListIcon />
        </TooltipIconButton>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Usage for {exercise}</DialogTitle>
        <DialogContent sx={{ py: 0 }}>
          {!records ? (
            <LoadingSpinner />
          ) : (
            <List disablePadding>
              {records
                .slice(0, usageLimit)
                .map(({ date, setType, sets, exercise, _id }) => (
                  // Note: this is Nextjs Link, not mui
                  <Link key={_id} href={`/sessions/${date}?record=${_id}`}>
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
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
