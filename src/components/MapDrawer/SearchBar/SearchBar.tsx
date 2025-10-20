import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { UUIDTypes } from 'uuid'
import { useSearchAddress } from '../../../api/geo/hooks'
import type { NormalizedLocation } from '../../../api/geo/types'

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
  const inputRef = useRef<HTMLInputElement>(null)

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

  return (
    <Command
      shouldFilter={false}
      className="rounded-lg border shadow-md w-[200px] md:w-[300px] relative"
    >
      <CommandInput
        placeholder={fieldTypeToPlaceholderText.get(fieldType)}
        value={searchedAddress}
        onValueChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (canSubmit) refetch()
          }
        }}
      />

      {/* Only render suggestions if locations exist */}
      {locations && locations.length > 0 && (
        <CommandList className="z-[900]">
          {/* <CommandEmpty>
                {isLoading ? 'Loading...' : 'No results found.'}
              </CommandEmpty> */}
          {locations.slice(0, 5).map((location, i) => (
            <CommandItem
              key={`${location.name}-${i}`}
              onSelect={() => {
                onLocationClick(location)
                setSelectedLocation(location)
                setShowDropdown(false)
              }}
              value={location.displayName}
            >
              {location.displayName}
            </CommandItem>
          ))}
        </CommandList>
      )}
    </Command>
  )
}
