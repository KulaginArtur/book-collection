import { useEffect, useState } from 'react'
import './App.css'
import axios, { AxiosError, AxiosResponse } from 'axios'

interface Book {
  id?: number
  title: string
  author: string
  description: string
}

// Define initial state for a new book
const initialBookState: Book = { title: '', author: '', description: '' }

function App() {
  // State hooks for books, selected book, and latest message
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book>(initialBookState)
  const [latestMessage, setLatestMessage] = useState<{ type: string; message: string }>({ type: '', message: '' })

  // Fetch books from server on component mount
  useEffect(() => {
    fetchBooks()
  })

  // Fetch books from server
  const fetchBooks = async () => {
    try {
      const response: AxiosResponse<Book[]> = await axios.get<Book[]>('http://localhost:8080/api/books')
      setBooks(response.data)
    } catch (error) {
      handleAxiosError(error as AxiosError)
    }
  }

  // Select a book
  const selectBook = (book: Book) => {
    setSelectedBook(book)
  }

  // Save a new book
  const saveNewBook = async (newBook: Book) => {
    try {
      await axios.post('http://localhost:8080/api/books', newBook)
      setLatestMessage({ type: 'success', message: 'New book saved successfully' })
      fetchBooks() // Refresh book list
      setSelectedBook(initialBookState)
    } catch (error) {
      handleAxiosError(error as AxiosError)
    }
  }

  // Update an existing book
  const updateBook = async (updatedBook: Book) => {
    if (!selectedBook.id) {
      setLatestMessage({ type: 'error', message: 'No book selected for update' })
      return
    }

    try {
      const updatedBookData = { ...selectedBook, ...updatedBook }
      await axios.put(`http://localhost:8080/api/books/${selectedBook.id}`, updatedBookData)
      setLatestMessage({ type: 'success', message: 'Book updated successfully' })
      fetchBooks() // Refresh book list
      setSelectedBook(initialBookState)
    } catch (error) {
      handleAxiosError(error as AxiosError)
    }
  }

  // Delete a book
  const deleteBook = async () => {
    if (!selectedBook.id) {
      setLatestMessage({ type: 'error', message: 'No book selected for deletion' })
      return
    }

    try {
      await axios.delete(`http://localhost:8080/api/books/${selectedBook.id}`)
      setLatestMessage({ type: 'success', message: 'Book deleted successfully' })
      fetchBooks() // Refresh book list
      setSelectedBook(initialBookState)
    } catch (error) {
      handleAxiosError(error as AxiosError)
    }
  }

  // Handle Axios errors
  const handleAxiosError = (error: AxiosError) => {
    if (error.response && error.response.data && typeof error.response.data === 'object' && 'error' in error.response.data) {
      setLatestMessage({ type: 'error', message: error.response.data.error as string })
    } else if (error.request) {
      setLatestMessage({ type: 'error', message: 'Network error: Unable to connect to the server' })
    } else {
      setLatestMessage({ type: 'error', message: 'An unexpected error occurred' })
    }
  }

  // Render JSX
  return (
    <div className='container'>
      <div className='left'>
        {/* Form for book details */}
        <form>
          <label>Title</label>
          <input
            type="text"
            value={selectedBook.title}
            onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
          />
          <label>Author</label>
          <input
            type="text"
            value={selectedBook.author}
            onChange={(e) => setSelectedBook({ ...selectedBook, author: e.target.value })}
          />
          <label>Description</label>
          <textarea
            value={selectedBook.description}
            onChange={(e) => setSelectedBook({ ...selectedBook, description: e.target.value })}
          ></textarea>
          {/* Container for buttons */}
          <div className="button-container">
            {/* Buttons for save new, save, and delete */}
            <button onClick={(e) => { e.preventDefault(); saveNewBook(selectedBook) }}>Save New</button>
            <button onClick={(e) => { e.preventDefault(); updateBook({ ...selectedBook }) }}>Save</button>
            <button onClick={(e) => { e.preventDefault(); deleteBook() }}>Delete</button>
          </div>
        </form>
        {/* Display latest message */}
        {latestMessage.type === 'error' && <div className="error">{latestMessage.message}</div>}
        {latestMessage.type === 'success' && <div className="success">{latestMessage.message}</div>}
      </div>
      <div className='right'>
        {/* Render book list */}
        <ul>
          {books.map((book) => (
            <li key={book.id} onClick={() => selectBook(book)}>
              {book.title} - {book.author}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App
