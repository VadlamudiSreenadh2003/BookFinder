 import React, { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import BookCard from './BookCard'
import BookModal from './BookModal'

const PAGE_SIZE = 20

export default function App() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [numFound, setNumFound] = useState(0)
  const [selected, setSelected] = useState(null)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    if (!query) {
      setBooks([])
      setNumFound(0)
      setError(null)
      return
    }
    const controller = new AbortController()
    async function fetchBooks() {
      try {
        setLoading(true)
        setError(null)
        const q = encodeURIComponent(query)
        const res = await fetch(`https://openlibrary.org/search.json?title=${q}&page=${page}`, { signal: controller.signal })
        if (!res.ok) throw new Error('Network error')
        const data = await res.json()
        setBooks(data.docs || [])
        setNumFound(data.numFound || 0)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
    return () => controller.abort()
  }, [query, page])

  const totalPages = Math.max(1, Math.ceil(numFound / PAGE_SIZE))

  return (
    <div className={`app-root${dark ? ' dark' : ''}`}>
      <header className="header">
        {/* <button
          className="theme-toggle"
          onClick={() => setDark(d => !d)}
          style={{ float: "right", margin: 8, fontWeight: 700, borderRadius: 5, padding: "5px 12px" }}
          aria-label="Toggle Dark Mode"
        >
          {dark ? '🌙 Dark' : '☀️ Light'}
        </button> */}
        <h1>BookFinder</h1>
        <p className="subtitle">Search books using Open Library</p>
      </header>

      <main className="container">
        <SearchBar onSearch={setQuery} />

        {error && <div className="error">Error: {error}</div>}
        {loading && (
          <div className="grid">
            {[...Array(PAGE_SIZE)].map((_, idx) => (
              <div className="card card-skeleton" key={idx}>
                <div className="cover no-cover" />
                <div style={{ height: 18, background: '#eee', marginBottom: 8, borderRadius: 3 }} />
                <div style={{ height: 13, background: '#ececec', marginBottom: 4, borderRadius: 2 }} />
              </div>
            ))}
          </div>
        )}
        {!loading && !error && query && (
          <div className="results-info">
            Found {numFound.toLocaleString()} results — page {page} / {totalPages}
          </div>
        )}
        <div className="grid">
          {books.length === 0 && !loading && query && <div className="info">No results found.</div>}
          {books.map((b) => (
            <BookCard key={b.key} book={b} onSelect={() => setSelected(b)} />
          ))}
        </div>
        {books.length > 0 && (
          <div className="pagination">
            <button onClick={() => setPage(1)} disabled={page === 1}>First</button>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <span>
              Page <input
                type="number"
                min="1"
                max={totalPages}
                value={page}
                onChange={e => setPage(Number(e.target.value) || 1)}
                style={{ width: 45, marginLeft: 6, marginRight: 6 }}
              /> / {totalPages}
            </span>
            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page >= totalPages}>Next</button>
            <button onClick={() => setPage(totalPages)} disabled={page >= totalPages}>Last</button>
          </div>
        )}
        {selected && <BookModal book={selected} onClose={() => setSelected(null)} />}
      </main>

      <footer className="footer">
        <small>
          &copy; {new Date().getFullYear()} BookFinder &bull; Data from Open Library &bull; Built with React
          <span style={{ marginLeft: '1em' }}>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="#">Contact</a>
            <a href="#">Privacy</a>
          </span>
        </small>
      </footer>
    </div>
  )
}
