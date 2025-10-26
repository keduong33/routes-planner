import { RoutePlanner } from '../RoutePlanner/RoutePlanner'
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet'

type MapDrawerProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function MapDrawer({ open, setOpen }: MapDrawerProps) {
  return (
    <Sheet defaultOpen modal={false} open={true}>
      <SheetContent
        side="left"
        className={`w-full sm:w-[350px] md:w-[50vw] lg:w-[35vw] z-[800] p-2`}
      >
        <SheetTitle>Route planner</SheetTitle>
        <RoutePlanner />
      </SheetContent>
    </Sheet>
  )
}
