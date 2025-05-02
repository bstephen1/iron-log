import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { memo } from 'react'
import isEqual from 'react-fast-compare'
import { capitalize } from '../../lib/util'
import { type Attributes } from '../../models/Attributes'
import FormDivider from '../forms/FormDivider'

interface Props {
  attributes?: Attributes
  handleSubmit: (attributes: Attributes) => void
}
export default memo(function AttributeCheckboxes({
  attributes = {},
  handleSubmit,
}: Props) {
  const AttributeCheckbox = ({ field }: { field: keyof Attributes }) => (
    <FormControlLabel
      control={
        <Checkbox
          checked={attributes[field]}
          onChange={(_, checked) =>
            handleSubmit({ ...attributes, [field]: checked })
          }
        />
      }
      label={capitalize(field)}
    />
  )

  return (
    <>
      <FormDivider title="Attributes" />
      <FormGroup row>
        <AttributeCheckbox field="bodyweight" />
        <AttributeCheckbox field="unilateral" />
      </FormGroup>
    </>
  )
}, isEqual)
