import { CONTROL_CLASSES } from '../consts'
import { Button } from './ui/button'

import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

import { useMediaQuery } from '@uidotdev/usehooks'

const Form = () => {
  return (
    <iframe
      src="https://docs.google.com/forms/d/e/1FAIpQLSc-F4BZ_jQn7x_3B3IKnPnIqNAL8kjkm1_pL-_fm1TFX4a47g/viewform?embedded=true"
      className="w-full h-full border-0"
    >
      Loading…
    </iframe>
  )
}

export function FeedbackButton() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <div className={`absolute top-1 right-1`}>
      <div className={CONTROL_CLASSES.control}>
        {isDesktop ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link">Feedback</Button>
            </DialogTrigger>

            <DialogContent className="h-[80vh] p-0 z-[99999]">
              <Form />
            </DialogContent>
          </Dialog>
        ) : (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="link">Feedback</Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="h-full p-0 z-[99999]">
              <Form />
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  )
}
