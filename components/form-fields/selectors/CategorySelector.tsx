// @ts-nocheck
// todo: typing
import { addCategory } from '../../../lib/frontend/restService'
import Category from '../../../models/Category'
import withAsync from '../withAsync'
import SelectorBase from './SelectorBase'

const withCategory = (Component) => (props) => {
  // temporarily store the current input in a stub and only create a true Category if the stub is selected
  class NewCategoryStub {
    constructor(public name: string) {}
  }

  return (
    <Component
      {...props}
      options={props.categories}
      label="Category"
      placeholder="Select or Add a Category"
      NewItemStub={NewCategoryStub}
      ItemConstructor={Category}
      addNewItem={addCategory}
    />
  )
}

export const CategorySelector = withCategory(withAsync(SelectorBase<Category>))
