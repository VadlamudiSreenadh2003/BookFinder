 import React from 'react'

function coverUrl(cover_i) {
  return cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg` : null
}

export default function BookCard({ book, onSelect }) {
  const title = book.title || 'Untitled'
  const authors = (book.author_name || []).join(', ')
  const cover = coverUrl(book.cover_i)
  // Only API results have /works/ keys
  const bookUrl =
    typeof book.key === "string" && book.key.startsWith("/works/")
      ? `https://openlibrary.org${book.key}`
      : null

  return (
    <article className="card" onClick={onSelect} style={{ cursor: "pointer" }}>
      <div className="cover">
        {cover ? <img src={cover} alt={title} /> : <div className="no-cover">No Cover</div>}
      </div>
      <div className="card-body">
        <h3>{title}</h3>
        <p className="book-authors">{authors}</p>
        <p className="book-meta">First: {book.first_publish_year || '—'}</p>
        {bookUrl && (
          <a
            href={bookUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()} // so modal does not open when clicking the external link
            style={{ display: "inline-block", marginTop: 8, color: "#2563eb", textDecoration: 'underline', fontWeight: 600 }}
          >
            View on OpenLibrary
          </a>
        )}
      </div>
    </article>
  )
}
