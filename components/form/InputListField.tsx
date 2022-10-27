import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import {
  capitalize,
  Divider,
  Grow,
  IconButton,
  InputBase,
  Paper,
  Stack,
} from '@mui/material'
import {
  ControllerRenderProps,
  useController,
  UseControllerReturn,
  useFieldArray,
  useFormContext,
  UseFormRegisterReturn,
} from 'react-hook-form'

interface Props {
  label?: string
  name: string
  placeholder?: string
}
export default function InputListField(props: Props) {
  const { label = capitalize(props.name), name } = props
  const {
    formState: { errors },
  } = useFormContext()
  // const error = errors[name]?.message as string
  const { fields } = useFieldArray({ name })

  // function handleDeleteCue(i: number) {
  //   const newCues = cues.slice(0, i).concat(cues.slice(i + 1))
  //   helpers.setValue(newCues)
  // }

  // function handleUpdateCue(newCue: string, i: number) {
  //   if (newCue === cues[i]) return // don't update to the same thing!
  //   if (!newCue) return handleDeleteCue(i) // delete empty cues // todo: maybe a toast "deleted empty cue"

  //   const newCues = cues
  //     .slice(0, i)
  //     .concat(newCue)
  //     .concat(cues.slice(i + 1))
  //   helpers.setValue(newCues)
  // }

  // function handleAddCue(newCue: string) {
  //   if (!newCue) return

  //   helpers.setValue([newCue, ...cues])
  // }

  return (
    <>
      {/* todo: center text? outline? divider style in the middle? */}
      <Divider textAlign="center">{label}</Divider>
      {/* todo: drag n drop? */}
      <Stack spacing={2}>
        {/* <InputAdd
          name={name}

          placeholder={`Add ${label}`}
        /> */}
        {fields.map((field, i) => (
          <InputListItem name={name} key={field.id} index={i} />
        ))}
      </Stack>
    </>
  )
}

// function InputAdd({ name }: { name: string }) {

//   return (
//     <CueInputBase
//       name={name}
//       value={''}
//       handleClear={() => { }}
//       handleConfirm={(value: string) => handleAdd(value)}
//       placeholder="Add Cue"
//     />
//   )
// }

interface ListItemProps {
  name: string
  index: number
  placeholder?: string
  value: string
  handleDelete: (index: number) => void
  handleUpdate: (newCue: string, index: number) => void
}
function InputListItem(props: ListItemProps) {
  const { placeholder, index, name } = props
  // const { fields, remove, update } = useFieldArray({ name })
  const controller = useController({ name: `${name}.${index}` })

  return (
    <InputBaseStyle
      controller={controller}
      handleClear={() => remove(index)}
      handleConfirm={(value: string) => update(value, index)}
      placeholder="Edit Cue"
      // register={register(`${name}.${index}.value`)}
    />
  )
}

interface BaseProps {
  controller: UseControllerReturn
  name: string
  index: number
  handleClear: any
  handleConfirm: any
  placeholder?: string
  register?: UseFormRegisterReturn<any>
}
function InputBaseStyle(props: BaseProps) {
  const {
    placeholder,
    controller: {
      field,
      fieldState: { isDirty },
    },
    handleClear,
    handleConfirm,
    index,
    name,
    register,
  } = props
  const { value, onBlur } = field

  return (
    <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
      <InputBase
        {...field}
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        // autoFocus={!value}
        // disabled={!cleanExercise}
        multiline // allow it to be multiline if it gets that long, but don't allow manual newlines
        // onBlur={() => handleConfirm(value)}
        // onKeyDown={(e) =>
        //   e.key === 'Enter' && (document.activeElement as HTMLElement).blur()
        // }
        // onChange={(e) => setValue(e.target.value)}
        // inputProps={{ 'aria-label': 'edit cue', ...register }}
        endAdornment={
          <>
            <Grow in={!!value && isDirty}>
              <IconButton
                type="button"
                sx={{ p: '10px' }}
                disabled={!value}
                aria-label="add cue"
                onClick={onBlur} // ??
              >
                <CheckIcon />
              </IconButton>
            </Grow>
            <Grow in={!!value}>
              <IconButton
                type="button"
                sx={{ p: '10px' }}
                aria-label="clear input"
                onClick={() => {
                  // setValue('')
                  // handleClear()
                }}
              >
                <ClearIcon />
              </IconButton>
            </Grow>
          </>
        }
      />
    </Paper>
  )
}
