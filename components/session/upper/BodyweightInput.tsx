import { type Dayjs } from 'dayjs'
import { useState } from 'react'
import { z } from 'zod'
import InputField from '../../../components/form-fields/InputField'
import { DATE_FORMAT } from '../../../lib/frontend/constants'
import {
  updateBodyweight,
  useBodyweights,
} from '../../../lib/frontend/restService'
import { createBodyweight, type WeighInType } from '../../../models/Bodyweight'
import { DEFAULT_DISPLAY_FIELDS } from '../../../models/DisplayFields'
import BodyweightInputToggle from './BodyweightInputToggle'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import { type TextFieldProps } from '@mui/material/TextField'

interface Props {
  day: Dayjs
}
export default function BodyweightInput({
  day,
  ...textFieldProps
}: Props & Omit<TextFieldProps, 'slotProps'>) {
  const [bodyweightType, setBodyweightType] = useState<WeighInType>('official')
  const { data, mutate } = useBodyweights({
    limit: 1,
    end: day.format(DATE_FORMAT),
    type: bodyweightType,
    sort: 'newestFirst',
  })

  // note: the value will be cast to a number on submit
  const schema = z.string().min(1, 'Must have a value')
  const loading = !data

  const handleSubmit = async (value: string) => {
    const newBodyweight = createBodyweight(Number(value), bodyweightType, day)

    // new weigh-ins on the same day and of the same type will overwrite the previous value.
    // updateBodweight returns a single bw, so have to convert it to an array
    mutate(async () => [await updateBodyweight(newBodyweight)], {
      optimisticData: [newBodyweight],
      revalidate: false,
    })
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
      label="Bodyweight"
      initialValue={
        !data?.length || data[0].type !== bodyweightType
          ? ''
          : String(data[0].value)
      }
      handleSubmit={handleSubmit}
      schema={schema}
      // allow user to update bw with same value if latest date isn't the current date
      showSubmit={data?.[0]?.date !== day.format(DATE_FORMAT) || undefined}
      slotProps={{
        htmlInput: {
          inputMode: 'decimal',
          type: 'number',
        },
        input: {
          readOnly: loading,
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
        },
      }}
      defaultHelperText={getHelperText()}
    />
  )
}
