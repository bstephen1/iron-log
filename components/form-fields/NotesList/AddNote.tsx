import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import Card from '@mui/material/Card'
import Input from '@mui/material/Input'
import { useColorScheme } from '@mui/material/styles'
import { useRef, useState } from 'react'
import { createNote, type Note } from '../../../models/Note'
import useField from '../useField'
import NoteHeader from './NoteHeader'

interface Props {
  placeholder?: string
  handleAdd: (value: Note) => void
  disabled?: boolean
  options?: string[]
  multiple?: boolean
  initialTags?: string[]
}
// This Input is a temporary value that isn't include in the list until/unless it is submitted.
export default function AddNote({
  placeholder = 'Add note',
  handleAdd,
  disabled,
  options = [],
  multiple,
  initialTags = [],
}: Props) {
  const inputRef = useRef<HTMLInputElement>(undefined)
  const [tags, setTags] = useState<Note['tags']>(initialTags)
  const { mode } = useColorScheme()
  const handleSubmit = (value: string) => {
    handleAdd(createNote(value.trim(), tags))
    onReset()
    setTags(initialTags)
  }
  const onReset = () => {
    // we only reset the input; tags are left as-is
    reset('')
    inputRef.current?.focus()
  }

  const { control, isEmpty, reset, submit } = useField({
    handleSubmit,
    initialValue: '',
    autoSubmit: false,
  })

  return (
    <Card
      variant={mode === 'dark' ? 'elevation' : 'outlined'}
      sx={{ mt: 1, p: 1 }}
    >
      <NoteHeader
        tagSelectProps={{
          handleUpdate: setTags,
          selectedTags: tags,
          options,
          multiple,
        }}
        actions={[
          {
            label: 'Confirm',
            Icon: <CheckIcon />,
            // have to explicitly submit with no arg
            onClick: () => submit(),
            isHidden: isEmpty,
          },
          {
            label: 'Clear',
            Icon: <ClearIcon />,
            onClick: () => {
              onReset()
              setTags(initialTags)
            },
            isHidden: isEmpty && !tags.length,
          },
        ]}
      />
      <Input
        {...control()}
        multiline
        size="small"
        fullWidth
        disableUnderline
        placeholder={placeholder}
        disabled={disabled}
        inputRef={inputRef}
        sx={{ px: 1 }}
      />
    </Card>
  )
}
