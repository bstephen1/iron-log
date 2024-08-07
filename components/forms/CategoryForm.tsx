import Grid from '@mui/material/Unstable_Grid2'
import { useQueryState } from 'next-usequerystate'
import * as yup from 'yup'
import {
  deleteCategory,
  useCategories,
  useExercises,
} from '../../lib/frontend/restService'
import { getUsage } from '../../lib/util'
import Category from '../../models/AsyncSelectorOption/Category'
import InputField from '../form-fields/InputField'
import StatusSelect from '../form-fields/StatusSelect'
import UsageComboBox from '../form-fields/UsageComboBox'
import ActionItems from '../form-fields/actions/ActionItems'

interface Props {
  category: Category
  handleUpdate: (updates: Partial<Category>) => Promise<void>
}
export default function CategoryForm({
  category: { name, status },
  handleUpdate,
}: Props) {
  const {
    categoryNames,
    categories,
    mutate: mutateCategories,
  } = useCategories()
  const { exercises } = useExercises()
  const usage = getUsage(exercises, 'categories', name)
  const [_, setUrlCategory] = useQueryState('category')

  const handleDelete = async () => {
    await deleteCategory(name)
    setUrlCategory(null, {
      scroll: true,
      shallow: true,
    })
    mutateCategories(categories?.filter((category) => category.name !== name))
  }

  // This method requires using anonymous functions rather than arrow functions (using "function" keyword)
  // because arrow functions preserve the context of "this", but Yup needs the nested "this" from addMethod.
  yup.addMethod(
    yup.string,
    'unique',
    function (message: string, list: string[]) {
      return this.test('unique', message, function (value) {
        return !!value && list.length !== new Set(list.concat(value)).size
      })
    },
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
    <Grid container spacing={1} xs={12}>
      <Grid xs={12} sm={6}>
        <InputField
          label="Name"
          initialValue={name}
          required
          handleSubmit={(value) => handleUpdate({ name: value })}
          yupValidator={yup.reach(validationSchema, 'name')}
          fullWidth
        />
      </Grid>
      <Grid xs={12} sm={6}>
        <StatusSelect
          initialValue={status}
          handleSubmit={(status) => handleUpdate({ status })}
        />
      </Grid>
      <Grid xs={12}>
        <UsageComboBox field="categories" name={name} usage={usage} />
      </Grid>
      <Grid xs={12}>
        <ActionItems
          name={name}
          type="category"
          handleDelete={handleDelete}
          deleteDisabled={!!usage.length}
        />
      </Grid>
    </Grid>
  )
}
