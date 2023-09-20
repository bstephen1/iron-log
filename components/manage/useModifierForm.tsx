import ModifierSelector from 'components/form-fields/selectors/ModifierSelector'
import ManageWelcomeCard from 'components/ManageWelcomeCard'
import ModifierForm from 'components/ModifierForm'
import { updateModifierFields, useModifiers } from 'lib/frontend/restService'
import Modifier from 'models/Modifier'
import { useQueryState } from 'next-usequerystate'
import { useEffect, useState } from 'react'

export default function useModifierForm() {
  const [modifier, setModifier] = useState<Modifier | null>(null)
  const [urlModifier, setUrlModifier] = useQueryState('modifier')
  const { modifiers, mutate: mutateModifiers } = useModifiers()

  useEffect(() => {
    if (!!modifier || !modifiers || !urlModifier) return

    setModifier(
      modifiers.find((modifier) => modifier.name === urlModifier) ?? null
    )
  }, [modifier, modifiers, urlModifier])

  const handleModifierUpdate = async (updates: Partial<Modifier>) => {
    if (!modifier) return

    const newModifier = { ...modifier, ...updates }
    setModifier(newModifier)
    setUrlModifier(newModifier.name, { scroll: false, shallow: true })

    await updateModifierFields(modifier, updates)
    mutateModifiers()
  }

  return {
    Selector: (
      <ModifierSelector
        {...{
          modifier,
          handleChange: (modifier) => {
            setModifier(modifier)
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
      <ModifierForm {...{ modifier, handleUpdate: handleModifierUpdate }} />
    ) : (
      <ManageWelcomeCard />
    ),
  }
}
