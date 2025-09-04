'use client'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import useLocalStorageState from 'use-local-storage-state'
import { LOCAL_STORAGE } from '../lib/frontend/constants'

export default function SavingIndicatorSwitch() {
  const [showSaving, setShowSaving] = useLocalStorageState(
    LOCAL_STORAGE.showSaving,
    {
      defaultValue: !!process.env.NEXT_PUBLIC_SHOW_SAVING,
    }
  )
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={showSaving}
            onChange={() => setShowSaving(!showSaving)}
          />
        }
        label="Show saving indicator"
      />
      <Typography variant="body2">
        Shows a saving indicator on the screen when data is being saved to the
        database
      </Typography>
    </FormGroup>
  )
}
