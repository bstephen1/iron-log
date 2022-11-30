import {
  Box,
  CircularProgress,
  InputAdornment,
  TextFieldProps,
} from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import * as yup from 'yup'
import { DATE_FORMAT, DEFAULT_UNITS } from '../../lib/frontend/constants'
import {
  updateBodyweight,
  useBodyweightHistory,
} from '../../lib/frontend/restService'
import Bodyweight from '../../models/Bodyweight'
import InputField from '../form-fields/InputField'

interface Props {
  date: Dayjs
}
export default function BodyweightInput({
  date,
  ...textFieldProps
}: Props & TextFieldProps) {
  const { data, mutate } = useBodyweightHistory(1, date.format(DATE_FORMAT))
  const validationSchema = yup.object({
    // this willl be cast to a number on submit
    value: yup.string().required('Must have a value'),
  })
  const loading = data === undefined

  const handleSubmit = (value: string) => {
    const newBodyweight = new Bodyweight(
      Number(value),
      date.format(DATE_FORMAT)
    )
    // const newBodyweight = { ...(new Bodyweight(Number(value), date.format(DATE_FORMAT))) }
    console.log(newBodyweight)
    // use update instead of add so there can only be 1 weigh in per day
    updateBodyweight(newBodyweight)
    mutate([newBodyweight])
  }

  const getHelperText = () => {
    if (loading) return 'Loading...'
    if (!data.length) return 'No existing bodyweight data found'
    return `Using latest weigh-in from ${data[0].date}`
  }

  return (
    <InputField
      {...textFieldProps}
      type="number"
      label="Bodyweight"
      initialValue={data?.length ? '' + data[0].value : ''}
      handleSubmit={handleSubmit}
      yupValidator={yup.reach(validationSchema, 'value')}
      InputProps={{
        readOnly: loading,
        // without the box the loading spinner has an uneven width
        startAdornment: (
          <>
            {loading && (
              <Box sx={{ width: '20px' }}>
                <CircularProgress color="inherit" size={20} />
              </Box>
            )}
          </>
        ),
        endAdornment: (
          <InputAdornment position="end">{DEFAULT_UNITS.weight}</InputAdornment>
        ),
      }}
      defaultHelperText={getHelperText()}
    />
  )
}
