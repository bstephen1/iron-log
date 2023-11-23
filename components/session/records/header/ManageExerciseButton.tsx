import SettingsIcon from '@mui/icons-material/Settings'
import { useRouter } from 'next/router'
import { memo } from 'react'
import TooltipIconButton from '../../../../components/TooltipIconButton'

interface Props {
  name?: string
}
export default memo(function ManageExerciseButton({ name }: Props) {
  const router = useRouter()
  //  todo: use nextjs prefetch when record is active: https://nextjs.org/docs/api-reference/next/router#routerprefetch  }

  return (
    <TooltipIconButton
      key="manage"
      title="Manage Exercise"
      disabled={!name}
      onClick={() => router.push(`/manage?exercise=${name}`)}
    >
      <SettingsIcon />
    </TooltipIconButton>
  )
})
