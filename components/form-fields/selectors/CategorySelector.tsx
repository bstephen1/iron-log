import { Dispatch, SetStateAction } from 'react'
import { KeyedMutator } from 'swr'
import { addCategory } from '../../../lib/frontend/restService'
import {
  Category,
  createCategory,
} from '../../../models/AsyncSelectorOption/Category'
import AsyncSelector from './AsyncSelector'

interface Props {
  categories?: Category[]
  category: Category | null
  mutate: KeyedMutator<Category[]>
  handleChange: Dispatch<SetStateAction<Category | null>>
}
export default function CategorySelector({
  categories,
  category,
  mutate,
  ...asyncSelectorProps
}: Props) {
  return (
    <AsyncSelector
      {...asyncSelectorProps}
      options={categories}
      mutateOptions={mutate}
      value={category}
      label="Category"
      placeholder="Select or add new category"
      createOption={createCategory}
      addNewItem={addCategory}
    />
  )
}
