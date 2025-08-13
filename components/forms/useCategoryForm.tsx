import { useQueryState } from 'nuqs'
import { useCategories } from '../../lib/frontend/restService'
import ManageWelcomeCard from '../ManageWelcomeCard'
import CategorySelector from '../form-fields/selectors/CategorySelector'
import CategoryForm from './CategoryForm'

export default function useCategoryForm() {
  const [urlCategory, setUrlCategory] = useQueryState('category')
  const { categories, mutate: mutateCategories } = useCategories()

  const category =
    categories?.find((category) => category.name === urlCategory) ?? null

  return {
    Selector: (
      <CategorySelector
        {...{
          category,
          handleChange: (category) => {
            setUrlCategory(category?.name ?? null)
          },
          categories,
          mutate: mutateCategories,
        }}
      />
    ),
    Form: category ? <CategoryForm {...{ category }} /> : <ManageWelcomeCard />,
  }
}
