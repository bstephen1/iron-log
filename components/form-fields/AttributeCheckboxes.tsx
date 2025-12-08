import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import { memo } from 'react'
import isEqual from 'react-fast-compare'
import { capitalize } from '../../lib/util/string'
import type { Attributes } from '../../models/Attributes'
import FormDivider from '../forms/FormDivider'

interface Props {
  attributes?: Attributes
  handleUpdate: (updates: { attributes: Attributes }) => void
}
export default memo(function AttributeCheckboxes({
  attributes = {},
  handleUpdate,
}: Props) {
  const AttributeCheckbox = ({ field }: { field: keyof Attributes }) => (
    <FormControlLabel
      control={
        <Checkbox
          checked={attributes[field]}
          onChange={(_, checked) =>
            handleUpdate({ attributes: { ...attributes, [field]: checked } })
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
