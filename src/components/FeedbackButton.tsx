import { useState } from 'react'
import { CONTROL_CLASSES } from '../consts'
import { Button } from './ui/button'

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'

import { SpinnerGapIcon } from '@phosphor-icons/react'
import { useMediaQuery } from '@uidotdev/usehooks'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

const Form = () => {
  const [loading, setLoading] = useState(true)
  return (
    <div className="relative h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <SpinnerGapIcon size={20} className="animate-spin" />
        </div>
      )}
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSc-F4BZ_jQn7x_3B3IKnPnIqNAL8kjkm1_pL-_fm1TFX4a47g/viewform?embedded=true"
        className="w-full h-full border-0"
        onLoad={() => setLoading(false)}
      />
    </div>
  )
}

export function FeedbackButton() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <div
      className={`fixed right-0 top-[50%] -translate-y-1/2 -translate-x-2 -rotate-90 origin-right z-901`}
    >
      <div className={CONTROL_CLASSES.control}>
        {isDesktop ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Feedback</Button>
            </DialogTrigger>

            <DialogContent className="h-[80vh] p-0 z-902">
              <DialogTitle className="hidden">Feedback form</DialogTitle>
              <Form />
            </DialogContent>
          </Dialog>
        ) : (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">Feedback</Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="h-full p-0 z-902">
              <Form />
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  )
}
