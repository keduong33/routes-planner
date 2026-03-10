import { DotsSixVerticalIcon } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

type DragButtonProps = {
  handleRef: (element: Element | null) => void
}

export function DragButton({ handleRef }: DragButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={handleRef}
          size="icon"
          variant="ghost"
          className="cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
        >
          <DotsSixVerticalIcon size={20} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Drag to reorder</TooltipContent>
    </Tooltip>
  )
}
