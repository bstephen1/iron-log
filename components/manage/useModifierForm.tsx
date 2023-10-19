import ModifierSelector from 'components/form-fields/selectors/ModifierSelector'
import ManageWelcomeCard from 'components/ManageWelcomeCard'
import ModifierForm from 'components/ModifierForm'
import {
  updateModifierFields,
  useExercises,
  useModifiers,
} from 'lib/frontend/restService'
import Modifier from 'models/AsyncSelectorOption/Modifier'
import { useQueryState } from 'next-usequerystate'

export default function useModifierForm() {
  const [urlModifier, setUrlModifier] = useQueryState('modifier')
  const { modifiers, mutate: mutateModifiers } = useModifiers()
  const { mutate: mutateExercises } = useExercises()

  const modifier =
    modifiers?.find((modifier) => modifier.name === urlModifier) ?? null

  const handleUpdate = async (updates: Partial<Modifier>) => {
    if (!modifier) return

    const newModifier = { ...modifier, ...updates }
    setUrlModifier(newModifier.name, { scroll: false, shallow: true })

    mutateModifiers(
      async () => {
        const updatedModifier = await updateModifierFields(modifier, updates)
        updates.name && mutateExercises()
        return modifiers?.map((modifier) =>
          modifier._id === updatedModifier._id ? updatedModifier : modifier
        )
      },
      {
        optimisticData: updates.name
          ? [...(modifiers ?? []), newModifier]
          : undefined,
      }
    )
  }

  return {
    Selector: (
      <ModifierSelector
        {...{
          modifier,
          handleChange: (modifier) => {
            setUrlModifier(modifier?.name ?? null, {
              scroll: false,
              shallow: true,
            })
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
