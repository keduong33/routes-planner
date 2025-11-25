import { useCallback, useEffect, useRef, useState } from 'react'
import type { UUIDTypes } from 'uuid'
import { useSearchAddress } from '../../../api/geo/hooks'
import type { NormalizedLocation } from '../../../api/geo/types'
import { Input } from '../../ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip'

export type FieldType = 'starting' | 'stop' | 'destination'

export type SearchBarProps = {
  initialLocation: NormalizedLocation | null
  fieldType: FieldType
  handleLocationSelect: (
    routeOptionId: UUIDTypes,
    fieldType: FieldType,
    location: NormalizedLocation,
    stopIndex?: number,
  ) => void
  activeRouteId: UUIDTypes
  stopIndex?: number
}

const fieldTypeToPlaceholderText = new Map<FieldType, string>([
  ['starting', 'Starting from'],
  ['stop', 'Add stop'],
  ['destination', 'Arriving at'],
])

export function SearchBar({
  initialLocation,
  fieldType,
  activeRouteId,
  handleLocationSelect,
  stopIndex,
}: SearchBarProps) {
  const [searchedAddress, setSearchedAddress] = useState<string>(
    initialLocation ? initialLocation.displayName : '',
  )
  const [selectedLocation, setSelectedLocation] =
    useState<NormalizedLocation | null>(initialLocation)

  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const {
    data: locations,
    refetch,
    isLoading,
  } = useSearchAddress(searchedAddress)

  const canSubmit = searchedAddress.length > 0

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const onLocationClick = useCallback(
    (location: NormalizedLocation) => {
      setSearchedAddress(location.displayName)
      setSelectedLocation(location)
      setShowDropdown(false)
      handleLocationSelect(activeRouteId, fieldType, location, stopIndex)
    },
    [activeRouteId, fieldType, stopIndex, handleLocationSelect],
  )

  const handleInputChange = (value: string) => {
    setSearchedAddress(value)
    setShowDropdown(value.length > 0)
    if (value !== selectedLocation?.displayName) {
      setSelectedLocation(null)
    }
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Handle Enter when no location is selected
      if (selectedIndex === -1 && canSubmit && e.key === 'Enter') {
        refetch()
        return
      }

      const maxIndex =
        locations && locations.length > 0
          ? Math.min(locations.length, 5) - 1
          : -1

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          if (locations && locations.length > 0) {
            setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : 0))
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          if (locations && locations.length > 0) {
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex))
          }
          break
        case 'Enter':
          e.preventDefault()
          if (
            locations &&
            selectedIndex >= 0 &&
            selectedIndex < locations.length
          ) {
            const location = locations[selectedIndex]
            onLocationClick(location)
            setSelectedIndex(-1)
          } else if (canSubmit) {
            refetch()
          }
          break
        case 'Escape':
          setShowDropdown(false)
          setSelectedIndex(-1)
          break
      }
    },
    [selectedIndex, canSubmit, locations, refetch, onLocationClick],
  )

  useEffect(() => {
    setSelectedIndex(-1)
  }, [searchedAddress])

  return (
    <div className="w-[200px] md:w-[300px] relative">
      <Input
        placeholder={fieldTypeToPlaceholderText.get(fieldType)}
        value={searchedAddress}
        onChange={(e) => handleInputChange(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
      />

      {/* Only render suggestions if locations exist */}
      {locations && locations.length > 0 && (
        <div className="z-[900] absolute left-0 top-full w-full flex flex-col mt-1 bg-background border border-border shadow-lg rounded-lg overflow-hidden">
          {locations.slice(0, 5).map((location, i) => (
            <Tooltip key={location.id}>
              <TooltipTrigger asChild>
                <div
                  key={`${location.name}-${i}`}
                  className={`px-4 py-3 cursor-pointer hover:bg-accent ${i == selectedIndex ? 'bg-accent' : undefined} transition-colors flex items-center gap-3`}
                  onClick={() => {
                    onLocationClick(location)
                    setSelectedLocation(location)
                    setShowDropdown(false)
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm text-gray-900">
                      {location.displayName}
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>{location.displayName}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  )
}
