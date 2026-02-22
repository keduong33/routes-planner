import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { RoutePlanner } from '../RoutePlanner/RoutePlanner'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet'

export function MapDrawer() {
  const [open, setOpen] = useState(true)
  return (
    <Sheet defaultOpen modal={false} open={open} onOpenChange={setOpen}>
      {!open && (
        <SheetTrigger asChild>
          <Button
            className="top-2 left-2 absolute z-[800]"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <MagnifyingGlassIcon size={20} />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent
        side="left"
        className={`w-full sm:w-[350px] md:w-[50vw] lg:w-[35vw] z-[800] p-2`}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetTitle>Route planner</SheetTitle>
        <RoutePlanner />
      </SheetContent>
    </Sheet>
  )
}
