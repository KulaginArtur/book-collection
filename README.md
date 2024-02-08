# Simple Book Management System
This is a simple book management system consisting of a server-side component built with Express.js and SQLite, and a client-side component built with React.js. The system allows users to perform CRUD (Create, Read, Update, Delete) operations on a collection of books.

## Features
- View Books: Retrieve a list of books from the server and display them on the client.
- Add Book: Add a new book to the collection by providing a title, author, and description.
- Edit Book: Update the details of an existing book.
- Delete Book: Remove a book from the collection.

## Server Component: 
The server component is responsible for handling HTTP requests and managing the book data in an SQLite database.

### API Endpoints
- **GET** /api/books: Retrieve all books from the database.
- **POST** /api/books: Add a new book to the database.
- **PUT** /api/books/:id: Update an existing book.
- **DELETE** /api/books/:id: Delete a book from the database.

## Getting Started
1. Clone this repository.
2. Start the server and the client in root folder from terminal (`npm start`).
3. Access the client application in your browser at  http://localhost:5173/.

## Technologies Used
- Express.js
- React
- SQLite
- Axios (for HTTP requests)
