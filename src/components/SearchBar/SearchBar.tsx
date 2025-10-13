import { HamburgerMenuIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Container, TextField } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { useState } from 'react'
import { CONTROL_CLASSES, POSITION_CLASSES } from '../../consts'
import './SearchBar.css'

type SearchBarProps = {
  setDrawerOpen: (open: boolean) => void
}

export function SearchBar({ setDrawerOpen }: SearchBarProps) {
  const [searchedAddress, setSearchedAddress] = useState<string>('')
  const debouncedSearchedAddress = useDebounce(searchedAddress.trim(), 500)
  const query = useQuery({
    queryKey: ['searchedAddress', debouncedSearchedAddress],
    queryFn: () => {
      console.log('query', debouncedSearchedAddress)
      fetch('https://pokeapi.co/api/v2/pokemon/ditto')
      return 'queried ' + debouncedSearchedAddress
    },
    enabled: !!debouncedSearchedAddress,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })

  return (
    <Container
      className={`${POSITION_CLASSES.topleft} searchBar`}
      width={{ initial: '200px', sm: '40vw', md: '450px' }}
    >
      <TextField.Root
        placeholder="Find a place"
        className={CONTROL_CLASSES.control}
        size="3"
        style={{ width: '100%' }}
        value={searchedAddress}
        onChange={(e) => setSearchedAddress(e.currentTarget.value)}
      >
        <TextField.Slot>
          <HamburgerMenuIcon
            height="20"
            width="20"
            onClick={() => setDrawerOpen(true)}
            style={{ cursor: 'pointer' }}
          />
        </TextField.Slot>
        <TextField.Slot>
          <MagnifyingGlassIcon height="20" width="20" />
        </TextField.Slot>
      </TextField.Root>
    </Container>
  )
}
