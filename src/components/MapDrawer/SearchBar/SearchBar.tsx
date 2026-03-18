import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAutocomplete } from '../../../api/geo/hooks'
import type { NormalizedLocation } from '../../../api/geo/types'
import { Input } from '../../ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip'

export type FieldType = 'starting' | 'stop' | 'destination'

export type SearchBarProps = {
  initialLocation: NormalizedLocation | null
  fieldType: FieldType
  handleLocationSelect: (
    location: NormalizedLocation,
    stopIndex?: number,
  ) => void
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
    isLoading,
    error,
  } = useAutocomplete(searchedAddress, 0.5)

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
      handleLocationSelect(location, stopIndex)
    },
    [handleLocationSelect, stopIndex],
  )

  const handleInputChange = (value: string) => {
    setSearchedAddress(value)
    setShowDropdown(value.length > 0)
    if (value !== selectedLocation?.displayName) {
      setSelectedLocation(null)
    }
  }

  const handleFocus = () => {
    if (searchedAddress.length > 0) {
      setShowDropdown(true)
    }
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
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
          }
          break
        case 'Escape':
          setShowDropdown(false)
          setSelectedIndex(-1)
          break
      }
    },
    [selectedIndex, locations, onLocationClick],
  )

  useEffect(() => {
    setSelectedIndex(-1)
  }, [searchedAddress])

  useEffect(() => {
    if (error) {
      console.error('Autocomplete error:', error)
    }
  }, [error])

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <Input
        placeholder={fieldTypeToPlaceholderText.get(fieldType)}
        value={searchedAddress}
        onChange={(e) => handleInputChange(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        type="search"
      />

      {isLoading && showDropdown && (
        <DropDown>
          <div className="px-4 py-3">
            <p className="text-sm text-gray-900">Loading...</p>
          </div>
        </DropDown>
      )}

      {/* Only render suggestions if locations exist and dropdown is visible */}
      {locations && locations.length > 0 && showDropdown && (
        <DropDown>
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
                    <p className="truncate text-sm text-gray-900">
                      {location.displayName}
                    </p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>{location.displayName}</TooltipContent>
            </Tooltip>
          ))}
        </DropDown>
      )}
    </div>
  )
}

function DropDown({ children }: { children: ReactNode }) {
  return (
    <div className="z-[900] absolute left-0 top-full w-full flex flex-col mt-1 bg-background border border-border shadow-lg rounded-lg overflow-hidden">
      {children}
    </div>
  )
}
