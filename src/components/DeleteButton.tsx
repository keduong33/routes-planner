import { TrashIcon } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

type DeleteButtonProps = {
  onRemove: () => void
}

export function DeleteButton({ onRemove }: DeleteButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" onClick={onRemove} variant="ghost">
          <TrashIcon size={20} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Remove stop</TooltipContent>
    </Tooltip>
  )
}
