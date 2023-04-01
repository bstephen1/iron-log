import ClearIcon from '@mui/icons-material/Clear'
import { OutlinedInput } from '@mui/material'
import TransitionIconButton from 'components/TransitionIconButton'
import Note from 'models/Note'
import { useRef } from 'react'
import useField from '../useField'
import TagSelect from './TagSelect'

interface Props {
  note: Note
  index: number
  handleDelete: (index: number) => void
  handleUpdate: (index: number, value: Note) => void
  placeholder?: string
  options: string[]
  multiple?: boolean
  readOnly?: boolean
}
export default function NotesListItem(props: Props) {
  const {
    note,
    placeholder = '',
    index,
    handleDelete,
    handleUpdate,
    options,
    multiple,
    readOnly,
  } = props

  const inputRef = useRef<HTMLInputElement>()
  const handleSubmit = (value: string) =>
    handleUpdate(index, { ...note, value: value.trim() })
  const { control, isEmpty } = useField({
    handleSubmit,
    initialValue: note.value,
  })

  return (
    <OutlinedInput
      {...control()}
      multiline
      size="small"
      onBlur={() => isEmpty && handleDelete(index)}
      placeholder={placeholder}
      autoComplete="off"
      readOnly={readOnly}
      // removing this for multiline notes
      // onKeyDown={(e) => e.code === 'Enter' && inputRef.current?.blur()}
      inputRef={inputRef}
      inputProps={{
        'aria-label': 'edit',
      }}
      startAdornment={
        <TagSelect
          handleUpdate={(newTags) =>
            handleUpdate(index, { ...note, tags: newTags })
          }
          tags={note.tags}
          {...{ options, multiple, readOnly }}
        />
      }
      endAdornment={
        <>
          {!readOnly && (
            <TransitionIconButton
              isVisible={!isEmpty}
              onClick={() => handleDelete(index)}
              aria-label="delete item"
            >
              {/* todo: should this be a different icon so clear button => clear, not delete? */}
              {/* NotInterestedIcon ? */}
              <ClearIcon />
            </TransitionIconButton>
          )}
        </>
      }
    />
  )
}
