import { addCategory } from '../../../lib/backend/mongoService'
import { QUERY_KEYS } from '../../../lib/frontend/constants'
import { useAddMutation } from '../../../lib/frontend/data/useMutation'
import { useCategories } from '../../../lib/frontend/data/useQuery'
import {
  type Category,
  createCategory,
} from '../../../models/AsyncSelectorOption/Category'
import AsyncSelector from './AsyncSelector'

interface Props {
  category: Category | null
  handleChange: (category: Category | null) => void
  disableAddNew?: boolean
}
export default function CategorySelector({ category, handleChange }: Props) {
  const categories = useCategories()
  const mutate = useAddMutation({
    queryKey: [QUERY_KEYS.categories],
    addFn: addCategory,
  })

  return (
    <AsyncSelector
      handleChange={handleChange}
      options={categories}
      addItemMutate={mutate}
      value={category}
      label="Category"
      placeholder="Select or add new category"
      createOption={createCategory}
    />
  )
}
