import { Divider, Stack, Typography } from '@mui/material'
import Note from '../../../models/Note'
import AddNote from './AddNote'
import NotesListItem from './NotesListItem'
import FormDivider from '../../forms/FormDivider'

interface Props {
  label?: string
  options: string[]
  addItemPlaceholder?: string
  listItemPlaceholder?: string
  initialTags?: string[]
  /** considered readOnly if omitted */
  handleSubmit?: (notes: Note[]) => void
  notes: Note[]
  multiple?: boolean
  readOnly?: boolean
}
export default function NotesList(props: Props) {
  const {
    label,
    notes,
    options,
    addItemPlaceholder = 'Add Note',
    listItemPlaceholder = 'Empty Note (will be deleted)',
    initialTags,
    handleSubmit,
    multiple,
    readOnly,
  } = props

  // we need to save these as functions in the parent component
  // or the list won't be able to properly rerender on change
  const handleAdd = (newNote: Note) => handleSubmit?.([newNote, ...notes])
  const handleDelete = (i: number) => {
    handleSubmit?.(notes.slice(0, i).concat(notes.slice(i + 1)))
  }
  const handleUpdate = (i: number, newNote: Note) => {
    handleSubmit?.(
      notes
        .slice(0, i)
        .concat(newNote)
        .concat(notes.slice(i + 1)),
    )
  }

  return (
    <>
      {label && <FormDivider title={label} />}
      {/* todo: drag n drop? */}
      <Stack spacing={2} sx={{ pt: 1 }}>
        {/* these started out multiline but that was creating weird padding. Revisit if multiline is actually needed */}
        {!readOnly && (
          <AddNote
            placeholder={addItemPlaceholder}
            disabled={props.notes == null}
            {...{ handleAdd, options, multiple, initialTags }}
          />
        )}
        {/* todo: transitionGroup (see https://mui.com/material-ui/transitions/#transitiongroup) */}
        {notes?.map((note, index) => (
          <NotesListItem
            key={index} // apparently eslint doesn't see this if it's in the spread object
            placeholder={listItemPlaceholder}
            {...{
              handleDelete,
              handleUpdate,
              options,
              note,
              index,
              multiple,
              readOnly,
            }}
          />
        ))}
        {readOnly && !notes.length && (
          <Typography>This record has no notes</Typography>
        )}
      </Stack>
    </>
  )
}
