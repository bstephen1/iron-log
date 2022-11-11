import { Dispatch, SetStateAction } from 'react'
import { KeyedMutator } from 'swr'
import { addCategory } from '../../../lib/frontend/restService'
import Category from '../../../models/Category'
import { NamedStub } from '../../../models/NamedObject'
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
    class NewCategoryStub implements NamedStub {
      constructor(public name: string, public status = 'Add New') {}
    }

    return (
      <Component
        {...props}
        options={categories}
        mutateOptions={mutate}
        value={category}
        label="Category"
        // todo: this is pretty slapdash
        groupBy={(option: Category | NewCategoryStub) =>
          (option as NewCategoryStub).status
            ? (option as NewCategoryStub).status
            : 'Category'
        }
        placeholder="Select or Add a Category"
        StubConstructor={NewCategoryStub}
        Constructor={Category}
        addNewItem={addCategory}
      />
    )
  }
}

export const CategorySelector = withCategory(withAsync(SelectorBase<Category>))
