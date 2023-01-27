import { Dispatch, SetStateAction } from 'react'
import { KeyedMutator } from 'swr'
import { addCategory } from '../../../lib/frontend/restService'
import Category from '../../../models/Category'
import withAsync from '../withAsync'
import SelectorBase from './SelectorBase'

interface WithCategoryProps {
  categories?: Category[]
  category: Category | null
  mutate: KeyedMutator<Category[]>
  handleChange: Dispatch<SetStateAction<Category | null>>
}
function withCategory(Component: typeof SelectorBase<Category>) {
  return function ({
    categories,
    category,
    mutate,
    ...props
  }: WithCategoryProps) {
    return (
      <Component
        {...props}
        options={categories}
        mutateOptions={mutate}
        value={category}
        label="Category"
        placeholder="Select or Add New Category"
        Constructor={Category}
        addNewItem={addCategory}
      />
    )
  }
}

export const CategorySelector = withCategory(withAsync(SelectorBase<Category>))
