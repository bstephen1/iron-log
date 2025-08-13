import {
  fetchCategories,
  fetchExercises,
  fetchModifiers,
} from '../../lib/backend/mongoService'
import ManageFormContainer from './ManageFormContainer'

export default function ManagePage() {
  const exercises = fetchExercises()
  const categories = fetchCategories()
  const modifiers = fetchModifiers()

  return <ManageFormContainer promises={{ exercises, categories, modifiers }} />
}
