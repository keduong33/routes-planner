import { Box, Text, TextField, Tooltip } from '@radix-ui/themes'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { UUIDTypes } from 'uuid'
import { useSearchAddress } from '../../../api/geo/hooks'
import type { NormalizedLocation } from '../../../api/geo/types'
import './SearchBar.css'

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
    <Box
      width={{ initial: '200px', md: '300px' }}
      position="relative"
      ref={dropdownRef}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (canSubmit) refetch()
        }}
        style={{ width: '100%' }}
      >
        <TextField.Root
          ref={inputRef}
          placeholder={fieldTypeToPlaceholderText.get(fieldType)}
          size="3"
          value={searchedAddress}
          onChange={(e) => handleInputChange(e.currentTarget.value)}
          onFocus={() => {
            if (
              searchedAddress.length > 0 &&
              locations &&
              locations.length > 0
            ) {
              setShowDropdown(true)
            }
          }}
          disabled={isLoading}
        />

        {/* Dropdown suggestion list */}
        {showDropdown &&
          locations &&
          locations.length > 0 &&
          !selectedLocation && (
            <Box
              position="absolute"
              style={{
                top: 'calc(100% + 4px)',
                left: 0,
                right: 0,
                backgroundColor: 'var(--color-panel-solid)',
                border: '1px solid var(--gray-a6)',
                borderRadius: 'var(--radius-3)',
                boxShadow: 'var(--shadow-5)',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 1000,
              }}
            >
              {locations.slice(0, 5).map((location, index) => (
                <Tooltip content={location.displayName}>
                  <Box
                    key={`${location.name}-${index}`}
                    p="3"
                    className="location"
                    onClick={() => onLocationClick(location)}
                    style={{
                      cursor: 'pointer',
                      borderBottom:
                        index < Math.min(locations.length, 5) - 1
                          ? '1px solid var(--gray-a3)'
                          : 'none',
                    }}
                  >
                    <Text as="p" size="2" truncate>
                      {location.displayName}
                    </Text>
                  </Box>
                </Tooltip>
              ))}
            </Box>
          )}
      </form>
    </Box>
  )
}
