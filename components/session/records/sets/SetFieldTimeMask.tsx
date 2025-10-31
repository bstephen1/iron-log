import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { TIME_FORMAT } from '../../../../lib/frontend/constants'
import type { PartialUpdate } from '../../../../lib/types'
import type { Set } from '../../../../models/Set'
import InputFieldAutosave, {
  type InputFieldAutosaveProps,
} from '../../../form-fields/InputFieldAutosave'

dayjs.extend(duration)

type Props = {
  handleSetChange: PartialUpdate<Set>
  rawInitialValue?: number
} & Partial<InputFieldAutosaveProps>
export default function SetFieldTimeMask({
  rawInitialValue,
  handleSetChange,
  ...inputFieldProps
}: Props) {
  return (
    <InputFieldAutosave
      // because we format using dayjs, we don't have to worry about default value
      // for the mask, or if the string is less than the full length
      // (eg "000" showing up as "00:0")
      initialValue={dayjs
        .duration(rawInitialValue ?? 0, 'seconds')
        .format(TIME_FORMAT)}
      handleSubmit={(maskedValue) => {
        const [hours, minutes, seconds] = maskedValue.split(':')
        const duration = dayjs.duration({
          hours: Number(hours),
          minutes: Number(minutes),
          seconds: Number(seconds),
        })
        handleSetChange({ time: duration.asSeconds() })
      }}
      variant="standard"
      disableAutoSelect
      defaultHelperText=""
      maskOptions={{ mask: '00:00:00', overwrite: true }}
      {...inputFieldProps}
    />
  )
}
