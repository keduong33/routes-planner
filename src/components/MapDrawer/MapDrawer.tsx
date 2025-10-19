import { Box } from '@radix-ui/themes'
import { Dialog } from 'radix-ui'
import { RoutePlanner } from '../RoutePlanner/RoutePlanner'
import './MapDrawer.css'

type MapDrawerProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const avoidDefaultDomBehavior = (e: Event) => {
  e.preventDefault()
}

export function MapDrawer({ open, setOpen }: MapDrawerProps) {
  return (
    <div className="drawer" data-state={open ? 'open' : 'closed'}>
      <Dialog.Root open={open} onOpenChange={setOpen} modal={false}>
        <Dialog.Content
          onPointerDownOutside={avoidDefaultDomBehavior}
          onInteractOutside={avoidDefaultDomBehavior}
        >
          {/* <Button onClick={() => setOpen(false)}>Close</Button> */}
          <Dialog.Title>Route Planner</Dialog.Title>
          <Box
            width={{
              initial: `${window.innerWidth * 0.5}px`,
              md: `${window.innerWidth * 0.4}px`,
            }}
          >
            {/* <ScrollArea scrollbars="vertical"> */}
            <RoutePlanner />
            {/* </ScrollArea> */}
          </Box>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}
