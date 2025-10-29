import React from 'react'

export default function BookModal({ book, onClose }) {
  const cover = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-grid">
          <div>
            {cover ? <img src={cover} alt={book.title} className="modal-cover" /> : <div className="no-cover modal-no-cover">No Cover</div>}
          </div>
          <div>
            <h2>{book.title}</h2>
            <p><strong>Authors:</strong> {(book.author_name || []).join(', ') || '—'}</p>
            <p><strong>First Published:</strong> {book.first_publish_year || '—'}</p>
            <p><strong>Publisher:</strong> {(book.publisher || []).slice(0, 3).join(', ') || '—'}</p>
            <a href={`https://openlibrary.org${book.key}`} target="_blank" rel="noreferrer">View on Open Library</a>
          </div>
        </div>
      </div>
    </div>
  )
}
