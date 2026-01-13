import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import type { ComponentProps } from 'react'
import TransitionIconButton from '../../TransitionIconButton'
import TagSelect from './TagSelect'

interface Props {
  isEmpty?: boolean
  handleDelete?: () => void
  handleAdd?: () => void
  tagSelectProps: ComponentProps<typeof TagSelect>
}
export default function NoteHeader({
  isEmpty,
  handleDelete,
  handleAdd,
  tagSelectProps,
}: Props) {
  const showDelete = !tagSelectProps.readOnly && !!handleDelete
  const showAdd = !tagSelectProps.readOnly && !!handleAdd
  return (
    <Stack direction="row" sx={{ pl: 0.5 }}>
      <TagSelect {...tagSelectProps} />
      <Box flex="1 1 auto" />
      <Stack direction="row">
        {/* div wrappers allow icons to keep a square shape if tags become multiline */}
        {showAdd && (
          <div>
            <TransitionIconButton
              isVisible={!isEmpty}
              onClick={handleAdd}
              tooltip="Confirm"
              size="small"
            >
              <CheckIcon />
            </TransitionIconButton>
          </div>
        )}
        {showDelete && (
          <div>
            <TransitionIconButton
              isVisible={!isEmpty}
              onClick={handleDelete}
              tooltip={handleAdd ? 'Clear' : 'Delete'}
              size="small"
            >
              <ClearIcon />
            </TransitionIconButton>
          </div>
        )}
      </Stack>
    </Stack>
  )
}
