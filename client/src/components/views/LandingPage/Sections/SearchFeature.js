import React, { useState } from 'react'
import { Input } from 'antd'

const { Search } = Input

function SearchFeature({ refreshFunction }) {
  const [SearchTerm, setSearchTerm] = useState('')
  const searchHandler = (event) => {
    setSearchTerm(event.currentTarget.value)
    refreshFunction(event.currentTarget.value)
  }

  return (
    <div>
      <Search
        placeholder="Input search text"
        onChange={searchHandler}
        style={{ width: 200, margin: '0 10px' }}
        value={SearchTerm}
      />
    </div>
  )
}

export default SearchFeature
