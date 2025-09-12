import ClearIcon from '@mui/icons-material/Clear'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useRef } from 'react'
import TransitionIconButton from '../../../components/TransitionIconButton'
import type { Note } from '../../../models/Note'
import useField from '../useField'
import TagSelect from './TagSelect'

interface Props {
  note: Note
  index: number
  handleDelete: (index: number) => void
  handleUpdate: (index: number, value: Note) => void
  placeholder?: string
  options?: string[]
  multiple?: boolean
  readOnly?: boolean
}
export default function NotesListItem(props: Props) {
  const {
    note,
    placeholder = 'Empty note (will be deleted)',
    index,
    handleDelete,
    handleUpdate,
    options = [],
    multiple,
    readOnly,
  } = props

  const inputRef = useRef<HTMLInputElement>(undefined)
  const handleSubmit = (value: string) =>
    handleUpdate(index, { ...note, value })
  const { control, isEmpty, reset } = useField({
    handleSubmit,
    initialValue: note.value,
    // lower debounce causes a lot of strangeness on mobile (words duplicated on save, etc)
    // need to be very sure the user is done typing before trying to autosave
    debounceMilliseconds: 2500,
  })

  const onDelete = (index: number) => {
    // have to reset to ensure the debounce timer is cancelled
    reset()
    handleDelete(index)
  }

  return (
    <OutlinedInput
      {...control()}
      multiline
      size="small"
      fullWidth
      onBlur={(e) => (isEmpty ? onDelete(index) : handleSubmit(e.target.value))}
      placeholder={placeholder}
      autoComplete="off"
      readOnly={readOnly}
      inputRef={inputRef}
      startAdornment={
        <TagSelect
          handleUpdate={(newTags) =>
            handleUpdate(index, { ...note, tags: newTags })
          }
          selectedTags={note.tags}
          {...{ options, multiple, readOnly }}
        />
      }
      endAdornment={
        !readOnly && (
          <TransitionIconButton
            isVisible={!isEmpty}
            onClick={() => onDelete(index)}
            tooltip="Delete"
          >
            <ClearIcon />
          </TransitionIconButton>
        )
      }
      sx={{ my: 1 }}
      slotProps={{
        input: { 'aria-label': `note ${index + 1}` },
      }}
    />
  )
}
