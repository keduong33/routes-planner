import { XIcon } from '@phosphor-icons/react'
import { RoutePlanner } from '../RoutePlanner/RoutePlanner'
import { Button } from '../ui/button'

export function MapDrawer({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (v: boolean) => void
}) {
  return (
    <div
      className={`transition-all duration-300 overflow-hidden z-10 ${
        open ? 'w-full md:w-[50vw] lg:w-[500px]' : 'w-0'
      }`}
    >
      <div className="h-full p-2 border-r bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-lg font-bold">Route planner</p>

          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <XIcon size={20} />
          </Button>
        </div>

        {/* Content */}
        <RoutePlanner />
      </div>
    </div>
  )
}
