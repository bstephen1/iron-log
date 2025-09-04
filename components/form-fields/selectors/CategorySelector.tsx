import { type Dispatch, type SetStateAction } from 'react'
import { addCategory } from '../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../lib/frontend/constants'
import {
  useAddMutation,
  useCategories,
} from '../../../lib/frontend/restService'
import {
  type Category,
  createCategory,
} from '../../../models/AsyncSelectorOption/Category'
import AsyncSelector from './AsyncSelector'

interface Props {
  category: Category | null
  handleChange: Dispatch<SetStateAction<Category | null>>
  disableAddNew?: boolean
}
export default function CategorySelector({
  category,
  disableAddNew,
  handleChange,
}: Props) {
  const categories = useCategories()
  const mutate = useAddMutation({
    queryKey: [QUERY_KEYS.categories],
    addFn: addCategory,
  })

  return (
    <AsyncSelector
      handleChange={handleChange}
      options={categories.data}
      addItemMutate={disableAddNew ? undefined : mutate}
      value={category}
      label="Category"
      placeholder="Select or add new category"
      createOption={createCategory}
    />
  )
}
