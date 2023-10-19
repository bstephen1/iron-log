import { Stack } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useCategories } from 'lib/frontend/restService'
import Category from 'models/AsyncSelectorOption/Category'
import * as yup from 'yup'
import InputField from './form-fields/InputField'

interface Props {
  category: Category
  handleUpdate: (updates: Partial<Category>) => void
}
export default function CategoryForm({ category, handleUpdate }: Props) {
  const { categoryNames } = useCategories()

  // This method requires using anonymous functions rather than arrow functions (using "function" keyword)
  // because arrow functions preserve the context of "this", but Yup needs the nested "this" from addMethod.
  yup.addMethod(
    yup.string,
    'unique',
    function (message: string, list: string[]) {
      return this.test('unique', message, function (value) {
        return !!value && list.length !== new Set(list.concat(value)).size
      })
    }
  )

  // todo: can we enumerate the Exercise fields instead of hardcoding?
  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Must have a name')
      // todo: ts isn't recognizing that addMethod() added this. Possible solutions: https://github.com/jquense/yup/issues/312
      // @ts-ignore
      .unique('This category already exists!', categoryNames),
    status: yup.string().required('Must have a status'),
  })

  return (
    <Grid container spacing={2} xs={12}>
      <Grid xs={12} sm={6}>
        <Stack>
          {/* todo: would be great to consolidate this somehow. Maybe have a "name" for the inputFields.
            Export the schema and have the hook pull it in?  */}
          <InputField
            label="Name"
            initialValue={category.name}
            required
            handleSubmit={(value) => handleUpdate({ name: value })}
            yupValidator={yup.reach(validationSchema, 'name')}
          />
        </Stack>
      </Grid>
      <Grid xs={12} sm={6}>
        {/* <ComboBoxField
          label="Exercises"
          initialValue={exercise}
          options={exerciseNames}
          fullWidth
          handleSubmit={(value: string[]) => handleUpdate('categories', value)}
        /> */}
      </Grid>
    </Grid>
  )
}
