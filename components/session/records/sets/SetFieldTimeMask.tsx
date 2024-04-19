import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { forwardRef } from 'react'
import { IMaskInput } from 'react-imask'
import { UpdateFields } from '../../../../lib/util'
import { Set } from '../../../../models/Set'
import InputFieldAutosave, {
  InputFieldAutosaveProps,
} from '../../../form-fields/InputFieldAutosave'

dayjs.extend(duration)

const convertSecToTime = (sec: number) => {}

const TIME_FORMAT = 'HH:mm:ss'

type Props = {
  handleSetChange: UpdateFields<Set>
  rawInitialValue?: number
} & Partial<InputFieldAutosaveProps>
export default function SetFieldTimeMask({
  rawInitialValue,
  handleSetChange,
  ...inputFieldProps
}: Props) {
  console.log(rawInitialValue)

  const initialDuration = dayjs.duration(rawInitialValue ?? 0, 'seconds')
  console.log(initialDuration.format(TIME_FORMAT))

  // have to go from mask to duration...
  console.log(dayjs.duration('12:10:10').format(TIME_FORMAT))
  return (
    <InputFieldAutosave
      initialValue={dayjs
        .duration(rawInitialValue ?? 0, 'seconds')
        .format(TIME_FORMAT)}
      // handleSubmit={(maskedTime) => handleSetChange({ time:  })}
      variant="standard"
      disableAutoSelect
      defaultHelperText=""
      {...inputFieldProps}
      InputProps={{
        inputComponent: CustomMask as any,
        // inputProps: {
        //   test: 'hi',
        // },
        ...inputFieldProps.InputProps,
      }}
    />
  )
}

interface CustomMaskProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
  test: string
}
const CustomMask = forwardRef<HTMLInputElement, CustomMaskProps>(
  function CustomMask(props, ref) {
    const { onChange, test, ...other } = props
    console.log(test)
    return (
      <IMaskInput
        {...other}
        mask="00:00:00"
        inputRef={ref}
        placeholderChar="0"
        onAccept={(value: string) => {
          // console.log('accept', value.replaceAll('_', '0'))
          return onChange({
            target: { name: props.name, value },
          })
        }}
        overwrite
        lazy={false}
      />
    )
  },
)
