import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import { OutlinedInput } from '@mui/material'
import { useRef, useState } from 'react'
import TransitionIconButton from '../../../components/TransitionIconButton'
import { createNote, type Note } from '../../../models/Note'
import useField from '../useField'
import TagSelect from './TagSelect'

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
  const handleSubmit = (value: string) => {
    handleAdd(createNote(value.trim(), tags))
    onReset()
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
    <OutlinedInput
      {...control()}
      multiline
      size="small"
      fullWidth
      placeholder={placeholder}
      disabled={disabled}
      inputRef={inputRef}
      startAdornment={
        <TagSelect
          handleUpdate={setTags}
          {...{ selectedTags: tags, options, multiple }}
        />
      }
      endAdornment={
        <>
          <TransitionIconButton
            isVisible={!isEmpty}
            onClick={() => submit()}
            tooltip="Confirm"
          >
            <CheckIcon />
          </TransitionIconButton>
          <TransitionIconButton
            isVisible={!isEmpty}
            onClick={onReset}
            tooltip="Clear"
          >
            <ClearIcon />
          </TransitionIconButton>
        </>
      }
      sx={{ my: 1 }}
    />
  )
}
