const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()

const app = express()
const PORT = 8080

app.use(bodyParser.json())

// Middleware to enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  next()
})

// Connect to SQLite file-based database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database connection:', err.message)
  } else {
    console.log('Connected to the SQLite database.')
  }
})

// Create books table if not exists
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, description TEXT)')
})

// API endpoints
app.get('/api/books', async (req, res) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
          reject(err)
          return
        }
        resolve(rows)
      })
    })
    res.json(rows)
  } catch (error) {
    console.error('Error retrieving books:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.post('/api/books', async (req, res) => {
  const { title, author, description } = req.body
  try {
    await new Promise((resolve, reject) => {
      db.run('INSERT INTO books (title, author, description) VALUES (?, ?, ?)', [title, author, description], function (err) {
        if (err) {
          reject(err)
          return
        }
        resolve(this.lastID)
      });
    });
    res.json({ id: this.lastID })
  } catch (error) {
    console.error('Error inserting book:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.put('/api/books/:id', async (req, res) => {
  const { id } = req.params
  const { title, author, description } = req.body
  try {
    await new Promise((resolve, reject) => {
      db.run('UPDATE books SET title = ?, author = ?, description = ? WHERE id = ?', [title, author, description, id], function (err) {
        if (err) {
          reject(err)
          return
        }
        if (this.changes === 0) {
          res.status(404).json({ error: 'Book not found' })
          return
        }
        resolve('Book updated successfully')
      })
    })
    res.json({ message: 'Book updated successfully' })
  } catch (error) {
    console.error('Error updating book:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.delete('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM books WHERE id = ?', id, function (err) {
        if (err) {
          reject(err)
          return
        }
        if (this.changes === 0) {
          res.status(404).json({ error: 'Book not found' })
          return
        }
        resolve('Book deleted successfully')
      })
    })
    res.json({ message: 'Book deleted successfully' })
  } catch (error) {
    console.error('Error deleting book:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
