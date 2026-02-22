import { CalculatorIcon, MapPinPlusIcon, PathIcon } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

type RouteUtilitiesProps = {
  addStop: () => void
  handleCalculateRoute: () => void
  handleCalculateOptimizedRoute: () => void
}

export function RouteUtilities({
  addStop,
  handleCalculateRoute,
  handleCalculateOptimizedRoute,
}: RouteUtilitiesProps) {
  return (
    <div className="grid grid-cols-3">
      <div className="flex flex-col items-center">
        <Button variant="default" size="icon" onClick={addStop}>
          <MapPinPlusIcon size={20} />
        </Button>
        <p>Add new stop</p>
      </div>
      <div className="flex flex-col items-center">
        <Button variant="default" size="icon" onClick={handleCalculateRoute}>
          <CalculatorIcon size={20} />
        </Button>
        <p>Calculate route</p>
      </div>
      <div className="flex flex-col items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="icon"
              onClick={handleCalculateOptimizedRoute}
            >
              <PathIcon size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Find the shortest route (optimize order)
          </TooltipContent>
        </Tooltip>
        <p>Best route</p>
      </div>
    </div>
  )
}
