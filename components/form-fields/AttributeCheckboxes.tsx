import { Checkbox, Divider, FormControlLabel, FormGroup } from '@mui/material'
import { capitalize } from '../../lib/util'
import Attributes from '../../models/Attributes'
import FormDivider from '../forms/FormDivider'

interface Props {
  attributes?: Attributes
  handleSubmit: (attributes: Attributes) => void
}
export default function AttributeCheckboxes({
  attributes = {},
  handleSubmit,
}: Props) {
  // todo: if you click both really fast the checkboxes don't have time to update

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
}
