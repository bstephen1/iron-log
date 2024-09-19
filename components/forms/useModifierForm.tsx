import { useQueryState } from 'next-usequerystate'
import {
  updateModifierFields,
  useExercises,
  useModifiers,
} from '../../lib/frontend/restService'
import Modifier from '../../models/AsyncSelectorOption/Modifier'
import ManageWelcomeCard from '../ManageWelcomeCard'
import ModifierSelector from '../form-fields/selectors/ModifierSelector'
import ModifierForm from './ModifierForm'

export default function useModifierForm() {
  const [urlModifier, setUrlModifier] = useQueryState('modifier')
  const { modifiers, mutate: mutateModifiers } = useModifiers()
  const { mutate: mutateExercises } = useExercises()

  const modifier =
    modifiers?.find((modifier) => modifier.name === urlModifier) ?? null

  const handleUpdate = async (updates: Partial<Modifier>) => {
    if (!modifier) return

    const newModifier = { ...modifier, ...updates }

    // setQueryState will rerender the entire page if setting to the same value
    if (updates.name) {
      setUrlModifier(newModifier.name)
    }

    mutateModifiers(
      async () => {
        const updatedModifier = await updateModifierFields(modifier, updates)
        updates.name && mutateExercises()
        return modifiers?.map((modifier) =>
          modifier._id === updatedModifier._id ? updatedModifier : modifier,
        )
      },
      {
        optimisticData: updates.name
          ? [...(modifiers ?? []), newModifier]
          : undefined,
      },
    )
  }

  return {
    Selector: (
      <ModifierSelector
        {...{
          modifier,
          handleChange: (modifier) => {
            setUrlModifier(modifier?.name ?? null)
          },
          modifiers,
          mutate: mutateModifiers,
        }}
      />
    ),
    Form: modifier ? (
      <ModifierForm {...{ modifier, handleUpdate }} />
    ) : (
      <ManageWelcomeCard />
    ),
  }
}
