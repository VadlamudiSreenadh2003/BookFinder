import React, { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim()) onSearch(value.trim())
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <input
        placeholder="Search by book title..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  )
}
