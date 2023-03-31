import {
  Box,
  CircularProgress,
  InputAdornment,
  TextFieldProps,
} from '@mui/material'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
import * as yup from 'yup'
import { DATE_FORMAT } from '../../../lib/frontend/constants'
import {
  updateBodyweight,
  useBodyweightHistory,
} from '../../../lib/frontend/restService'
import Bodyweight, { WeighInType } from '../../../models/Bodyweight'
import { DEFAULT_DISPLAY_FIELDS } from '../../../models/DisplayFields'
import InputField from '../../form-fields/InputField'
import BodyweightInputToggle from './BodyweightInputToggle'

// todo: when using bw in sets, default this to using the same weight the sets are using

interface Props {
  date: Dayjs
}
export default function BodyweightInput({
  date,
  ...textFieldProps
}: Props & TextFieldProps) {
  const [bodyweightType, setBodyweightType] = useState<WeighInType>('official')
  const { data, mutate } = useBodyweightHistory({
    limit: 1,
    end: date.format(DATE_FORMAT),
    type: bodyweightType,
    sort: 'newestFirst',
  })
  const validationSchema = yup.object({
    // this will be cast to a number on submit
    value: yup.string().required('Must have a value'),
  })
  const loading = data === undefined

  const handleSubmit = async (value: string) => {
    const newBodyweight = new Bodyweight(Number(value), bodyweightType, date)

    // new weigh-ins on the same day and of the same type will overwrite the previous value.
    mutate([newBodyweight], { revalidate: false })
    await updateBodyweight(newBodyweight)
    mutate()
  }

  const getHelperText = () => {
    if (loading) return 'Loading...'
    // check the type to be safe, but there should never be a mismatch in practice
    if (!data.length || data[0].type !== bodyweightType)
      return `No existing ${bodyweightType} weigh-ins found`
    return `Using latest ${bodyweightType} weight from ${data[0].date}`
  }

  return (
    <InputField
      {...textFieldProps}
      type="number"
      label="Bodyweight"
      // disable scroll wheel changing the number
      onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
      initialValue={
        !data?.length || data[0].type !== bodyweightType
          ? ''
          : String(data[0].value)
      }
      handleSubmit={handleSubmit}
      yupValidator={yup.reach(validationSchema, 'value')}
      InputProps={{
        readOnly: loading,
        'aria-label': 'bodyweight input',
        // without the box the loading spinner has an uneven width
        startAdornment: (
          <>
            {loading ? (
              <Box sx={{ width: '20px' }}>
                <CircularProgress color="inherit" size={20} />
              </Box>
            ) : (
              <BodyweightInputToggle
                type={bodyweightType}
                handleTypeChange={setBodyweightType}
              />
            )}
          </>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {DEFAULT_DISPLAY_FIELDS.units.weight}
          </InputAdornment>
        ),
      }}
      defaultHelperText={getHelperText()}
    />
  )
}
