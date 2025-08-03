import { Bars3Icon } from '@heroicons/react/24/solid'
import { IconButton, Input } from '@material-tailwind/react'
import { useState } from 'react'

const SearchButton = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchValue(value)
    onSearch(value)
  }

  return (
    <>
      <div className="mr-auto md:mr-4 md:w-56">
        <Input
          label="Nhập thông tin..."
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <IconButton variant="text" color="blue-gray" className="grid xl:hidden">
        <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
      </IconButton>
    </>
  )
}

export default SearchButton
