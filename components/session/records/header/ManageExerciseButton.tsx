import SettingsIcon from '@mui/icons-material/Settings'
import { useRouter } from 'next/navigation'
import { memo } from 'react'
import TooltipIconButton from '../../../../components/TooltipIconButton'

interface Props {
  _id?: string
}
export default memo(function ManageExerciseButton({ _id }: Props) {
  const router = useRouter()
  //  todo: use nextjs prefetch when record is active: https://nextjs.org/docs/api-reference/next/router#routerprefetch  }

  return (
    <TooltipIconButton
      key="manage"
      title="Manage exercise"
      disabled={!_id}
      onClick={() => router.push(`/manage?exercise=${_id}`)}
    >
      <SettingsIcon />
    </TooltipIconButton>
  )
})
